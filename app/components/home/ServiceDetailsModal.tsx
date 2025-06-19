import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/app/theme/colors';

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
            <Text style={styles.title}>Kort Rezervasyonu</Text>
            <View style={styles.priceContainer}>
              <View style={styles.priceItem}>
                <Text style={styles.courtType}>Padel Kortları</Text>
                <Text style={styles.price}>₺350/saat</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.courtType}>Pickleball Kortları</Text>
                <Text style={styles.price}>₺250/saat</Text>
              </View>
            </View>
            <Text style={styles.description}>
              Tercih ettiğiniz kort tipini ve zaman dilimini seçin. Tüm kortlarımız profesyonel standartlarda donatılmış ve en yüksek kalitede bakımı yapılmaktadır.
            </Text>
          </>
        );
      case 'lessons':
        return (
          <>
            <Text style={styles.title}>Padel Dersleri</Text>
            <View style={styles.priceContainer}>
              <View style={styles.priceItem}>
                <Text style={styles.courtType}>Özel Ders</Text>
                <Text style={styles.price}>₺600/saat</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.courtType}>Grup Dersi (4 kişi)</Text>
                <Text style={styles.price}>₺300/kişi/saat</Text>
              </View>
            </View>
            <Text style={styles.description}>
              Deneyimli eğitmenlerimizden ders alın. Başlangıç seviyesinden ileri seviyeye kadar tüm seviyelerde dersler mevcuttur.
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
            <X size={24} color={colors.charcoal} />
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
    backgroundColor: 'rgba(34, 40, 47, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.charcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.white,
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
    borderBottomColor: colors.text.disabled,
  },
  courtType: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.white,
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.primary,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.disabled,
    lineHeight: 20,
  },
}); 