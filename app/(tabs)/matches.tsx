import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MatchCard } from '@/app/components/matches/MatchCard';
import { useUserMatches } from '@/app/hooks/useSupabaseData';
import { colors } from '@/app/theme/colors';

export default function MatchesScreen() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { matches, loading, error } = useUserMatches();

  // Filter matches based on status
  const upcomingMatches = matches.filter(match => 
    match.status === 'pending' || match.status === 'confirmed'
  );
  
  const pastMatches = matches.filter(match => 
    match.status === 'completed'
  );

  const displayMatches = activeTab === 'upcoming' ? upcomingMatches : pastMatches;

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading matches...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
              Yaklaşan ({upcomingMatches.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'past' && styles.activeTab]}
            onPress={() => setActiveTab('past')}
          >
            <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
              Geçmiş ({pastMatches.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error loading matches: {error}</Text>
            </View>
          ) : displayMatches.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {activeTab === 'upcoming' 
                  ? 'Henüz yaklaşan maçınız yok' 
                  : 'Henüz tamamlanmış maçınız yok'
                }
              </Text>
            </View>
          ) : (
            displayMatches.map((match) => (
              <MatchCard 
                key={match.id}
                courtName={match.booking?.court?.name || 'Unknown Court'}
                courtType={match.booking?.court?.type || 'padel'}
                date={new Date(match.booking?.date || '').toLocaleDateString('tr-TR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })}
                time={`${match.booking?.start_time?.slice(0, 5)} - ${match.booking?.end_time?.slice(0, 5)}`}
                opponents={match.players
                  ?.filter(p => p.team === 'away')
                  ?.map(p => p.user?.full_name || 'Unknown Player') || []
                }
                partners={match.players
                  ?.filter(p => p.team === 'home')
                  ?.map(p => p.user?.full_name || 'You') || ['You']
                }
                status={match.status}
                result={match.result}
              />
            ))
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text.disabled,
    marginTop: 12,
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
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.status.error,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text.disabled,
    textAlign: 'center',
  },
});