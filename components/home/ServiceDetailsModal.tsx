import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';

type ServiceDetailsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  serviceType: 'court' | 'lessons' | 'tournaments';
};

export const ServiceDetailsModal = ({ isVisible, onClose, serviceType }: ServiceDetailsModalProps) => {
  const renderContent = () => {
    switch (serviceType) {
      case 'court':
        return (
          <>
            <Text style={styles.title}>Court Booking</Text>
            <View style={styles.priceContainer}>
              <View style={styles.priceItem}>
                <Text style={styles.courtType}>Padel Courts</Text>
                <Text style={styles.price}>$35/hour</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.courtType}>Pickleball Courts</Text>
                <Text style={styles.price}>$25/hour</Text>
              </View>
            </View>
            <Text style={styles.description}>
              Book your preferred court type and time slot. All courts are equipped with professional-grade facilities and maintained to the highest standards.
            </Text>
          </>
        );
      case 'lessons':
        return (
          <>
            <Text style={styles.title}>Padel Lessons</Text>
            <View style={styles.priceContainer}>
              <View style={styles.priceItem}>
                <Text style={styles.courtType}>Private Lesson</Text>
                <Text style={styles.price}>$60/hour</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.courtType}>Group Lesson (4 people)</Text>
                <Text style={styles.price}>$30/person/hour</Text>
              </View>
            </View>
            <Text style={styles.description}>
              Learn from our experienced coaches. Lessons are available for all skill levels, from beginners to advanced players.
            </Text>
          </>
        );
      case 'tournaments':
        return (
          <>
            <Text style={styles.title}>Tournaments</Text>
            <Text style={styles.description}>
              There are no tournaments scheduled at the moment. Please check back later for upcoming events.
            </Text>
          </>
        );
    }
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
            <X size={24} color="#fff" />
          </TouchableOpacity>
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderContent()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#22293A',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  priceContainer: {
    marginBottom: 16,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  courtType: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#16FF91',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8F98A8',
    lineHeight: 20,
  },
}); 