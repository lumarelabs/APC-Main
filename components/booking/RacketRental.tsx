import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MinusCircle, PlusCircle } from 'lucide-react-native';

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
      <Text style={styles.title}>Racket Rental</Text>
      <Text style={styles.subtitle}>Would you like to rent rackets?</Text>
      
      <View style={styles.counterContainer}>
        <TouchableOpacity 
          onPress={decrementRackets}
          style={[styles.counterButton, racketCount === 0 && styles.counterButtonDisabled]}
          disabled={racketCount === 0}
        >
          <MinusCircle size={24} color={racketCount === 0 ? '#464D59' : '#16FF91'} />
        </TouchableOpacity>
        
        <View style={styles.countDisplay}>
          <Text style={styles.countText}>{racketCount}</Text>
          <Text style={styles.countLabel}>Rackets</Text>
        </View>
        
        <TouchableOpacity 
          onPress={incrementRackets}
          style={[styles.counterButton, racketCount === 4 && styles.counterButtonDisabled]}
          disabled={racketCount === 4}
        >
          <PlusCircle size={24} color={racketCount === 4 ? '#464D59' : '#16FF91'} />
        </TouchableOpacity>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Price per racket:</Text>
        <Text style={styles.priceValue}>$5</Text>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>${racketCount * 5}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={() => onComplete(0)}
        >
          <Text style={styles.skipButtonText}>Skip Rental</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.continueButton, racketCount === 0 && styles.disabledButton]}
          onPress={() => racketCount > 0 && onComplete(racketCount)}
          disabled={racketCount === 0}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8F98A8',
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
    color: '#FFFFFF',
  },
  countLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8F98A8',
  },
  priceContainer: {
    backgroundColor: '#22293A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  priceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8F98A8',
    marginBottom: 4,
  },
  priceValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  totalLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8F98A8',
    marginBottom: 4,
  },
  totalValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#16FF91',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#22293A',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#8F98A8',
  },
  continueButton: {
    flex: 1,
    backgroundColor: '#16FF91',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000000',
  },
  disabledButton: {
    opacity: 0.5,
  },
}); 