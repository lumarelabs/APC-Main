import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Star } from 'lucide-react-native';
import { colors } from '@/app/theme/colors';

type CourtCardProps = {
  name: string;
  type: 'padel' | 'pickleball';
  price: number;
  image: string;
  location?: string;
  onPress: () => void;
};

export function CourtCard({
  name,
  type,
  price,
  image,
  location,
  onPress,
}: CourtCardProps) {
  // FIXED: Ensure proper type handling and display
  const normalizedType = type?.toLowerCase();
  const typeColor = normalizedType === 'padel' ? '#16FF91' : '#32D1FF';
  const typeText = normalizedType === 'padel' ? 'Padel' : 'Pickleball';

  console.log('CourtCard rendering:', { name, type, normalizedType, typeText }); // Debug log

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        
        <View style={[styles.typeBadge, { backgroundColor: `${typeColor}20` }]}>
          <Text style={[styles.typeText, { color: typeColor }]}>{typeText}</Text>
        </View>
        
        {location && (
          <View style={styles.locationContainer}>
            <MapPin size={12} color={colors.text.disabled} />
            <Text style={styles.location} numberOfLines={1}>{location}</Text>
          </View>
        )}
        
        <View style={styles.priceContainer}>
          {/* FIXED: Direct TL display, no cent conversion */}
          <Text style={styles.price}>₺{price}</Text>
          <Text style={styles.perHour}>/saat</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={onPress}
        >
          <Text style={styles.bookButtonText}>Rezervasyon Yap</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
    flex: 1,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: colors.charcoal,
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  typeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.text.disabled,
    marginLeft: 4,
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.primary,
  },
  perHour: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.text.disabled,
    marginLeft: 4,
  },
  bookButton: {
    backgroundColor: 'rgba(233, 125, 43, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: 'auto', // Push button to bottom
  },
  bookButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: colors.primary,
  },
});