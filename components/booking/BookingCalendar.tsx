import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';

export type Booking = {
  id: string;
  courtName: string;
  courtType: 'padel' | 'pickleball';
  time: string;
  date: string;
  players: Array<{
    name: string;
    skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  }>;
  maxPlayers?: number;
};

type BookingCalendarProps = {
  bookings: Record<string, Booking[]>;
};

export function BookingCalendar({ bookings }: BookingCalendarProps) {
  const markedDates = Object.keys(bookings).reduce((acc, date) => {
    acc[date] = {
      marked: true,
      selected: true,
      selectedColor: 'rgba(22, 255, 145, 0.15)',
      dotColor: '#16FF91',
    };
    return acc;
  }, {} as Record<string, any>);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly View</Text>
      <Calendar
        style={styles.calendar}
        theme={{
          backgroundColor: '#111827',
          calendarBackground: '#111827',
          textSectionTitleColor: '#8F98A8',
          selectedDayBackgroundColor: '#16FF91',
          selectedDayTextColor: '#16FF91',
          todayTextColor: '#16FF91',
          dayTextColor: '#FFFFFF',
          textDisabledColor: '#464D59',
          dotColor: '#16FF91',
          monthTextColor: '#FFFFFF',
          textDayFontFamily: 'Inter-Medium',
          textMonthFontFamily: 'Inter-Bold',
          textDayHeaderFontFamily: 'Inter-Medium',
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14,
          arrowColor: '#16FF91',
        }}
        markedDates={markedDates}
        enableSwipeMonths={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827',
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  calendar: {
    borderRadius: 12,
    backgroundColor: '#22293A',
    padding: 8,
  },
}); 