import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MatchCard } from '@/app/components/matches/MatchCard';
import { useUserMatches } from '@/app/hooks/useSupabaseData';
import { colors } from '@/app/theme/colors';

export default function MatchesScreen() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { matches, loading } = useUserMatches();

  // Transform matches for display
  const transformedMatches = matches.map(match => {
    const booking = match.booking;
    const court = booking?.court;
    
    // Format date
    const matchDate = new Date(booking?.date || '');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let dateText = matchDate.toLocaleDateString('tr-TR', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
    
    if (matchDate.toDateString() === today.toDateString()) {
      dateText = 'Bugün';
    } else if (matchDate.toDateString() === tomorrow.toDateString()) {
      dateText = 'Yarın';
    }

    // Get players by team
    const homePlayers = match.players?.filter(p => p.team === 'home').map(p => p.user?.full_name || 'Player') || [];
    const awayPlayers = match.players?.filter(p => p.team === 'away').map(p => p.user?.full_name || 'Player') || [];

    return {
      id: match.id,
      courtName: court?.name || 'Court',
      courtType: court?.type || 'padel',
      date: dateText,
      time: `${booking?.start_time?.slice(0, 5)} - ${booking?.end_time?.slice(0, 5)}`,
      opponents: awayPlayers.length > 0 ? awayPlayers : ['Rakip Aranıyor'],
      partners: homePlayers.length > 0 ? homePlayers : ['Siz'],
      status: match.status,
      result: match.result,
      originalDate: matchDate
    };
  });

  // Filter matches based on active tab
  const filteredMatches = transformedMatches.filter(match => {
    if (activeTab === 'upcoming') {
      return match.status !== 'completed' && match.originalDate >= new Date();
    } else {
      return match.status === 'completed' || match.originalDate < new Date();
    }
  });

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
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Maçlar yükleniyor...</Text>
            </View>
          ) : filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <MatchCard 
                key={match.id}
                courtName={match.courtName}
                courtType={match.courtType as 'padel' | 'pickleball'}
                date={match.date}
                time={match.time}
                opponents={match.opponents}
                partners={match.partners}
                status={match.status as 'pending' | 'confirmed' | 'completed'}
                result={match.result as 'win' | 'loss' | undefined}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {activeTab === 'upcoming' ? 'Yaklaşan maçınız yok' : 'Geçmiş maçınız yok'}
              </Text>
              <Text style={styles.emptySubtext}>
                {activeTab === 'upcoming' 
                  ? 'Rezervasyon yaptığınızda maçlar burada görünecek'
                  : 'Tamamlanan maçlarınız burada görünecek'
                }
              </Text>
            </View>
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text.disabled,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    marginTop: 20,
  },
  emptyText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.charcoal,
    marginBottom: 4,
  },
  emptySubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.disabled,
    textAlign: 'center',
  },
});