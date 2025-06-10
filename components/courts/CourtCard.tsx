import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Star } from 'lucide-react-native';
import { colors } from '@/app/theme/colors';

type CourtCardProps = {
  name: string;
  type: 'padel' | 'pickleball';
  price: number;
  rating: number;
  distance: string;
  image: string;
  availableSlots: number;
  onPress: () => void;
};

export function CourtCard({
  name,
  type,
  price,
  rating,
  distance,
  image,
  availableSlots,
  onPress,
}: CourtCardProps) {
  const typeColor = type === 'padel' ? '#16FF91' : '#32D1FF';
  const typeText = type === 'padel' ? 'Padel' : 'Pickleball';

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.ratingContainer}>
          <Star size={16} color={colors.status.warning} fill={colors.status.warning} />
          <Text style={styles.rating}>{rating}</Text>
        </View>
        <Text style={styles.distance}>{distance}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${price}</Text>
          <Text style={styles.perHour}>/saat</Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.bookButton,
            availableSlots === 0 && styles.disabledButton,
          ]}
          onPress={onPress}
          disabled={availableSlots === 0}
        >
          <Text style={[
            styles.bookButtonText,
            availableSlots === 0 && styles.disabledButtonText,
          ]}>
            {availableSlots > 0 ? 'Rezervasyon Yap' : 'Dolu'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#00000',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFD60A',
    marginLeft: 4,
  },
  distance: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#8F98A8',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#16FF91',
  },
  perHour: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#8F98A8',
    marginLeft: 4,
  },
  bookButton: {
    backgroundColor: 'rgba(22, 255, 145, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  bookButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: colors.primary,
  },
  disabledButton: {
    backgroundColor: 'rgba(143, 152, 168, 0.15)',
    borderColor: colors.text.disabled,
  },
  disabledButtonText: {
    color: colors.text.disabled,
  },
});