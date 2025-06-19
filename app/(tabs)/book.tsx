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
import { useCourts, useUserBookings } from '@/app/hooks/useSupabaseData';
import { useApp } from '@/app/context/AppContext';
import type { Booking } from '@/app/components/booking/BookingCalendar';
import { colors } from '@/app/theme/colors';

type BookingStep = 'court-selection' | 'date-time' | 'racket-rental' | 'payment';
type CalendarViewMode = 'weekly' | 'monthly';

export default function BookScreen() {
  const { createBooking } = useApp();
  const { courts, loading: courtsLoading } = useCourts();
  const { bookings, loading: bookingsLoading } = useUserBookings();
  
  const [courtType, setCourtType] = useState<'all' | 'padel' | 'pickleball'>('all');
  const [selectedCourt, setSelectedCourt] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [racketCount, setRacketCount] = useState(0);
  const [currentStep, setCurrentStep] = useState<BookingStep>('court-selection');
  const [calendarViewMode, setCalendarViewMode] = useState<CalendarViewMode>('weekly');
  const [isBooking, setIsBooking] = useState(false);

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
    if (!selectedCourt || !selectedDate || !selectedTime) {
      Alert.alert('Error', 'Missing booking information');
      return;
    }

    try {
      setIsBooking(true);
      
      // Parse time to get start and end times
      const [startTime, endTime] = selectedTime.split(' - ');
      
      const bookingData = {
        court_id: selectedCourt.id,
        date: selectedDate,
        start_time: startTime + ':00',
        end_time: endTime + ':00',
        status: 'confirmed' as const
      };

      await createBooking(bookingData);
      
      Alert.alert(
        'Success!', 
        'Your booking has been confirmed!',
        [
          {
            text: 'OK',
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
      Alert.alert('Error', error.message || 'Failed to create booking');
    } finally {
      setIsBooking(false);
    }
  };

  // Transform bookings for calendar components
  const existingBookings: Record<string, Booking[]> = {};
  
  bookings.forEach(booking => {
    const date = booking.date;
    if (!existingBookings[date]) {
      existingBookings[date] = [];
    }
    
    existingBookings[date].push({
      id: booking.id,
      courtName: booking.court?.name || 'Court',
      courtType: booking.court?.type || 'padel',
      time: booking.start_time.slice(0, 5),
      date: `${new Date(date).toLocaleDateString('tr-TR', { 
        month: 'long', 
        day: 'numeric', 
        weekday: 'long' 
      })} - ${booking.start_time.slice(0, 5)} - ${new Date(date).getFullYear()}`,
      maxPlayers: 4,
      players: [] // We'll implement this when we add match players
    });
  });

  const renderBookingStep = () => {
    switch (currentStep) {
      case 'court-selection':
        if (courtsLoading) {
          return (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Kortlar yükleniyor...</Text>
            </View>
          );
        }
        return (
          <View style={styles.courtList}>
            <CourtList
              courts={courts}
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
            courtPrice={selectedCourt.price_per_hour / 100} // Convert from cents
            racketCount={racketCount}
            racketPrice={100} // ₺100 per racket
            onConfirm={handlePaymentConfirm}
            isLoading={isBooking}
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
            {bookingsLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Rezervasyonlar yükleniyor...</Text>
              </View>
            ) : (
              <>
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
              </>
            )}
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text.disabled,
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