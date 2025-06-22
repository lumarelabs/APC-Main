import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MatchCard } from '@/app/components/matches/MatchCard';
import { useUserBookings } from '@/app/hooks/useSupabaseData';
import { colors } from '@/app/theme/colors';

export default function MatchesScreen() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { bookings, loading, error } = useUserBookings();

  // Filter bookings based on date for upcoming vs past
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Remove duplicates by using a Map with booking IDs as keys
  const uniqueBookingsMap = new Map();
  bookings.forEach(booking => {
    if (!uniqueBookingsMap.has(booking.id)) {
      uniqueBookingsMap.set(booking.id, booking);
    }
  });
  const uniqueBookings = Array.from(uniqueBookingsMap.values());

  const upcomingBookings = uniqueBookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate >= today;
  });
  
  const pastBookings = uniqueBookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate < today;
  });

  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Rezervasyonlar yükleniyor...</Text>
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
              Yaklaşan ({upcomingBookings.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'past' && styles.activeTab]}
            onPress={() => setActiveTab('past')}
          >
            <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
              Geçmiş ({pastBookings.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Rezervasyonlar yüklenirken hata oluştu</Text>
              <Text style={styles.errorSubtext}>Lütfen daha sonra tekrar deneyin</Text>
            </View>
          ) : displayBookings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {activeTab === 'upcoming' 
                  ? 'Henüz yaklaşan rezervasyonunuz yok' 
                  : 'Henüz geçmiş rezervasyonunuz yok'
                }
              </Text>
              <Text style={styles.emptySubtext}>
                {activeTab === 'upcoming' 
                  ? 'Kort rezervasyonu yaparak maç oluşturabilirsiniz' 
                  : 'Rezervasyon yaptıktan sonra burada görünecek'
                }
              </Text>
            </View>
          ) : (
            displayBookings.map((booking) => (
              <MatchCard 
                key={booking.id} // Use just booking.id since we've already deduplicated
                courtName={booking.court?.name || 'Bilinmeyen Kort'}
                courtType={booking.court?.type || 'padel'}
                date={new Date(booking.date).toLocaleDateString('tr-TR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })}
                time={`${booking.start_time?.slice(0, 5)} - ${booking.end_time?.slice(0, 5)}`}
                opponents={[]} // No opponents data available yet
                partners={['Sen']} // User is always a partner
                status={booking.status === 'confirmed' ? 'confirmed' : 'pending'}
                result={undefined} // No match results yet
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
    gap: 8,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
  },
  activeTabText: {
    fontFamily: 'Inter-Bold',
    color: colors.white,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    marginTop: 20,
  },
  errorText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.status.error,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    marginTop: 20,
  },
  emptyText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.text.disabled,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
    textAlign: 'center',
  },
});