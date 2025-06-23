import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useCourts } from '@/app/hooks/useSupabaseData';
import { colors } from '@/app/theme/colors';

type ServiceDetailsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  serviceType: 'court' | 'lessons' | 'tournaments';
  onNavigateToBooking?: () => void;
  onNavigateToTournaments?: () => void;
};

export const ServiceDetailsModal = ({ 
  isVisible, 
  onClose, 
  serviceType, 
  onNavigateToBooking,
  onNavigateToTournaments 
}: ServiceDetailsModalProps) => {
  const { courts } = useCourts();

  const handleNavigateToBooking = () => {
    onClose();
    setTimeout(() => {
      router.push('/(tabs)/book');
    }, 100);
  };

  const handleNavigateToTournaments = () => {
    onClose();
    setTimeout(() => {
      onNavigateToTournaments?.();
    }, 100);
  };

  // Calculate average prices from database
  const padelCourts = courts.filter(court => court.type === 'padel');
  const pickleballCourts = courts.filter(court => court.type === 'pickleball');
  
  const padelPrice = padelCourts.length > 0 
    ? Math.round(padelCourts.reduce((sum, court) => sum + court.price_per_hour, 0) / padelCourts.length / 100)
    : 350;
    
  const pickleballPrice = pickleballCourts.length > 0
    ? Math.round(pickleballCourts.reduce((sum, court) => sum + court.price_per_hour, 0) / pickleballCourts.length / 100)
    : 250;

  const renderContent = () => {
    switch (serviceType) {
      case 'court':
        return (
          <>
            <Text style={styles.title}>Kort Rezervasyonu</Text>
            <Text style={styles.description}>
              Kort rezervasyonu yapın ve oyununuzu planlayın. Tercih ettiğiniz kort tipini ve zaman dilimini seçin. Tüm kortlarımız profesyonel standartlarda donatılmış ve en yüksek kalitede bakımı yapılmaktadır.
            </Text>
            <View style={styles.priceContainer}>
              <View style={styles.priceItem}>
                <Text style={styles.courtType}>Padel Kortları</Text>
                <Text style={styles.price}>₺{padelPrice}/saat</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.courtType}>Pickleball Kortları</Text>
                <Text style={styles.price}>₺{pickleballPrice}/saat</Text>
              </View>
              <View style={styles.nightRateInfo}>
                <Text style={styles.nightRateText}>
                  * 20:30'dan sonraki rezervasyonlara +₺300 gece tarifesi uygulanır
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleNavigateToBooking}
            >
              <Text style={styles.actionButtonText}>Rezervasyon Yap</Text>
              <ArrowRight size={20} color={colors.white} />
            </TouchableOpacity>
          </>
        );
      case 'lessons':
        return (
          <>
            <Text style={styles.title}>Padel Dersleri</Text>
            <Text style={styles.description}>
              Profesyonel eğitmenlerden özel ders alın. Deneyimli eğitmenlerimizden ders alın. Başlangıç seviyesinden ileri seviyeye kadar tüm seviyelerde dersler mevcuttur.
            </Text>
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
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleNavigateToBooking}
            >
              <Text style={styles.actionButtonText}>Ders Rezervasyonu</Text>
              <ArrowRight size={20} color={colors.white} />
            </TouchableOpacity>
          </>
        );
      case 'tournaments':
        return (
          <>
            <Text style={styles.title}>Turnuvalar</Text>
            <Text style={styles.description}>
              Turnuvalara katılın ve ödüller kazanın. Düzenli olarak farklı seviyelerde turnuvalar düzenlenmektedir. Hem eğlenceli hem de rekabetçi bir ortamda oyun deneyimi yaşayın.
            </Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleNavigateToTournaments}
            >
              <Text style={styles.actionButtonText}>Yaklaşan Turnuvalara Git</Text>
              <ArrowRight size={20} color={colors.white} />
            </TouchableOpacity>
          </>
        );
      default:
        return null;
    }
  };

  if (!isVisible || !serviceType) {
    return null;
  }

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
    color: colors.charcoal,
    marginBottom: 16,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.disabled,
    lineHeight: 24,
    marginBottom: 20,
  },
  priceContainer: {
    marginBottom: 24,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.primary,
  },
  courtType: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.charcoal,
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.primary,
  },
  nightRateInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
  },
  nightRateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.primary,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.white,
    marginRight: 8,
  },
});