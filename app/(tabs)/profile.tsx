import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Settings, CreditCard, Bell, Shield, LogOut, 
  Trophy, Clock, Calendar
} from 'lucide-react-native';
import { useApp } from '@/app/context/AppContext';
import { useUserProfile } from '@/app/hooks/useSupabaseData';
import Logo2 from '../../assets/images/logo2.png';
import { colors } from '@/app/theme/colors';

export default function ProfileScreen() {
  const { user, signOut } = useApp();
  const { profile, loading } = useUserProfile();

  const handleSignOut = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Hata', 'Çıkış yapılamadı. Lütfen tekrar deneyin.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Profil yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const displayProfile = profile || {
    full_name: user?.email?.split('@')[0] || 'Kullanıcı',
    level: 'Başlangıç',
    profile_image_url: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
        </View>

        {/* User Profile */}
        <View style={styles.profileCard}>
          <Image 
            source={{ uri: displayProfile.profile_image_url }} 
            style={styles.profileImage} 
          />
          <View style={styles.profileInfo}>
            <View style={styles.nameAndSkill}>
              <Text style={styles.profileName}>{displayProfile.full_name}</Text>
              <View style={[styles.skillLevelBar, skillLevelBarStyle(displayProfile.level)]}>
                <Text style={styles.skillLevelText}>{displayProfile.level}</Text>
              </View>
            </View>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Seviye {displayProfile.level}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Toplam Maç</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Kazanılan</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>-</Text>
            <Text style={styles.statLabel}>Kazanma Oranı</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <CreditCard size={24} color="#32D1FF" />
            </View>
            <Text style={styles.menuText}>Ödeme Yöntemleri</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Shield size={24} color="#FF5A5A" />
            </View>
            <Text style={styles.menuText}>Gizlilik ve Güvenlik</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Settings size={24} color="#16FF91" />
            </View>
            <Text style={styles.menuText}>Ayarlar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
            <View style={styles.menuIconContainer}>
              <LogOut size={24} color="#8F98A8" />
            </View>
            <Text style={styles.menuText}>Çıkış Yap</Text>
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

function skillLevelBarStyle(skillLevel: string) {
  switch (skillLevel) {
    case 'Başlangıç':
      return { backgroundColor: colors.secondary, borderColor: colors.secondary };
    case 'Orta':
      return { backgroundColor: colors.status.warning, borderColor: colors.status.warning };
    case 'İleri':
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text.disabled,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.charcoal,
    textAlign: 'center',
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
    padding: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
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