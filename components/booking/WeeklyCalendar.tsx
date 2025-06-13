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

  const getAvailabilityStatus = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const dayBookings = bookings[dateString] || [];
    
    // Count total players for the day
    const totalPlayers = dayBookings.reduce((sum, booking) => {
      return sum + (booking.players?.length || 0);
    }, 0);
    
    // Assuming max capacity is 16 players per day (4 courts * 4 players)
    const maxCapacity = 16;
    
    if (totalPlayers >= maxCapacity) {
      return 'full';
    } else if (totalPlayers > 0) {
      return 'partial';
    }
    return 'available';
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
            <ChevronLeft size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {format(weekStart, 'MMMM yyyy')}
          </Text>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigateWeek('next')}
          >
            <ChevronRight size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.weekContainer}>
        {weekDays.map((date) => {
          const availability = getAvailabilityStatus(date);
          return (
            <View 
              key={date.toString()} 
              style={[
                styles.dayContainer,
                availability === 'full' && styles.fullDay,
                availability === 'partial' && styles.partialDay,
                availability === 'available' && styles.availableDay
              ]}
            >
              <Text style={styles.dayName}>{format(date, 'EEE')}</Text>
              <Text style={[
                styles.dayNumber,
                availability === 'full' && styles.fullDayText,
                availability === 'partial' && styles.partialDayText,
                availability === 'available' && styles.availableDayText
              ]}>
                {format(date, 'd')}
              </Text>
            </View>
          );
        })}
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
  fullDay: {
    backgroundColor: colors.error,
  },
  partialDay: {
    backgroundColor: colors.warning,
  },
  availableDay: {
    backgroundColor: colors.status.success,
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
  fullDayText: {
    color: colors.white,
  },
  partialDayText: {
    color: colors.charcoal,
  },
  availableDayText: {
    color: colors.white,
  },
}); 