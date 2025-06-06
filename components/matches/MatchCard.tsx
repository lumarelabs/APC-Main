import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Clock, Users } from 'lucide-react-native';

type MatchCardProps = {
  courtName: string;
  courtType: 'padel' | 'pickleball';
  date: string;
  time: string;
  opponents: string[];
  partners: string[];
  status: 'pending' | 'confirmed' | 'completed';
  result?: 'win' | 'loss';
  onPress?: () => void;
};

export function MatchCard({
  courtName,
  courtType,
  date,
  time,
  opponents,
  partners,
  status,
  result,
  onPress,
}: MatchCardProps) {
  const typeColor = courtType === 'padel' ? '#16FF91' : '#32D1FF';
  
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return '#FFC107';
      case 'confirmed':
        return '#16FF91';
      case 'completed':
        return result === 'win' ? '#16FF91' : '#FF5A5A';
      default:
        return '#8F98A8';
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return result === 'win' ? 'Won' : 'Lost';
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.typeBadge, { backgroundColor: `${typeColor}20` }]}>
          <Text style={[styles.typeText, { color: typeColor }]}>
            {courtType === 'padel' ? 'Padel' : 'Pickleball'}
          </Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
      </View>
      
      <Text style={styles.courtName}>{courtName}</Text>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Calendar size={16} color="#8F98A8" />
          <Text style={styles.infoText}>{date}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Clock size={16} color="#8F98A8" />
          <Text style={styles.infoText}>{time}</Text>
        </View>
      </View>
      
      <View style={styles.teamsContainer}>
        <View style={styles.teamColumn}>
          <Text style={styles.teamLabel}>Your Team</Text>
          {partners.map((partner, index) => (
            <Text key={`partner-${index}`} style={styles.playerName}>{partner}</Text>
          ))}
        </View>
        
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>vs</Text>
        </View>
        
        <View style={styles.teamColumn}>
          <Text style={styles.teamLabel}>Opponents</Text>
          {opponents.map((opponent, index) => (
            <Text key={`opponent-${index}`} style={styles.playerName}>{opponent}</Text>
          ))}
        </View>
      </View>
      
      {status === 'confirmed' && (
        <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#22293A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  courtName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8F98A8',
    marginLeft: 8,
  },
  teamsContainer: {
    flexDirection: 'row',
    backgroundColor: '#181A20',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  teamColumn: {
    flex: 1,
  },
  teamLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8F98A8',
    marginBottom: 8,
  },
  playerName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  vsContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#8F98A8',
  },
  detailsButton: {
    backgroundColor: '#32D1FF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#000000',
  },
});