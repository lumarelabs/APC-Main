import { Tabs } from 'expo-router';
import { useColorScheme, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Home, CalendarClock, Users, User } from 'lucide-react-native';
import { colors } from '@/app/theme/colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarLabelPosition: 'below-icon',
        tabBarBackground: () => (
          <BlurView intensity={100} style={styles.blurView} tint="light" />
        ),
        tabBarIconStyle: {
          marginTop: 7,
          marginBottom: 0,
        },
        tabBarLabelStyle: {
          paddingBottom: 4,
          fontSize: 12,
          fontFamily: 'Inter-Medium',
          lineHeight: 16,
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          padding: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Anasayfa',
          tabBarIcon: ({ color }) => (
            <Home size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: 'Rezervasyon',
          tabBarIcon: ({ color }) => (
            <CalendarClock size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Maçlar',
          tabBarIcon: ({ color }) => (
            <Users size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => (
            <User size={24} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    elevation: 0,
    borderRadius: 16,
    height: 70,
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
});