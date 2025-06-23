import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/app/theme/colors';

type PaymentSummaryProps = {
  courtName: string;
  courtType: string;
  date: string;
  time: string;
  courtPrice: number;
  racketCount: number;
  racketPrice: number;
  onConfirm: () => void;
};

export function PaymentSummary({
  courtName,
  courtType,
  date,
  time,
  courtPrice,
  racketCount,
  racketPrice,
  onConfirm,
}: PaymentSummaryProps) {
  const totalRacketPrice = racketCount * racketPrice;
  const totalPrice = courtPrice + totalRacketPrice;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rezervasyon Özeti</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kort Detayları</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Kort</Text>
          <Text style={styles.value}>{courtName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Tür</Text>
          <Text style={styles.value}>{courtType === 'padel' ? 'Padel' : 'Pickleball'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Tarih</Text>
          <Text style={styles.value}>{formatDate(date)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Saat</Text>
          <Text style={styles.value}>{time}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ücret Detayları</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Kort Kirası</Text>
          <Text style={styles.value}>₺{courtPrice}</Text>
        </View>
        {racketCount > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Raket Kirası ({racketCount}x)</Text>
            <Text style={styles.value}>₺{totalRacketPrice}</Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Toplam</Text>
          <Text style={styles.totalValue}>₺{totalPrice}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
        <Text style={styles.confirmButtonText}>Onayla & Öde</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.background.primary,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.charcoal,
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.charcoal,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
  },
  value: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.charcoal,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.text.disabled,
  },
  totalLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.charcoal,
  },
  totalValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.primary,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.white,
  },
});