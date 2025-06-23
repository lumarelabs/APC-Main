import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell, Trophy, GraduationCap, BookOpen, Instagram, MapPin } from 'lucide-react-native';
import { UpcomingBooking } from '@/app/components/home/UpcomingBooking';
import { ServiceDetailsModal } from '@/app/components/home/ServiceDetailsModal';
import { BookingDetailsModal } from '@/app/components/home/BookingDetailsModal';
import { useUserBookings } from '@/app/hooks/useSupabaseData';
import { useApp } from '@/app/context/AppContext';
import { colors } from '@/app/theme/colors';
import { router } from 'expo-router';

type Booking = {
  id: string;
  courtName: string;
  courtType: "padel" | "pickleball";
  date: string;
  time: string;
  image: string;
  players?: Array<{ name: string; skillLevel: string }>;
};

export default function HomeScreen() {
  const [selectedService, setSelectedService] = useState<'court' | 'lessons' | 'tournaments' | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  const { user, profile } = useApp();
  const { bookings, loading: bookingsLoading } = useUserBookings();

  // Transform Supabase bookings to component format - only upcoming user bookings
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const transformedBookings: Booking[] = bookings
    .filter(booking => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate >= today; // Only show upcoming bookings
    })
    .slice(0, 5) // Limit to 5 upcoming bookings
    .map(booking => ({
      id: booking.id,
      courtName: booking.court?.name || 'Bilinmeyen Kort',
      courtType: booking.court?.type || 'padel',
      date: new Date(booking.date).toLocaleDateString('tr-TR', { 
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }),
      time: `${booking.start_time.slice(0, 5)} - ${booking.end_time.slice(0, 5)}`,
      image: booking.court?.image_url || 'https://images.pexels.com/photos/2277981/pexels-photo-2277981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      players: [] // Will be populated from matches data later
    }));

  // FIXED: Use full_name from profile, fallback to email username
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Kullanıcı';

  const scrollToTournaments = () => {
    // Since tournaments section is on the same page, we don't need navigation
    // This is just a placeholder for the scroll functionality
  };

  const handleNavigateToBooking = () => {
    setSelectedService(null);
    router.push('/(tabs)/book');
  };

  const handleSeeAllBookings = () => {
    router.push('/(tabs)/matches');
  };

  const handleBookingPress = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* FIXED: Responsive Welcome Header */}
        <View style={styles.welcomeHeader}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.greeting} numberOfLines={1} adjustsFontSizeToFit>
              Hoş geldin, {displayName}!
            </Text>
            <Text style={styles.subtitle}>Oynamaya hazır mısın?</Text>
          </View>
          {/* REMOVED: Logo2 image slider as requested */}
        </View>

        {/* Header with About */}
        <View style={styles.headerContainer}>
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutTitle}>Alaçatı Padel Club</Text>
            <Text style={styles.aboutText}>
              Alaçatı Padel Club, İzmir'in popüler tatil beldesi Alaçatı'da bulunan bir raket sporları kulübüdür. Kulüp, padel ve pickleball kortu kiralama, özel dersler, grup maçları ve sosyal etkinlikler sunmaktadır.
            </Text>
          </View>
        </View>

        {/* Upcoming bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Yaklaşan Rezervasyonlar</Text>
            <TouchableOpacity onPress={handleSeeAllBookings}>
              <Text style={styles.seeAll}>Hepsini Gör</Text>
            </TouchableOpacity>
          </View>

          {bookingsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Rezervasyonlar yükleniyor...</Text>
            </View>
          ) : transformedBookings.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bookingsScroll}>
              {transformedBookings.map((booking) => (
                <View key={booking.id}>
                  <UpcomingBooking 
                    courtName={booking.courtName}
                    courtType={booking.courtType}
                    date={booking.date}
                    time={booking.time}
                    image={booking.image}
                    onPress={() => handleBookingPress(booking)}
                  />
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noBookingsContainer}>
              <Text style={styles.noBookingsText}>Henüz rezervasyonunuz yok</Text>
            </View>
          )}
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hizmetler</Text>
          <View style={styles.servicesGrid}>
            <TouchableOpacity 
              style={styles.serviceCard}
              onPress={() => setSelectedService('court')}
            >
              <View style={[styles.serviceIcon, { backgroundColor: 'rgba(22, 255, 145, 0.15)' }]}>
                <BookOpen size={24} color="#16FF91" />
              </View>
              <Text style={styles.serviceTitle}>Kort Rezervasyonu</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.serviceCard}
              onPress={() => setSelectedService('lessons')}
            >
              <View style={[styles.serviceIcon, { backgroundColor: 'rgba(50, 209, 255, 0.15)' }]}>
                <GraduationCap size={24} color="#32D1FF" />
              </View>
              <Text style={styles.serviceTitle}>Dersler</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.serviceCard}
              onPress={() => setSelectedService('tournaments')}
            >
              <View style={[styles.serviceIcon, { backgroundColor: 'rgba(255, 86, 86, 0.15)' }]}>
                <Trophy size={24} color="#FF5656" />
              </View>
              <Text style={styles.serviceTitle}>Turnuvalar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Tournaments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Yaklaşan Turnuvalar</Text>
          </View>
          <View style={styles.noTournamentsContainer}>
            <Text style={styles.noTournamentsText}>Şu anda yaklaşan turnuva yok</Text>
            <Text style={styles.noTournamentsSubtext}>Yeni turnuvalar için takipte kalın!</Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>İletişim</Text>
          
          <View style={styles.contactContent}>
            <TouchableOpacity 
              style={styles.contactLink}
              onPress={() => Linking.openURL('https://www.instagram.com/alacatipadelclub')}
            >
              <Instagram size={24} color={colors.primary} />
              <Text style={styles.contactLinkText}>@alacatipadelclub</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactLink}
              onPress={() => Linking.openURL('https://goo.gl/maps/https://g.co/kgs/STrxuyX')}
            >
              <MapPin size={24} color={colors.primary} />
              <Text style={styles.contactLinkText}>Haritada Göster</Text>
            </TouchableOpacity>

            <Text style={styles.contactEmail}>alacatipadelclub@gmail.com</Text>
            <Text style={styles.contactPhone}>Tel: +90 535 306 2892</Text>
          </View>
        </View>

        {/* Service Details Modal */}
        <ServiceDetailsModal
          isVisible={selectedService !== null}
          onClose={() => setSelectedService(null)}
          serviceType={selectedService || 'court'}
          onNavigateToBooking={handleNavigateToBooking}
          onNavigateToTournaments={scrollToTournaments}
        />

        {/* Booking Details Modal */}
        {selectedBooking && (
          <BookingDetailsModal
            isVisible={selectedBooking !== null}
            onClose={() => setSelectedBooking(null)}
            booking={selectedBooking}
          />
        )}
      </ScrollView>
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
  contentContainer: {
    paddingBottom: 100,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.charcoal,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.disabled,
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
  },
  aboutContainer: {
    flex: 1,
  },
  aboutTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.charcoal,
    marginBottom: 8,
  },
  aboutText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.disabled,
    lineHeight: 20,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.charcoal,
  },
  seeAll: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
  },
  bookingsScroll: {
    marginLeft: -8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
    marginLeft: 8,
  },
  noBookingsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
  },
  noBookingsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text.disabled,
    textAlign: 'center',
  },
  servicesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  serviceCard: {
    width: '31%',
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 120,
    justifyContent: 'center',
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: colors.charcoal,
    textAlign: 'center',
    lineHeight: 18,
  },
  noTournamentsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
  },
  noTournamentsText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.text.disabled,
    textAlign: 'center',
    marginBottom: 4,
  },
  noTournamentsSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.disabled,
    textAlign: 'center',
  },
  contactSection: {
    marginTop: 32,
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    alignItems: 'center',
  },
  contactTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.charcoal,
    marginBottom: 16,
  },
  contactContent: {
    alignItems: 'center',
  },
  contactLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactLinkText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
  },
  contactEmail: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  contactPhone: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
  },
});