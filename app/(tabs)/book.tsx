import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CourtTypeSelector } from '@/app/components/booking/CourtTypeSelector';
import { DateTimeSelector } from '@/app/components/booking/DateTimeSelector';
import { CourtList } from '@/app/components/booking/CourtList';
import { RacketRental } from '@/app/components/booking/RacketRental';
import { PaymentSummary } from '@/app/components/booking/PaymentSummary';
import { LessonBooking } from '@/app/components/booking/LessonBooking';
import { ChevronLeft } from 'lucide-react-native';
import { useAllBookings, useCourts } from '@/app/hooks/useSupabaseData';
import { useApp } from '@/app/context/AppContext';
import { colors } from '@/app/theme/colors';

type BookingStep = 'court-selection' | 'lesson-booking' | 'date-time' | 'racket-rental' | 'payment';
type BookingType = 'court' | 'lesson';

export default function BookScreen() {
  const [bookingType, setBookingType] = useState<BookingType>('court');
  const [courtType, setCourtType] = useState<'all' | 'padel' | 'pickleball'>('all');
  const [selectedCourt, setSelectedCourt] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [racketCount, setRacketCount] = useState(0);
  const [currentStep, setCurrentStep] = useState<BookingStep>('court-selection');

  const scrollViewRef = useRef<ScrollView>(null);

  const { createBooking } = useApp();
  const { courts } = useCourts();

  const handleBack = () => {
    switch (currentStep) {
      case 'payment':
        setCurrentStep('racket-rental');
        break;
      case 'racket-rental':
        setCurrentStep('date-time');
        setRacketCount(0);
        break;
      case 'date-time':
        if (bookingType === 'lesson') {
          setCurrentStep('lesson-booking');
        } else {
          setCurrentStep('court-selection');
        }
        setSelectedDate(null);
        setSelectedTime(null);
        break;
      case 'lesson-booking':
        setCurrentStep('court-selection');
        break;
      case 'court-selection':
        if (selectedCourt) {
          setSelectedCourt(null);
        }
        break;
    }
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleBookingTypeToggle = (type: BookingType) => {
    setBookingType(type);
    setSelectedCourt(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setRacketCount(0);
    
    if (type === 'lesson') {
      setCurrentStep('lesson-booking');
    } else {
      setCurrentStep('court-selection');
    }
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleDateTimeSelected = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleDateTimeConfirm = () => {
    if (selectedDate && selectedTime) {
      setCurrentStep('racket-rental');
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleRacketRentalComplete = (count: number) => {
    setRacketCount(count);
    setCurrentStep('payment');
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handlePaymentConfirm = async () => {
    try {
      if (!selectedCourt || !selectedDate || !selectedTime) {
        Alert.alert('Hata', 'Eksik rezervasyon bilgisi');
        return;
      }

      const timeRange = selectedTime.includes(' - ') ? selectedTime : `${selectedTime} - ${selectedTime}`;
      const [startTime] = timeRange.split(' - ');
      const startHour = parseInt(startTime.split(':')[0]);
      const endTime = `${(startHour + 1).toString().padStart(2, '0')}:00`;

      // Calculate dynamic pricing based on time - direct TL calculation
      let finalPrice = selectedCourt.price_per_hour; // Direct TL value from database
      
      // Add 300 TL if booking is after 8:30 PM (20:30)
      if (startHour >= 20 && parseInt(startTime.split(':')[1]) >= 30) {
        finalPrice += 300;
      }

      const bookingData = {
        court_id: selectedCourt.id,
        date: selectedDate,
        start_time: `${startTime}:00`,
        end_time: endTime,
        status: 'confirmed' as const,
        type: bookingType === 'lesson' ? 'lesson_booking' : 'court_booking',
        includes_racket: racketCount > 0
      };

      await createBooking(bookingData);
      
      Alert.alert(
        'Başarılı!', 
        `Rezervasyonunuz onaylandı. ${finalPrice > selectedCourt.price_per_hour ? 'Gece tarifesi uygulandı.' : ''}`,
        [
          {
            text: 'Tamam',
            onPress: () => {
              setSelectedCourt(null);
              setSelectedDate(null);
              setSelectedTime(null);
              setRacketCount(0);
              setCurrentStep('court-selection');
              setBookingType('court');
              scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            }
          }
        ]
      );
    } catch (error: any) {
      // Show user-friendly error messages for booking conflicts
      let errorMessage = error.message || 'Rezervasyon oluşturulamadı';
      
      if (errorMessage.includes('zaten bir rezervasyon') || 
          errorMessage.includes('farklı bir saat')) {
        // This is a booking conflict - show specific message
        Alert.alert(
          'Rezervasyon Çakışması', 
          errorMessage,
          [
            {
              text: 'Tamam',
              onPress: () => {
                // Go back to date-time selection to choose a different time
                setCurrentStep('date-time');
                setSelectedTime(null);
                scrollViewRef.current?.scrollTo({ y: 0, animated: true });
              }
            }
          ]
        );
      } else {
        // Generic error
        Alert.alert('Hata', errorMessage);
      }
    }
  };

  const renderBookingStep = () => {
    switch (currentStep) {
      case 'court-selection':
        return (
          <View style={styles.courtList}>
            <CourtList
              courtType={courtType}
              onSelectCourt={(court) => {
                setSelectedCourt(court);
                setCurrentStep('date-time');
                scrollViewRef.current?.scrollTo({ y: 0, animated: true });
              }}
            />
          </View>
        );
      case 'lesson-booking':
        return (
          <LessonBooking
            onComplete={(lessonData) => {
              const padelCourts = courts.filter(court => court.type === 'padel');
              if (padelCourts.length > 0) {
                setSelectedCourt(padelCourts[0]);
              }
              setCurrentStep('date-time');
              scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            }}
          />
        );
      case 'date-time':
        return (
          <View style={styles.dateTimeContainer}>
            <DateTimeSelector
              onSelectDateTime={handleDateTimeSelected}
              selectedCourt={selectedCourt}
            />
            {selectedDate && selectedTime && (
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleDateTimeConfirm}
              >
                <Text style={styles.confirmButtonText}>Tarih & Saat Onayla</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      case 'racket-rental':
        return (
          <RacketRental
            onComplete={handleRacketRentalComplete}
          />
        );
      case 'payment':
        // Calculate dynamic pricing for payment summary - direct TL
        let courtPrice = selectedCourt.price_per_hour; // Direct TL value
        if (selectedTime) {
          const [startTime] = selectedTime.split(' - ');
          const startHour = parseInt(startTime.split(':')[0]);
          if (startHour >= 20 && parseInt(startTime.split(':')[1]) >= 30) {
            courtPrice += 300;
          }
        }
        
        return (
          <PaymentSummary
            courtName={selectedCourt.name}
            courtType={selectedCourt.type}
            date={selectedDate!}
            time={selectedTime!}
            courtPrice={courtPrice}
            racketCount={racketCount}
            racketPrice={125} // Updated to 125 TL
            onConfirm={handlePaymentConfirm}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          {(currentStep !== 'court-selection' || selectedCourt) && (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBack}
            >
              <ChevronLeft size={24} color={colors.charcoal} />
            </TouchableOpacity>
          )}
          
          {/* Booking Type Selector */}
          <View style={styles.bookingTypeSelector}>
            <TouchableOpacity
              style={[
                styles.bookingTypeButton,
                bookingType === 'court' && styles.activeBookingTypeButton
              ]}
              onPress={() => handleBookingTypeToggle('court')}
            >
              <Text style={[
                styles.bookingTypeText,
                bookingType === 'court' && styles.activeBookingTypeText
              ]}>
                Kort Rezervasyonu
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.bookingTypeButton,
                bookingType === 'lesson' && styles.activeBookingTypeButton
              ]}
              onPress={() => handleBookingTypeToggle('lesson')}
            >
              <Text style={[
                styles.bookingTypeText,
                bookingType === 'lesson' && styles.activeBookingTypeText
              ]}>
                Ders Rezervasyonu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {currentStep === 'court-selection' && bookingType === 'court' && (
          <CourtTypeSelector
            selectedType={courtType}
            onSelectType={setCourtType}
          />
        )}

        <View style={styles.bookingContent}>
          {renderBookingStep()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.secondary,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 12,
    zIndex: 1,
  },
  bookingTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: 25,
    padding: 4,
    marginHorizontal: 20,
  },
  bookingTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeBookingTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  bookingTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
  },
  activeBookingTypeText: {
    fontFamily: 'Inter-Bold',
    color: colors.white,
  },
  bookingContent: {
    paddingHorizontal: 16,
  },
  courtList: {
    marginBottom: 8,
  },
  dateTimeContainer: {
    // Prevent auto-scroll by not using flex
  },
  confirmButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.white,
  },
});