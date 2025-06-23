import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MinusCircle, PlusCircle } from 'lucide-react-native';
import { colors } from '@/app/theme/colors';

type RacketRentalProps = {
  onComplete: (racketCount: number) => void;
};

export function RacketRental({ onComplete }: RacketRentalProps) {
  const [racketCount, setRacketCount] = useState(0);

  const incrementRackets = () => {
    setRacketCount((prev: number) => Math.min(prev + 1, 4)); // Maximum 4 rackets
  };

  const decrementRackets = () => {
    setRacketCount((prev: number) => Math.max(prev - 1, 0));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Raket Kiralama</Text>
      <Text style={styles.subtitle}>Raket kiralamak ister misiniz?</Text>
      
      <View style={styles.counterContainer}>
        <TouchableOpacity 
          onPress={decrementRackets}
          style={[styles.counterButton, racketCount === 0 && styles.counterButtonDisabled]}
          disabled={racketCount === 0}
        >
          <MinusCircle size={24} color={racketCount === 0 ? colors.text.disabled : colors.primary} />
        </TouchableOpacity>
        
        <View style={styles.countDisplay}>
          <Text style={styles.countText}>{racketCount}</Text>
          <Text style={styles.countLabel}>Raket</Text>
        </View>
        
        <TouchableOpacity 
          onPress={incrementRackets}
          style={[styles.counterButton, racketCount === 4 && styles.counterButtonDisabled]}
          disabled={racketCount === 4}
        >
          <PlusCircle size={24} color={racketCount === 4 ? colors.text.disabled : colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Raket başına ücret:</Text>
        <Text style={styles.priceValue}>₺125</Text>
        <Text style={styles.totalLabel}>Toplam:</Text>
        <Text style={styles.totalValue}>₺{racketCount * 125}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={() => onComplete(0)}
        >
          <Text style={styles.skipButtonText}>Kiralamayı Geç</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.continueButton, racketCount === 0 && styles.disabledButton]}
          onPress={() => racketCount > 0 && onComplete(racketCount)}
          disabled={racketCount === 0}
        >
          <Text style={styles.continueButtonText}>Devam Et</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text.disabled,
    marginBottom: 24,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  counterButton: {
    padding: 8,
  },
  counterButtonDisabled: {
    opacity: 0.5,
  },
  countDisplay: {
    marginHorizontal: 24,
    alignItems: 'center',
  },
  countText: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: colors.charcoal,
  },
  countLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
  },
  priceContainer: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  priceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
    marginBottom: 4,
  },
  priceValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.charcoal,
    marginBottom: 12,
  },
  totalLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
    marginBottom: 4,
  },
  totalValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.text.disabled,
  },
  continueButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.white,
  },
  disabledButton: {
    opacity: 0.5,
  },
});