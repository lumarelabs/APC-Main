import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { colors } from '../../app/theme/colors';

const LocationMap = () => {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webMapFallback}>
        <MapPin size={32} color={colors.primary} />
        <Text style={styles.webMapText}>Harita görüntülemek için mobil uygulamayı kullanın</Text>
      </View>
    );
  }

  // For native platforms, we'll use a simple view for now
  // You can add the actual MapView implementation here when needed
  return (
    <View style={styles.nativeMapFallback}>
      <MapPin size={32} color={colors.primary} />
      <Text style={styles.webMapText}>Konum: Alaçatı Padel Club</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  webMapFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  nativeMapFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  webMapText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default LocationMap; 