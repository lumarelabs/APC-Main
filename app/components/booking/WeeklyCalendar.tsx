import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, X, Clock, Users } from 'lucide-react-native';
import type { Booking } from './BookingCalendar';
import { colors } from '@/app/theme/colors';

type WeeklyCalendarProps = {
  bookings: Record<string, Booking[]>;
};

export function WeeklyCalendar({ bookings }: WeeklyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  
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

  const handleDayPress = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const dayBookings = bookings[dateString] || [];
    
    if (dayBookings.length > 0) {
      setSelectedDate(dateString);
      setSelectedBookings(dayBookings);
      setModalVisible(true);
    }
  };

  const formatModalDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy - EEEE', { locale: tr });
  };

  const getSkillBadgeStyle = (skillLevel: string) => {
    switch (skillLevel) {
      case 'Başlangıç':
        return { backgroundColor: colors.secondary, borderColor: colors.secondary };
      case 'Orta':
        return { backgroundColor: colors.status.warning, borderColor: colors.status.warning };
      case 'İleri':
        return { backgroundColor: colors.status.error, borderColor: colors.status.error };
      default:
        return { backgroundColor: colors.primary, borderColor: colors.primary };
    }
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
            {format(weekStart, 'MMMM yyyy', { locale: tr })}
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
          const dateString = format(date, 'yyyy-MM-dd');
          const hasBookings = bookings[dateString] && bookings[dateString].length > 0;
          
          return (
            <TouchableOpacity
              key={date.toString()} 
              style={[
                styles.dayContainer,
                availability === 'full' && styles.fullDay,
                availability === 'partial' && styles.partialDay,
                availability === 'available' && hasBookings && styles.availableDay
              ]}
              onPress={() => handleDayPress(date)}
              disabled={!hasBookings}
            >
              <Text style={styles.dayName}>
                {format(date, 'EEE', { locale: tr })}
              </Text>
              <Text style={[
                styles.dayNumber,
                availability === 'full' && styles.fullDayText,
                availability === 'partial' && styles.partialDayText,
                availability === 'available' && hasBookings && styles.availableDayText
              ]}>
                {format(date, 'd')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Day Details Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedDate ? formatModalDate(selectedDate) : ''}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <X size={24} color={colors.charcoal} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedBookings.map((booking, index) => (
                <View key={booking.id} style={styles.bookingCard}>
                  <View style={styles.bookingHeader}>
                    <Text style={styles.courtName}>{booking.courtName}</Text>
                    <View style={[styles.typeBadge, { 
                      backgroundColor: booking.courtType === 'padel' ? 'rgba(22, 255, 145, 0.15)' : 'rgba(50, 209, 255, 0.15)'
                    }]}>
                      <Text style={[styles.typeText, { 
                        color: booking.courtType === 'padel' ? '#16FF91' : '#32D1FF'
                      }]}>
                        {booking.courtType === 'padel' ? 'Padel' : 'Pickleball'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bookingDetails}>
                    <View style={styles.detailRow}>
                      <Clock size={16} color={colors.text.disabled} />
                      <Text style={styles.detailText}>{booking.time}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Users size={16} color={colors.text.disabled} />
                      <Text style={styles.detailText}>
                        {booking.players.length}/{booking.maxPlayers || 4} oyuncu
                      </Text>
                    </View>
                  </View>

                  {booking.players.length > 0 && (
                    <View style={styles.playersSection}>
                      <Text style={styles.playersTitle}>Oyuncular:</Text>
                      {booking.players.map((player, playerIndex) => (
                        <View key={playerIndex} style={styles.playerItem}>
                          <Text style={styles.playerName}>{player.name}</Text>
                          <View style={[styles.skillBadge, getSkillBadgeStyle(player.skillLevel)]}>
                            <Text style={styles.skillText}>{player.skillLevel}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    textTransform: 'capitalize',
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
    minWidth: 40,
  },
  fullDay: {
    backgroundColor: colors.status.error,
  },
  partialDay: {
    backgroundColor: colors.status.warning,
  },
  availableDay: {
    backgroundColor: colors.status.success,
  },
  dayName: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.text.disabled,
    marginBottom: 4,
    textTransform: 'capitalize',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.charcoal,
    flex: 1,
    textTransform: 'capitalize',
  },
  closeButton: {
    padding: 4,
  },
  bookingCard: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  courtName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.charcoal,
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  bookingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
    marginLeft: 8,
  },
  playersSection: {
    borderTopWidth: 1,
    borderTopColor: colors.background.secondary,
    paddingTop: 12,
  },
  playersTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: colors.charcoal,
    marginBottom: 8,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  playerName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.charcoal,
  },
  skillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  skillText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.charcoal,
  },
});