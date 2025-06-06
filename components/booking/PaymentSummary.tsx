import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Summary</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Court Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Court</Text>
          <Text style={styles.value}>{courtName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Type</Text>
          <Text style={styles.value}>{courtType}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{time}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Breakdown</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Court Rental</Text>
          <Text style={styles.value}>${courtPrice}</Text>
        </View>
        {racketCount > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Racket Rental ({racketCount}x)</Text>
            <Text style={styles.value}>${totalRacketPrice}</Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${totalPrice}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
        <Text style={styles.confirmButtonText}>Confirm & Pay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#111827',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#22293A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
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
    color: '#8F98A8',
  },
  value: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#464D59',
  },
  totalLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  totalValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#16FF91',
  },
  confirmButton: {
    backgroundColor: '#16FF91',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  confirmButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000000',
  },
}); 