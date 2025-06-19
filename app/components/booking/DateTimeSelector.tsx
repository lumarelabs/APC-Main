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
    '09:00', '10:30', '12:00', '13:30', '15:00', 
    '16:30', '18:00', '19:30', '21:00'
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

  return (
    <View style={styles.container}>
      <View style={styles.dateSection}>
        <Text style={styles.sectionTitle}>Select Date & Time</Text>
        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={() => setCalendarVisible(true)}
        >
          <Text style={styles.dateButtonText}>
            {selectedDate || 'Select Date'}
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
                [selectedDate]: { selected: true, selectedColor: '#16FF91' }
              } : {}}
              theme={{
                calendarBackground: '#22293A',
                monthTextColor: '#16FF91',
                dayTextColor: '#FFFFFF',
                textDisabledColor: '#8F98A8',
                selectedDayBackgroundColor: '#16FF91',
                selectedDayTextColor: '#000000',
                todayTextColor: '#32D1FF',
                arrowColor: '#16FF91',
              }}
            />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setCalendarVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
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
    color: '#000000',
  },
  timeSection: {
    flexGrow: 0,
  },
  timeSlot: {
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    minWidth: 80,
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
    color: '#000000',
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
    color: '#000000',
  },
}); 