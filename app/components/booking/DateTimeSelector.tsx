import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors } from '@/app/theme/colors';

type DateTimeSelectorProps = {
  onSelectDateTime: (date: string, time: string) => void;
};

export function DateTimeSelector({ onSelectDateTime }: DateTimeSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);

  const timeSlots = [
    '09:00 - 10:00', '10:30 - 11:30', '12:00 - 13:00', '13:30 - 14:30', 
    '15:00 - 16:00', '16:30 - 17:30', '18:00 - 19:00', '19:30 - 20:30', '21:00 - 22:00'
  ];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setCalendarVisible(false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onSelectDateTime(selectedDate, time);
    }
  };

  const formatDisplayDate = (dateString: string) => {
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
      <View style={styles.dateSection}>
        <Text style={styles.sectionTitle}>Tarih & Saat Seçin</Text>
        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={() => setCalendarVisible(true)}
        >
          <Text style={styles.dateButtonText}>
            {selectedDate ? formatDisplayDate(selectedDate) : 'Tarih Seçin'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.timeSection}
      >
        {timeSlots.map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeSlot,
              selectedTime === time && styles.selectedTimeSlot
            ]}
            onPress={() => handleTimeSelect(time)}
          >
            <Text style={[
              styles.timeText,
              selectedTime === time && styles.selectedTimeText
            ]}>
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={calendarVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Calendar
              onDayPress={({ dateString }) => handleDateSelect(dateString)}
              markedDates={selectedDate ? {
                [selectedDate]: { selected: true, selectedColor: colors.primary }
              } : {}}
              theme={{
                calendarBackground: colors.background.secondary,
                monthTextColor: colors.primary,
                dayTextColor: colors.charcoal,
                textDisabledColor: colors.text.disabled,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: colors.white,
                todayTextColor: colors.primary,
                arrowColor: colors.primary,
                textDayFontFamily: 'Inter-Medium',
                textMonthFontFamily: 'Inter-Bold',
                textDayHeaderFontFamily: 'Inter-Medium',
              }}
              monthFormat={'MMMM yyyy'}
              firstDay={1}
              minDate={new Date().toISOString().split('T')[0]}
            />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setCalendarVisible(false)}
            >
              <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: 12,
  },
  dateSection: {
    marginBottom: 16,
  },
  dateButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  dateButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.white,
  },
  timeSection: {
    flexGrow: 0,
  },
  timeSlot: {
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: colors.primary,
  },
  timeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.primary,
  },
  selectedTimeText: {
    color: colors.white,
    fontFamily: 'Inter-Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    width: '90%',
  },
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.white,
  },
});