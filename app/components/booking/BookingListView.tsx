import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, FlatList } from 'react-native';
import { X, Users, Calendar, Clock, MapPin } from 'lucide-react-native';
import type { Booking } from './BookingCalendar';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale/tr';
import { colors } from '@/app/theme/colors';

type BookingListViewProps = {
  bookings: Record<string, Booking[]>;
  maxVisible?: number;
};

export function BookingListView({ bookings, maxVisible = 3 }: BookingListViewProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAllBookings, setShowAllBookings] = useState(false);

  const formatBookingDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy - EEEE', { locale: tr });
  };

  const getPlayerCountStyle = (currentPlayers: number, maxPlayers: number = 4) => {
    const isEvenPlayers = currentPlayers % 2 === 0;
    
    return {
      backgroundColor: isEvenPlayers ? 'rgba(22, 255, 145, 0.15)' : 'rgba(255, 90, 90, 0.15)',
      borderColor: isEvenPlayers ? '#16FF91' : '#FF5A5A',
    };
  };

  const getPlayerCountTextStyle = (currentPlayers: number, maxPlayers: number = 4) => {
    const isEvenPlayers = currentPlayers % 2 === 0;
    return {
      color: isEvenPlayers ? '#16FF91' : '#FF5A5A',
    };
  };

  // Flatten and sort all bookings by date
  const allBookings = Object.entries(bookings)
    .flatMap(([date, dateBookings]) => 
      dateBookings.map(booking => ({ ...booking, dateKey: date }))
    )
    .sort((a, b) => new Date(a.dateKey).getTime() - new Date(b.dateKey).getTime());

  const visibleBookings = showAllBookings ? allBookings : allBookings.slice(0, maxVisible);
  const hasMoreBookings = allBookings.length > maxVisible;

  const renderBookingItem = ({ item: booking }: { item: any }) => (
    <TouchableOpacity
      style={styles.bookingBar}
      onPress={() => {
        setSelectedBooking(booking);
        setSelectedDate(booking.dateKey);
      }}
    >
      <View style={styles.bookingInfo}>
        <Text style={styles.courtName}>{booking.courtName}</Text>
        <View style={styles.detailsRow}>
          <Calendar size={14} color={colors.text.disabled} />
          <Text style={styles.dateTime}>{formatBookingDate(booking.dateKey)}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Clock size={14} color={colors.text.disabled} />
          <Text style={styles.dateTime}>{booking.time}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Users size={14} color={colors.text.disabled} />
          <Text style={styles.dateTime}>
            {booking.players.length} oyuncu
          </Text>
        </View>
      </View>
      <View style={[
        styles.playerCount,
        getPlayerCountStyle(booking.players.length, booking.maxPlayers)
      ]}>
        <Text style={[
          styles.playerCountText,
          getPlayerCountTextStyle(booking.players.length, booking.maxPlayers)
        ]}>
          {booking.players.length}/{booking.maxPlayers || 4}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mevcut Rezervasyonlar</Text>
        {hasMoreBookings && !showAllBookings && (
          <TouchableOpacity onPress={() => setShowAllBookings(true)}>
            <Text style={styles.seeAll}>Hepsini Gör</Text>
          </TouchableOpacity>
        )}
      </View>

      {allBookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Henüz rezervasyon yok</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            data={visibleBookings}
            renderItem={renderBookingItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            nestedScrollEnabled={true}
          />
        </View>
      )}

      {/* All Bookings Modal */}
      <Modal
        visible={showAllBookings}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAllBookings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.allBookingsModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tüm Rezervasyonlar</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowAllBookings(false)}
              >
                <X size={24} color={colors.charcoal} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={allBookings}
              renderItem={renderBookingItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={styles.modalBookingsList}
            />
          </View>
        </View>
      </Modal>

      {/* Booking Details Modal */}
      <Modal
        visible={!!selectedBooking}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setSelectedBooking(null);
          setSelectedDate(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rezervasyon Detayları</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setSelectedBooking(null);
                  setSelectedDate(null);
                }}
              >
                <X size={24} color={colors.charcoal} />
              </TouchableOpacity>
            </View>
            
            {selectedBooking && selectedDate && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.modalCourtName}>{selectedBooking.courtName}</Text>
                  <View style={styles.modalDetailRow}>
                    <Calendar size={16} color={colors.text.disabled} />
                    <Text style={styles.modalDateTime}>
                      {formatBookingDate(selectedDate)}
                    </Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Clock size={16} color={colors.text.disabled} />
                    <Text style={styles.modalDateTime}>
                      {selectedBooking.time}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.playersList}>
                  <Text style={styles.playersTitle}>Oyuncular ({selectedBooking.players.length})</Text>
                  {selectedBooking.players.map((player, index) => (
                    <View key={index} style={styles.playerItem}>
                      <Text style={styles.playerName}>{player.name}</Text>
                      <View style={[styles.skillBadge, getSkillBadgeStyle(player.skillLevel)]}>
                        <Text style={styles.skillText}>{player.skillLevel}</Text>
                      </View>
                    </View>
                  ))}
                  {selectedBooking.players.length === 0 && (
                    <Text style={styles.noPlayersText}>Henüz oyuncu yok</Text>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getSkillBadgeStyle(skillLevel: string) {
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
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.charcoal,
  },
  seeAll: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
  },
  listContainer: {
    maxHeight: 300,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text.disabled,
    textAlign: 'center',
  },
  bookingBar: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingInfo: {
    flex: 1,
  },
  courtName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.charcoal,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateTime: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
    marginLeft: 8,
  },
  playerCount: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  playerCountText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  allBookingsModal: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
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
    fontSize: 20,
    color: colors.charcoal,
  },
  closeButton: {
    padding: 4,
  },
  modalBookingsList: {
    flex: 1,
  },
  bookingHeader: {
    marginBottom: 20,
  },
  modalCourtName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.charcoal,
    marginBottom: 12,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalDateTime: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text.disabled,
    marginLeft: 8,
  },
  playersList: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 16,
  },
  playersTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.charcoal,
    marginBottom: 12,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
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
  noPlayersText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});