import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Settings, CreditCard, Bell, Shield, LogOut, 
  Trophy, Clock, Calendar
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import Logo2 from '../../assets/images/logo2.png';

export default function ProfileScreen() {
  const { user } = useApp();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* User Profile */}
        <View style={styles.profileCard}>
          <Image 
            source={{ uri: user?.profileImage }} 
            style={styles.profileImage} 
          />
          <View style={styles.profileInfo}>
            <View style={styles.nameAndSkill}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <View style={[styles.skillLevelBar, skillLevelBarStyle(user?.skillLevel)]}>
                <Text style={styles.skillLevelText}>{user?.skillLevel}</Text>
              </View>
            </View>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Level {user?.level}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Trophy size={24} color="#16FF91" />
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={24} color="#32D1FF" />
            <Text style={styles.statValue}>52</Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={24} color="#FF5A5A" />
            <Text style={styles.statValue}>31</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <CreditCard size={24} color="#32D1FF" />
            </View>
            <Text style={styles.menuText}>Payment Methods</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Bell size={24} color="#16FF91" />
            </View>
            <Text style={styles.menuText}>Notifications</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Shield size={24} color="#FF5A5A" />
            </View>
            <Text style={styles.menuText}>Privacy & Security</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <LogOut size={24} color="#8F98A8" />
            </View>
            <Text style={styles.menuText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* Logo2 at the bottom visually centered */}
        <View style={styles.logo2Container}>
          <Image source={Logo2} style={styles.logo2} resizeMode="contain" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function skillLevelBarStyle(skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | undefined) {
  switch (skillLevel) {
    case 'Beginner':
      return { backgroundColor: 'rgba(50, 209, 255, 0.2)', borderColor: '#32D1FF' };
    case 'Intermediate':
      return { backgroundColor: 'rgba(255, 214, 10, 0.2)', borderColor: '#FFD60A' };
    case 'Advanced':
      return { backgroundColor: 'rgba(255, 90, 90, 0.2)', borderColor: '#FF5A5A' };
    default:
      return { backgroundColor: 'rgba(22, 255, 145, 0.15)', borderColor: '#16FF91' };
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#22293A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#22293A',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#16FF91',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  nameAndSkill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8F98A8',
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: 'rgba(22, 255, 145, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  levelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#16FF91',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#22293A',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8F98A8',
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: '#22293A',
    borderRadius: 16,
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#212A37',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  skillLevelBar: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
    borderWidth: 1,
  },
  skillLevelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  logo2Container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logo2: {
    width: '100%',
    height: 100,
  },
});