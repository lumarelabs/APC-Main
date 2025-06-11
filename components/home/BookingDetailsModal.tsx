import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { X, Users } from 'lucide-react-native';
import { colors } from '@/app/theme/colors';

type BookingDetailsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  booking: {
    courtName: string;
    courtType: string;
    date: string;
    time: string;
    image: string;
    players?: Array<{ name: string; skillLevel: string }>;
  };
};

export const BookingDetailsModal = ({ isVisible, onClose, booking }: BookingDetailsModalProps) => {
  const maxPlayers = 4;
  const currentPlayers = booking.players?.length || 0;

  const getStatusColor = () => {
    if (currentPlayers === maxPlayers) return '#16FF91';
    if (currentPlayers === 1 || currentPlayers === 3) return '#FF5656';
    return '#16FF91';
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.white} />
          </TouchableOpacity>

          <Image source={{ uri: booking.image }} style={styles.image} />

          <View style={styles.detailsContainer}>
            <Text style={styles.courtName}>{booking.courtName}</Text>
            <Text style={styles.dateTime}>{`${booking.date} • ${booking.time}`}</Text>

            <View style={styles.playersSection}>
              <View style={styles.playersHeader}>
                <Users size={20} color={colors.text.disabled} />
                <Text style={styles.playersTitle}>Oyuncular</Text>
                <View style={[styles.playerCount, { backgroundColor: getStatusColor() + '26' }]}>
                  <Text style={[styles.playerCountText, { color: getStatusColor() }]}>
                    {currentPlayers}/{maxPlayers}
                  </Text>
                </View>
              </View>

              {booking.players?.map((player, index) => (
                <View key={index} style={styles.playerItem}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.skillLevel}>{player.skillLevel}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(34, 40, 47, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
    backgroundColor: 'rgba(34, 40, 47, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  image: {
    width: '100%',
    height: 200,
  },
  detailsContainer: {
    padding: 16,
  },
  courtName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.white,
    marginBottom: 8,
  },
  dateTime: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text.disabled,
    marginBottom: 24,
  },
  playersSection: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 16,
  },
  playersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  playersTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.white,
    marginLeft: 8,
    flex: 1,
  },
  playerCount: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  playerCountText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: colors.primary,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.text.disabled,
  },
  playerName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.white,
  },
  skillLevel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.text.disabled,
  },
}); 