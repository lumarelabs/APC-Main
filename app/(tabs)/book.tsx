import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CourtTypeSelector } from '@/components/booking/CourtTypeSelector';
import { DateTimeSelector } from '@/components/booking/DateTimeSelector';
import { BookingCalendar } from '@/components/booking/BookingCalendar';
import { BookingListView } from '@/components/booking/BookingListView';
import { WeeklyCalendar } from '@/components/booking/WeeklyCalendar';
import { CourtList } from '@/components/booking/CourtList';
import { RacketRental } from '@/components/booking/RacketRental';
import { PaymentSummary } from '@/components/booking/PaymentSummary';
import { ChevronLeft, X, Users, Search } from 'lucide-react-native';
import type { Booking } from '@/components/booking/BookingCalendar';
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

  const handlePaymentConfirm = () => {
    // Payment processing would go here
    console.log('Processing payment...');
  };

  // Sample data for existing bookings
  const existingBookings: Record<string, Booking[]> = {
    '2024-03-19': [{
      id: '1',
      courtName: 'Padel Court 2',
      courtType: 'padel',
      time: '17:00',
      date: 'March 19 - Tuesday - 5:00 PM - 2024',
      maxPlayers: 4,
      players: [
        { name: 'Alex Johnson', skillLevel: 'İleri' },
        { name: 'Sarah Smith', skillLevel: 'Orta' }
      ]
    }],
    '2024-03-21': [{
      id: '2',
      courtName: 'Pickleball Court 1',
      courtType: 'pickleball',
      time: '15:30',
      date: 'March 21 - Thursday - 3:30 PM - 2024',
      maxPlayers: 4,
      players: [
        { name: 'Mike Brown', skillLevel: 'Başlangıç' },
        { name: 'Emma Davis', skillLevel: 'Orta' },
        { name: 'John Smith', skillLevel: 'İleri' },
        { name: 'Lisa Wilson', skillLevel: 'Orta' }
      ]
    }],
    '2024-03-25': [{
      id: '3',
      courtName: 'Padel Court 1',
      courtType: 'padel',
      time: '10:00',
      date: 'March 25 - Monday - 10:00 AM - 2024',
      maxPlayers: 4,
      players: [
        { name: 'Tom Wilson', skillLevel: 'İleri' }
      ]
    }]
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
            courtPrice={selectedCourt.price}
            racketCount={racketCount}
            racketPrice={5}
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
                <ChevronLeft size={24} color={colors.white} />
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