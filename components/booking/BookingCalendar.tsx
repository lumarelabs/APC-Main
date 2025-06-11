import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors } from '@/app/theme/colors';

export type Booking = {
  id: string;
  courtName: string;
  courtType: 'padel' | 'pickleball';
  time: string;
  date: string;
  players: Array<{
    name: string;
    skillLevel: 'Başlangıç' | 'Orta' | 'İleri';
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
      selectedColor: colors.primary,
      dotColor: colors.primary,
    };
    return acc;
  }, {} as Record<string, any>);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aylık Görünüm</Text>
      <Calendar
        style={styles.calendar}
        theme={{
          backgroundColor: colors.background.primary,
          calendarBackground: colors.background.primary,
          textSectionTitleColor: colors.text.primary,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: colors.text.primary,
          todayTextColor: colors.primary,
          dayTextColor: colors.text.primary,
          textDisabledColor: colors.text.disabled,
          dotColor: colors.primary,
          monthTextColor: colors.text.primary,
          textDayFontFamily: 'Inter-Medium',
          textMonthFontFamily: 'Inter-Bold',
          textDayHeaderFontFamily: 'Inter-Medium',
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14,
          arrowColor: colors.primary,
        }}
        markedDates={markedDates}
        enableSwipeMonths={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: 16,
  },
  calendar: {
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    padding: 8,
  },
}); 