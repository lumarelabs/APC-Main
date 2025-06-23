import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Calendar, Clock, Users, X } from 'lucide-react-native';
import { useState } from 'react';
import { colors } from '@/app/theme/colors';

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
  const [modalVisible, setModalVisible] = useState(false);
  const typeColor = colors.primary;
  
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return colors.status.warning;
      case 'confirmed':
        return colors.primary;
      case 'completed':
        return result === 'win' ? colors.primary : colors.status.error;
      default:
        return colors.text.disabled;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Beklemede';
      case 'confirmed':
        return 'Onaylandı';
      case 'completed':
        return result === 'win' ? 'Kazandınız' : 'Kaybettiniz';
      default:
        return '';
    }
  };

  const handleDetailsPress = () => {
    setModalVisible(true);
  };

  return (
    <>
      <View style={styles.container}>
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
            <Calendar size={16} color={colors.text.disabled} />
            <Text style={styles.infoText}>{date}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Clock size={16} color={colors.text.disabled} />
            <Text style={styles.infoText}>{time}</Text>
          </View>
        </View>
        
        <View style={styles.teamsContainer}>
          <View style={styles.teamColumn}>
            <Text style={styles.teamLabel}>Takımınız</Text>
            {partners.map((partner, index) => (
              <Text key={`partner-${index}`} style={styles.playerName}>{partner}</Text>
            ))}
          </View>
          
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>vs</Text>
          </View>
          
          <View style={styles.teamColumn}>
            <Text style={styles.teamLabel}>Rakipler</Text>
            {opponents.length > 0 ? (
              opponents.map((opponent, index) => (
                <Text key={`opponent-${index}`} style={styles.playerName}>{opponent}</Text>
              ))
            ) : (
              <Text style={styles.noOpponentsText}>Henüz rakip yok</Text>
            )}
          </View>
        </View>
        
        <TouchableOpacity style={styles.detailsButton} onPress={handleDetailsPress}>
          <Text style={styles.detailsButtonText}>Detayları Gör</Text>
        </TouchableOpacity>
      </View>

      {/* Details Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rezervasyon Detayları</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <X size={24} color={colors.charcoal} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Kort Bilgileri</Text>
                <Text style={styles.modalText}>Kort: {courtName}</Text>
                <Text style={styles.modalText}>Tür: {courtType === 'padel' ? 'Padel' : 'Pickleball'}</Text>
                <Text style={styles.modalText}>Tarih: {date}</Text>
                <Text style={styles.modalText}>Saat: {time}</Text>
                <Text style={styles.modalText}>Durum: {getStatusText()}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Oyuncular</Text>
                <View style={styles.modalTeamsContainer}>
                  <View style={styles.modalTeamColumn}>
                    <Text style={styles.modalTeamLabel}>Takımınız</Text>
                    {partners.map((partner, index) => (
                      <Text key={`modal-partner-${index}`} style={styles.modalPlayerName}>{partner}</Text>
                    ))}
                  </View>
                  
                  <View style={styles.modalTeamColumn}>
                    <Text style={styles.modalTeamLabel}>Rakipler</Text>
                    {opponents.length > 0 ? (
                      opponents.map((opponent, index) => (
                        <Text key={`modal-opponent-${index}`} style={styles.modalPlayerName}>{opponent}</Text>
                      ))
                    ) : (
                      <Text style={styles.modalNoOpponentsText}>Henüz rakip yok</Text>
                    )}
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
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
    color: colors.charcoal,
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
    color: colors.text.disabled,
    marginLeft: 8,
  },
  teamsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
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
    color: colors.text.disabled,
    marginBottom: 8,
  },
  playerName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.charcoal,
    marginBottom: 4,
  },
  noOpponentsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.disabled,
    fontStyle: 'italic',
  },
  vsContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.text.disabled,
  },
  detailsButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.charcoal,
  },
  closeButton: {
    padding: 4,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.charcoal,
    marginBottom: 12,
  },
  modalText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
    marginBottom: 6,
  },
  modalTeamsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 12,
  },
  modalTeamColumn: {
    flex: 1,
  },
  modalTeamLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
    marginBottom: 8,
  },
  modalPlayerName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.charcoal,
    marginBottom: 4,
  },
  modalNoOpponentsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.disabled,
    fontStyle: 'italic',
  },
});