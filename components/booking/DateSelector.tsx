import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { CalendarList } from 'react-native-calendars';

type DateSelectorProps = {
  onSelectDate: (date: string) => void;
};

export function DateSelector({ onSelectDate }: DateSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setCalendarVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Date</Text>
      <TouchableOpacity style={styles.openCalendarButton} onPress={() => setCalendarVisible(true)}>
        <Text style={styles.openCalendarButtonText}>{selectedDate ? selectedDate : 'Open Calendar'}</Text>
      </TouchableOpacity>
      <Modal visible={calendarVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.toggleContainer}>
              <TouchableOpacity onPress={() => setViewMode('week')} style={[styles.toggleButton, viewMode === 'week' && styles.activeToggleButton]}>
                <Text style={viewMode === 'week' ? styles.activeToggleText : styles.toggleText}>Weekly</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setViewMode('month')} style={[styles.toggleButton, viewMode === 'month' && styles.activeToggleButton]}>
                <Text style={viewMode === 'month' ? styles.activeToggleText : styles.toggleText}>Monthly</Text>
              </TouchableOpacity>
            </View>
            <CalendarList
              current={selectedDate || undefined}
              onDayPress={(day: { dateString: string }) => { handleSelectDate(day.dateString); onSelectDate(day.dateString); }}
              pastScrollRange={0}
              futureScrollRange={viewMode === 'week' ? 1 : 12}
              scrollEnabled={true}
              horizontal={true}
              pagingEnabled={true}
              hideExtraDays={viewMode === 'week'}
              showScrollIndicator={false}
              markingType={'custom'}
              markedDates={selectedDate ? { [selectedDate]: { selected: true, selectedColor: '#16FF91' } } : {}}
              theme={{
                calendarBackground: '#22293A',
                dayTextColor: '#fff',
                monthTextColor: '#16FF91',
                selectedDayBackgroundColor: '#16FF91',
                selectedDayTextColor: '#000',
                todayTextColor: '#32D1FF',
                textDisabledColor: '#8F98A8',
              }}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setCalendarVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedDate && styles.disabledButton,
          ]}
          onPress={() => selectedDate && onSelectDate(selectedDate)}
          disabled={!selectedDate}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  openCalendarButton: {
    backgroundColor: '#16FF91',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openCalendarButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#22293A',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    maxHeight: '80%',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: '#22293A',
    borderRadius: 12,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeToggleButton: {
    backgroundColor: '#16FF91',
  },
  toggleText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8F98A8',
  },
  activeToggleText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000000',
  },
  closeButton: {
    backgroundColor: '#16FF91',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000000',
  },
  buttonContainer: {
    marginTop: 32,
  },
  continueButton: {
    backgroundColor: '#16FF91',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#22293A',
  },
  continueButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000000',
  },
});