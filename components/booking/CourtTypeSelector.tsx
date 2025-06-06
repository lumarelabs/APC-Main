import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type CourtTypeSelectorProps = {
  selectedType: 'all' | 'padel' | 'pickleball';
  onSelectType: (type: 'all' | 'padel' | 'pickleball') => void;
};

export function CourtTypeSelector({ selectedType, onSelectType }: CourtTypeSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.option, selectedType === 'all' && styles.selectedOption]}
        onPress={() => onSelectType('all')}
      >
        <Text style={[styles.optionText, selectedType === 'all' && styles.selectedOptionText]}>
          All Courts
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.option, selectedType === 'padel' && styles.selectedOption]}
        onPress={() => onSelectType('padel')}
      >
        <Text style={[styles.optionText, selectedType === 'padel' && styles.selectedOptionText]}>
          Padel
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.option, selectedType === 'pickleball' && styles.selectedOption]}
        onPress={() => onSelectType('pickleball')}
      >
        <Text style={[styles.optionText, selectedType === 'pickleball' && styles.selectedOptionText]}>
          Pickleball
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  option: {
    flex: 1,
    backgroundColor: '#22293A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: 'rgba(22, 255, 145, 0.15)',
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8F98A8',
  },
  selectedOptionText: {
    color: '#16FF91',
  },
}); 