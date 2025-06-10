import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import type { Booking } from './BookingCalendar';
import { format } from 'date-fns';
import { colors } from '@/app/theme/colors';

type BookingListViewProps = {
  bookings: Record<string, Booking[]>;
};

export function BookingListView({ bookings }: BookingListViewProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const formatBookingDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${format(date, 'MMMM d')} - ${format(date, 'EEEE')} - ${format(date, 'h:mm a')} - ${format(date, 'yyyy')}`;
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mevcut Rezervasyonlar</Text>
      <ScrollView style={styles.bookingsList}>
        {Object.entries(bookings).map(([date, dateBookings]) =>
          dateBookings.map((booking) => (
            <TouchableOpacity
              key={booking.id}
              style={styles.bookingBar}
              onPress={() => {
                setSelectedBooking(booking);
                setSelectedDate(date);
              }}
            >
              <View style={styles.bookingInfo}>
                <Text style={styles.courtName}>{booking.courtName}</Text>
                <Text style={styles.dateTime}>{formatBookingDate(date)}</Text>
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
          ))
        )}
      </ScrollView>

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
            <Text style={styles.modalTitle}>Booking Details</Text>
            {selectedBooking && selectedDate && (
              <>
                <View style={styles.bookingHeader}>
                  <Text style={styles.modalCourtName}>{selectedBooking.courtName}</Text>
                  <Text style={styles.modalDateTime}>
                    {formatBookingDate(selectedDate)}
                  </Text>
                </View>
                <View style={styles.playersList}>
                  <Text style={styles.playersTitle}>Players</Text>
                  {selectedBooking.players.map((player, index) => (
                    <View key={index} style={styles.playerItem}>
                      <Text style={styles.playerName}>{player.name}</Text>
                      <View style={[styles.skillBadge, getSkillBadgeStyle(player.skillLevel)]}>
                        <Text style={styles.skillText}>{player.skillLevel}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setSelectedBooking(null);
                setSelectedDate(null);
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getSkillBadgeStyle(skillLevel: string) {
  switch (skillLevel) {
    case 'Beginner':
      return { backgroundColor: colors.secondary, borderColor: colors.secondary };
    case 'Intermediate':
      return { backgroundColor: colors.status.warning, borderColor: colors.status.warning };
    case 'Advanced':
      return { backgroundColor: colors.status.error, borderColor: colors.status.error };
    default:
      return { backgroundColor: colors.primary, borderColor: colors.primary };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.charcoal,
    marginBottom: 16,
  },
  bookingsList: {
    flex: 1,
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
    marginBottom: 4,
  },
  dateTime: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
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
    color: colors.charcoal,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.charcoal,
    marginBottom: 16,
  },
  bookingHeader: {
    marginBottom: 20,
  },
  modalCourtName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.charcoal,
    marginBottom: 4,
  },
  modalDateTime: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text.disabled,
  },
  playersList: {
    marginBottom: 20,
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
    marginBottom: 8,
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
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.white,
  },
}); 