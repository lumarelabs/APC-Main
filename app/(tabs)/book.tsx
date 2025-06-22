import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CourtTypeSelector } from '@/app/components/booking/CourtTypeSelector';
import { DateTimeSelector } from '@/app/components/booking/DateTimeSelector';
import { BookingCalendar } from '@/app/components/booking/BookingCalendar';
import { BookingListView } from '@/app/components/booking/BookingListView';
import { WeeklyCalendar } from '@/app/components/booking/WeeklyCalendar';
import { CourtList } from '@/app/components/booking/CourtList';
import { RacketRental } from '@/app/components/booking/RacketRental';
import { PaymentSummary } from '@/app/components/booking/PaymentSummary';
import { LessonBooking } from '@/app/components/booking/LessonBooking';
import { ChevronLeft } from 'lucide-react-native';
import { useAllBookings, useCourts } from '@/app/hooks/useSupabaseData';
import { useApp } from '@/app/context/AppContext';
import { colors } from '@/app/theme/colors';

type BookingStep = 'court-selection' | 'lesson-booking' | 'date-time' | 'racket-rental' | 'payment';
type CalendarViewMode = 'weekly' | 'monthly';
type BookingType = 'court' | 'lesson';

export default function BookScreen() {
  const [bookingType, setBookingType] = useState<BookingType>('court');
  const [courtType, setCourtType] = useState<'all' | 'padel' | 'pickleball'>('all');
  const [selectedCourt, setSelectedCourt] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [racketCount, setRacketCount] = useState(0);
  const [currentStep, setCurrentStep] = useState<BookingStep>('court-selection');
  const [calendarViewMode, setCalendarViewMode] = useState<CalendarViewMode>('weekly');

  const { createBooking } = useApp();
  const { bookings } = useAllBookings(); // Use all bookings for calendar display
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
  };

  const handleBookingTypeToggle = (type: BookingType) => {
    setBookingType(type);
    // Reset selections when switching types
    setSelectedCourt(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setRacketCount(0);
    
    if (type === 'lesson') {
      setCurrentStep('lesson-booking');
    } else {
      setCurrentStep('court-selection');
    }
  };

  const handleDateTimeSelected = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleDateTimeConfirm = () => {
    if (selectedDate && selectedTime) {
      setCurrentStep('racket-rental');
    }
  };

  const handleRacketRentalComplete = (count: number) => {
    setRacketCount(count);
    setCurrentStep('payment');
  };

  const handlePaymentConfirm = async () => {
    try {
      if (!selectedCourt || !selectedDate || !selectedTime) {
        Alert.alert('Hata', 'Eksik rezervasyon bilgisi');
        return;
      }

      // Parse time to get start and end times
      const timeRange = selectedTime.includes(' - ') ? selectedTime : `${selectedTime} - ${selectedTime}`;
      const [startTime] = timeRange.split(' - ');
      const startHour = parseInt(startTime.split(':')[0]);
      const endTime = `${(startHour + 1).toString().padStart(2, '0')}:00`;

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
        'Rezervasyonunuz onaylandı.',
        [
          {
            text: 'Tamam',
            onPress: () => {
              // Reset form
              setSelectedCourt(null);
              setSelectedDate(null);
              setSelectedTime(null);
              setRacketCount(0);
              setCurrentStep('court-selection');
              setBookingType('court');
            }
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Rezervasyon oluşturulamadı');
    }
  };

  // Transform bookings for calendar display - show ALL future bookings from ALL users
  const existingBookings: Record<string, any[]> = {};
  
  // Filter to show only future bookings
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  bookings
    .filter(booking => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate >= today;
    })
    .forEach(booking => {
      const dateKey = booking.date;
      if (!existingBookings[dateKey]) {
        existingBookings[dateKey] = [];
      }
      existingBookings[dateKey].push({
        id: booking.id,
        courtName: booking.court?.name || 'Bilinmeyen Kort',
        courtType: booking.court?.type || 'padel',
        time: `${booking.start_time.slice(0, 5)} - ${booking.end_time.slice(0, 5)}`,
        date: new Date(booking.date).toLocaleDateString('tr-TR', {
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          hour: 'numeric',
          minute: '2-digit',
          year: 'numeric'
        }),
        maxPlayers: 4,
        players: [
          {
            name: 'Kullanıcı',
            skillLevel: 'Orta'
          }
        ] // Mock player data - in real app this would come from matches/players data
      });
    });

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
              }}
            />
          </View>
        );
      case 'lesson-booking':
        return (
          <LessonBooking
            onComplete={(lessonData) => {
              // Set a default court for lessons (you might want to handle this differently)
              const padelCourts = courts.filter(court => court.type === 'padel');
              if (padelCourts.length > 0) {
                setSelectedCourt(padelCourts[0]);
              }
              setCurrentStep('date-time');
            }}
          />
        );
      case 'date-time':
        return (
          <View style={styles.dateTimeContainer}>
            <DateTimeSelector
              onSelectDateTime={handleDateTimeSelected}
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
        return (
          <PaymentSummary
            courtName={selectedCourt.name}
            courtType={selectedCourt.type}
            date={selectedDate!}
            time={selectedTime!}
            courtPrice={selectedCourt.price_per_hour / 100}
            racketCount={racketCount}
            racketPrice={100}
            onConfirm={handlePaymentConfirm}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Half - Booking Section */}
        <View style={styles.topSection}>
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
        </View>

        {/* Bottom Half - Calendar and Bookings */}
        {(currentStep === 'court-selection' || currentStep === 'date-time') && (
          <View style={styles.bottomSection}>
            {/* Calendar View Selector */}
            <View style={styles.viewSelector}>
              <TouchableOpacity
                style={[
                  styles.viewOption, 
                  calendarViewMode === 'weekly' && styles.viewOptionActive
                ]}
                onPress={() => setCalendarViewMode('weekly')}
              >
                <Text style={[
                  styles.viewOptionText, 
                  calendarViewMode === 'weekly' && styles.viewOptionTextActive
                ]}>
                  Haftalık Görünüm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.viewOption, 
                  calendarViewMode === 'monthly' && styles.viewOptionActive
                ]}
                onPress={() => setCalendarViewMode('monthly')}
              >
                <Text style={[
                  styles.viewOptionText, 
                  calendarViewMode === 'monthly' && styles.viewOptionTextActive
                ]}>
                  Aylık Görünüm
                </Text>
              </TouchableOpacity>
            </View>

            {/* Calendar */}
            {calendarViewMode === 'weekly' ? (
              <WeeklyCalendar bookings={existingBookings} />
            ) : (
              <BookingCalendar bookings={existingBookings} />
            )}

            {/* Bookings List */}
            <View style={styles.bookingsListContainer}>
              <BookingListView bookings={existingBookings} maxVisible={3} />
            </View>
          </View>
        )}
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
  topSection: {
    paddingTop: 16,
    paddingBottom: 8,
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
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: colors.background.secondary,
    paddingBottom: 100,
  },
  viewSelector: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  viewOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  viewOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  viewOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
  },
  viewOptionTextActive: {
    fontFamily: 'Inter-Bold',
    color: colors.white,
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
  bookingsListContainer: {
    marginTop: 8,
  },
});