import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/app/theme/colors';

type LessonType = 'private' | 'group';

type LessonBookingProps = {
  onComplete: (lessonData: { type: LessonType; price: number }) => void;
};

export function LessonBooking({ onComplete }: LessonBookingProps) {
  const [selectedType, setSelectedType] = useState<LessonType | null>(null);

  const lessonTypes = [
    {
      type: 'private' as LessonType,
      title: 'Özel Ders',
      description: 'Birebir özel ders',
      price: 1000,
      duration: '1 saat'
    },
    {
      type: 'group' as LessonType,
      title: 'Grup Dersi',
      description: 'Max 4 kişilik, 3 hafta (haftada 2 gün)',
      price: 7500,
      duration: '3 haftalık program'
    }
  ];

  const handleLessonSelect = (type: LessonType, price: number) => {
    setSelectedType(type);
    onComplete({ type, price });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ders Türü Seçin</Text>
      <Text style={styles.subtitle}>Deneyimli eğitmenlerimizden ders alın</Text>
      
      <View style={styles.lessonTypes}>
        {lessonTypes.map((lesson) => (
          <TouchableOpacity
            key={lesson.type}
            style={[
              styles.lessonCard,
              selectedType === lesson.type && styles.selectedLessonCard
            ]}
            onPress={() => handleLessonSelect(lesson.type, lesson.price)}
          >
            <View style={styles.lessonHeader}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonPrice}>₺{lesson.price}</Text>
            </View>
            <Text style={styles.lessonDescription}>{lesson.description}</Text>
            <Text style={styles.lessonDuration}>{lesson.duration}</Text>
            {lesson.type === 'group' && (
              <Text style={styles.lessonNote}>
                * Kişi başı ücret, 3 haftalık toplam program
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Ders Detayları</Text>
        <Text style={styles.infoText}>
          • Başlangıç seviyesinden ileri seviyeye kadar tüm seviyelerde dersler
        </Text>
        <Text style={styles.infoText}>
          • Profesyonel ve deneyimli eğitmenler
        </Text>
        <Text style={styles.infoText}>
          • Kişiselleştirilmiş eğitim programı
        </Text>
        <Text style={styles.infoText}>
          • Raket dahil (isteğe bağlı)
        </Text>
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
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text.disabled,
    marginBottom: 24,
    textAlign: 'center',
  },
  lessonTypes: {
    marginBottom: 24,
  },
  lessonCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedLessonCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lessonTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.charcoal,
  },
  lessonPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.primary,
  },
  lessonDescription: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
    marginBottom: 4,
  },
  lessonDuration: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.text.disabled,
  },
  lessonNote: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: colors.primary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  infoBox: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.charcoal,
    marginBottom: 12,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.disabled,
    marginBottom: 6,
    lineHeight: 20,
  },
});