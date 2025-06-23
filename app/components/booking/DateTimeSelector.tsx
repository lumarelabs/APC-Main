import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { BookingsService } from '@/app/services/supabase/database';
import { colors } from '@/app/theme/colors';

type DateTimeSelectorProps = {
  onSelectDateTime: (date: string, time: string) => void;
  selectedCourt?: any;
};

export function DateTimeSelector({ onSelectDateTime, selectedCourt }: DateTimeSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time selection
    setCalendarVisible(false);
    
    // Load available time slots for the selected date and court
    if (selectedCourt) {
      setLoadingSlots(true);
      try {
        const slots = await BookingsService.getAvailableTimeSlots(selectedCourt.id, date);
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error loading time slots:', error);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }
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

  const formatTimeSlot = (startTime: string, endTime: string) => {
    return `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;
  };

  const getTimeSlotPrice = (startTime: string) => {
    if (!selectedCourt) return 0;
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const isNightBooking = hours > 20 || (hours === 20 && minutes >= 30);
    
    return selectedCourt.price_per_hour + (isNightBooking ? 300 : 0);
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

      {selectedDate && (
        <View style={styles.timeSection}>
          <Text style={styles.timeSectionTitle}>Müsait Saatler</Text>
          
          {loadingSlots ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Müsait saatler yükleniyor...</Text>
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.timeSlotsContainer}
              contentContainerStyle={styles.timeSlotsContent}
            >
              {availableSlots.map((slot, index) => {
                const timeSlot = formatTimeSlot(slot.startTime, slot.endTime);
                const price = getTimeSlotPrice(slot.startTime);
                const isNightRate = price > selectedCourt?.price_per_hour;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timeSlot,
                      !slot.available && styles.unavailableTimeSlot,
                      selectedTime === timeSlot && slot.available && styles.selectedTimeSlot
                    ]}
                    onPress={() => slot.available && handleTimeSelect(timeSlot)}
                    disabled={!slot.available}
                  >
                    <Text style={[
                      styles.timeText,
                      !slot.available && styles.unavailableTimeText,
                      selectedTime === timeSlot && slot.available && styles.selectedTimeText
                    ]}>
                      {timeSlot}
                    </Text>
                    
                    <Text style={[
                      styles.priceText,
                      !slot.available && styles.unavailablePriceText,
                      selectedTime === timeSlot && slot.available && styles.selectedPriceText
                    ]}>
                      ₺{price}
                    </Text>
                    
                    {isNightRate && slot.available && (
                      <Text style={[
                        styles.nightRateText,
                        selectedTime === timeSlot && styles.selectedNightRateText
                      ]}>
                        Gece Tarifesi
                      </Text>
                    )}
                    
                    <View style={[
                      styles.statusIndicator,
                      slot.available ? styles.availableIndicator : styles.unavailableIndicator,
                      selectedTime === timeSlot && slot.available && styles.selectedIndicator
                    ]}>
                      <Text style={[
                        styles.statusText,
                        selectedTime === timeSlot && slot.available && styles.selectedStatusText
                      ]}>
                        {slot.available ? 'Müsait' : 'Dolu'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
          
          {availableSlots.length === 0 && !loadingSlots && (
            <View style={styles.noSlotsContainer}>
              <Text style={styles.noSlotsText}>Bu tarih için müsait saat bulunmuyor</Text>
              <Text style={styles.noSlotsSubtext}>Lütfen farklı bir tarih seçin</Text>
            </View>
          )}
        </View>
      )}

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
    marginTop: 8,
  },
  timeSectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
    marginLeft: 8,
  },
  timeSlotsContainer: {
    flexGrow: 0,
  },
  timeSlotsContent: {
    paddingRight: 16,
  },
  timeSlot: {
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  unavailableTimeSlot: {
    opacity: 0.5,
    backgroundColor: colors.background.tertiary,
  },
  selectedTimeSlot: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 4,
  },
  unavailableTimeText: {
    color: colors.text.disabled,
  },
  selectedTimeText: {
    color: colors.white,
  },
  priceText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.primary,
    marginBottom: 4,
  },
  unavailablePriceText: {
    color: colors.text.disabled,
  },
  selectedPriceText: {
    color: colors.white,
  },
  nightRateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: colors.status.warning,
    marginBottom: 4,
  },
  selectedNightRateText: {
    color: colors.white,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  availableIndicator: {
    backgroundColor: colors.status.success + '20',
  },
  unavailableIndicator: {
    backgroundColor: colors.status.error + '20',
  },
  selectedIndicator: {
    backgroundColor: colors.white + '20',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: colors.status.success,
  },
  selectedStatusText: {
    color: colors.white,
  },
  noSlotsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
  },
  noSlotsText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.text.disabled,
    textAlign: 'center',
    marginBottom: 4,
  },
  noSlotsSubtext: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
    textAlign: 'center',
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