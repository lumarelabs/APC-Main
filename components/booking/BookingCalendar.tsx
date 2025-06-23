import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { X, Calendar as CalendarIcon, Clock, Users } from 'lucide-react-native';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale/tr';
import { colors } from '@/app/theme/colors';

// Configure Turkish locale for react-native-calendars
LocaleConfig.locales['tr'] = {
  monthNames: [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ],
  monthNamesShort: [
    'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
    'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'
  ],
  dayNames: [
    'Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'
  ],
  dayNamesShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
  today: 'Bugün'
};
LocaleConfig.defaultLocale = 'tr';

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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const getAvailabilityStatus = (date: string) => {
    const dayBookings = bookings[date] || [];
    
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

  const markedDates = Object.keys(bookings).reduce((acc, date) => {
    const availability = getAvailabilityStatus(date);
    acc[date] = {
      marked: true,
      selected: selectedDate === date,
      selectedColor: selectedDate === date ? colors.primary : 
                    availability === 'full' ? colors.status.error : 
                    availability === 'partial' ? colors.status.warning : 
                    colors.status.success,
      dotColor: availability === 'full' ? colors.status.error : 
                availability === 'partial' ? colors.status.warning : 
                colors.status.success,
    };
    return acc;
  }, {} as Record<string, any>);

  const handleDayPress = (day: { dateString: string }) => {
    const dayBookings = bookings[day.dateString] || [];
    if (dayBookings.length > 0) {
      setSelectedDate(day.dateString);
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
      <Text style={styles.title}>Aylık Görünüm</Text>
      <Calendar
        style={styles.calendar}
        theme={{
          backgroundColor: colors.background.primary,
          calendarBackground: colors.background.primary,
          textSectionTitleColor: colors.text.primary,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: colors.white,
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
        onDayPress={handleDayPress}
        firstDay={1}
        locale={'tr'}
      />

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

// Default export to satisfy Expo Router
export default BookingCalendar;

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