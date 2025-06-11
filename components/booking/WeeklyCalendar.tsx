import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import type { Booking } from './BookingCalendar';
import { colors } from '@/app/theme/colors';

type WeeklyCalendarProps = {
  bookings: Record<string, Booking[]>;
};

export function WeeklyCalendar({ bookings }: WeeklyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start from Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const hasBooking = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return bookings[dateString] !== undefined;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Haftalık Görünüm</Text>
        <View style={styles.navigation}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigateWeek('prev')}
          >
            <ChevronLeft size={24} color="#e97d2b" />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {format(weekStart, 'MMMM yyyy')}
          </Text>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigateWeek('next')}
          >
            <ChevronRight size={24} color="#e97d2b" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.weekContainer}>
        {weekDays.map((date) => (
          <View 
            key={date.toString()} 
            style={[
              styles.dayContainer,
              hasBooking(date) && styles.bookedDay
            ]}
          >
            <Text style={styles.dayName}>{format(date, 'EEE')}</Text>
            <Text style={[
              styles.dayNumber,
              hasBooking(date) && styles.bookedDayText
            ]}>
              {format(date, 'd')}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.charcoal,
    marginBottom: 8,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButton: {
    padding: 8,
  },
  monthText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.primary,
    marginHorizontal: 16,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
  },
  dayContainer: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  bookedDay: {
    backgroundColor: colors.primary,
  },
  dayName: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.text.disabled,
    marginBottom: 4,
  },
  dayNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.charcoal,
  },
  bookedDayText: {
    color: colors.charcoal,
  },
}); 