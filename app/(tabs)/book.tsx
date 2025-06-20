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
import { ChevronLeft } from 'lucide-react-native';
import { useUserBookings } from '@/app/hooks/useSupabaseData';
import { useApp } from '@/app/context/AppContext';
import { colors } from '@/app/theme/colors';

type BookingStep = 'court-selection' | 'date-time' | 'racket-rental' | 'payment';
type CalendarViewMode = 'weekly' | 'monthly';

export default function BookScreen() {
  const [courtType, setCourtType] = useState<'all' | 'padel' | 'pickleball'>('all');
  const [selectedCourt, setSelectedCourt] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [racketCount, setRacketCount] = useState(0);
  const [currentStep, setCurrentStep] = useState<BookingStep>('court-selection');
  const [calendarViewMode, setCalendarViewMode] = useState<CalendarViewMode>('weekly');

  const { createBooking } = useApp();
  const { bookings } = useUserBookings();

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
        setCurrentStep('court-selection');
        setSelectedDate(null);
        setSelectedTime(null);
        break;
      case 'court-selection':
        if (selectedCourt) {
          setSelectedCourt(null);
        }
        break;
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
      const [startTime] = selectedTime.split(' - ');
      const startHour = parseInt(startTime.split(':')[0]);
      const endTime = `${(startHour + 1).toString().padStart(2, '0')}:00`;

      const bookingData = {
        court_id: selectedCourt.id,
        date: selectedDate,
        start_time: `${startTime}:00`,
        end_time: endTime,
        status: 'confirmed' as const,
        type: 'court_booking',
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
            }
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Rezervasyon oluşturulamadı');
    }
  };

  // Transform bookings for calendar display
  const existingBookings: Record<string, any[]> = {};
  bookings.forEach(booking => {
    const dateKey = booking.date;
    if (!existingBookings[dateKey]) {
      existingBookings[dateKey] = [];
    }
    existingBookings[dateKey].push({
      id: booking.id,
      courtName: booking.court?.name || 'Bilinmeyen Kort',
      courtType: booking.court?.type || 'padel',
      time: booking.start_time.slice(0, 5),
      date: new Date(booking.date).toLocaleDateString('tr-TR', {
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: '2-digit',
        year: 'numeric'
      }),
      maxPlayers: 4,
      players: [] // Will be populated from matches data later
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
      case 'date-time':
        return (
          <>
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
          </>
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
      <ScrollView style={styles.container}>
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
            <Text style={styles.headerTitle}>Kort Rezervasyonu</Text>
          </View>
          
          {currentStep === 'court-selection' && (
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
                style={[styles.viewOption, calendarViewMode === 'weekly' && styles.viewOptionActive]}
                onPress={() => setCalendarViewMode('weekly')}
              >
                <Text style={[styles.viewOptionText, calendarViewMode === 'weekly' && styles.viewOptionTextActive]}>
                  Haftalık Görünüm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.viewOption, calendarViewMode === 'monthly' && styles.viewOptionActive]}
                onPress={() => setCalendarViewMode('monthly')}
              >
                <Text style={[styles.viewOptionText, calendarViewMode === 'monthly' && styles.viewOptionTextActive]}>
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
              {Object.keys(existingBookings).length === 0 ? (
                <View style={styles.noBookingsContainer}>
                  <Text style={styles.noBookingsText}>Henüz rezervasyonunuz yok</Text>
                </View>
              ) : (
                <BookingListView bookings={existingBookings} />
              )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.secondary,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.charcoal,
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
  },
  viewOptionActive: {
    backgroundColor: colors.secondary,
  },
  viewOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.secondary,
  },
  viewOptionTextActive: {
    color: colors.primary,
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
  noBookingsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noBookingsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text.disabled,
    textAlign: 'center',
  },
});