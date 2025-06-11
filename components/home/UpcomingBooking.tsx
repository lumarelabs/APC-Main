import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import { colors } from '@/app/theme/colors';

type UpcomingBookingProps = {
  courtName: string;
  courtType: 'padel' | 'pickleball';
  date: string;
  time: string;
  image: string;
  onPress?: () => void;
};

export const UpcomingBooking = ({
  courtName,
  courtType,
  date,
  time,
  image,
  onPress,
}: UpcomingBookingProps) => {
  const typeColor = colors.primary;

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <View style={[styles.typeBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.typeText, { color: colors.white }]}>
            {courtType === 'padel' ? 'Padel' : 'Pickleball'}
          </Text>
        </View>

        <Text style={styles.courtName} numberOfLines={1}>{courtName}</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Calendar size={14} color={colors.text.disabled} />
            <Text style={styles.infoText}>{date}</Text>
          </View>

          <View style={styles.infoRow}>
            <Clock size={14} color={colors.text.disabled} />
            <Text style={styles.infoText}>{time}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.detailsButton, { borderColor: colors.primary }]}
          onPress={onPress}
        >
          <Text style={[styles.detailsButtonText, { color: colors.primary }]}>Detayları Gör</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 180,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    marginLeft: 8,
    marginRight: 8,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  image: {
    width: 120,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  typeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  courtName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.charcoal,
    marginBottom: 12,
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.disabled,
    marginLeft: 8,
  },
  detailsButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.primary,
  },
});