import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Settings, CreditCard, Bell, Shield, LogOut, 
  Trophy, Clock, Calendar
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import Logo2 from '../../assets/images/logo2.png';
import { colors } from '@/app/theme/colors';

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
      return { backgroundColor: colors.secondary, borderColor: colors.secondary };
    case 'Intermediate':
      return { backgroundColor: colors.status.warning, borderColor: colors.status.warning };
    case 'Advanced':
      return { backgroundColor: colors.status.error, borderColor: colors.status.error };
    default:
      return { backgroundColor: colors.primary, borderColor: colors.primary };
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
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
    color: colors.charcoal,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.primary,
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
    color: colors.charcoal,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.disabled,
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  levelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.white,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.primary,
    marginTop: 8,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.disabled,
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.charcoal,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.charcoal,
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
    color: colors.charcoal,
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