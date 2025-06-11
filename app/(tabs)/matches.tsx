import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MatchCard } from '@/components/matches/MatchCard';
import { colors } from '@/app/theme/colors';

export default function MatchesScreen() {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Maçlarım</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Yaklaşan</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'past' && styles.activeTab]}
            onPress={() => setActiveTab('past')}
          >
            <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>Geçmiş</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {activeTab === 'upcoming' ? (
            <>
              <MatchCard 
                courtName="Downtown Padel Club"
                courtType="padel"
                date="Bugün"
                time="18:00 - 19:30"
                opponents={["Sarah K.", "Michael T."]}
                partners={["Siz", "James R."]}
                status="confirmed"
              />
              <MatchCard 
                courtName="Riverside Pickleball"
                courtType="pickleball"
                date="Yarın"
                time="10:00 - 11:30"
                opponents={["Emma D."]}
                partners={["Siz"]}
                status="confirmed"
              />
              <MatchCard 
                courtName="City Padel Center"
                courtType="padel"
                date="Cum, 24 Eki"
                time="20:00 - 21:30"
                opponents={["Robert L.", "Anna P."]}
                partners={["Siz", "Thomas B."]}
                status="pending"
              />
            </>
          ) : (
            <>
              <MatchCard 
                courtName="Beach Pickleball Courts"
                courtType="pickleball"
                date="Pzt, 14 Eki"
                time="16:00 - 17:30"
                opponents={["David S.", "Jennifer M."]}
                partners={["Siz", "Lisa K."]}
                status="completed"
                result="win"
              />
              <MatchCard 
                courtName="Downtown Padel Club"
                courtType="padel"
                date="Cmt, 5 Eki"
                time="10:00 - 11:30"
                opponents={["John D.", "Karen W."]}
                partners={["Siz", "Mark R."]}
                status="completed"
                result="loss"
              />
              <MatchCard 
                courtName="City Padel Center"
                courtType="padel"
                date="Çar, 2 Eki"
                time="19:00 - 20:30"
                opponents={["Richard B.", "Susan T."]}
                partners={["Siz", "Paul G."]}
                status="completed"
                result="win"
              />
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: colors.background.secondary,
  },
  activeTab: {
    backgroundColor: colors.background.secondary,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
  },
  activeTabText: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
});