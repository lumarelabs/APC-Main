import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell, Trophy, GraduationCap, BookOpen, Instagram, MapPin } from 'lucide-react-native';
import { UpcomingBooking } from '@/app/components/home/UpcomingBooking';
import { ImageSlider } from '@/app/components/home/ImageSlider';
import { ServiceDetailsModal } from '@/app/components/home/ServiceDetailsModal';
import { BookingDetailsModal } from '@/app/components/home/BookingDetailsModal';
import { useUserBookings } from '@/app/hooks/useSupabaseData';
import { useApp } from '@/app/context/AppContext';
import { colors } from '@/app/theme/colors';
import Logo2 from '../../assets/images/logo2.png';
import RacketImage from '../../assets/images/racket.png';
import LocationMap from '../components/home/LocationMap';

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

  // Transform Supabase bookings to component format
  const transformedBookings: Booking[] = bookings.map(booking => ({
    id: booking.id,
    courtName: booking.court?.name || 'Unknown Court',
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

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Welcome Header */}
        <View style={styles.welcomeHeader}>
          <View>
            <Text style={styles.greeting}>Hoş geldin, {displayName}!</Text>
            <Text style={styles.subtitle}>Oynamaya hazır mısın?</Text>
          </View>
          <Image source={Logo2} style={styles.topRightLogo} resizeMode="contain" />
        </View>

        {/* Header with About */}
        <View style={styles.headerContainer}>
          <Image source={RacketImage} style={styles.headerLogo} resizeMode="contain" />
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutTitle}>Alaçatı Padel Club</Text>
            <Text style={styles.aboutText}>
              Alaçatı Padel Club, İzmir'in popüler tatil beldesi Alaçatı'da bulunan bir raket sporları kulübüdür. Kulüp, padel ve pickleball kortu kiralama, özel dersler, grup maçları ve sosyal etkinlikler sunmaktadır.
            </Text>
          </View>
        </View>

        {/* Image Slider */}
        <ImageSlider />

        {/* Upcoming bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Yaklaşan Rezervasyonlar</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Hepsini Gör</Text>
            </TouchableOpacity>
          </View>

          {bookingsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Loading bookings...</Text>
            </View>
          ) : transformedBookings.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bookingsScroll}>
              {transformedBookings.map((booking) => (
                <TouchableOpacity key={booking.id} onPress={() => setSelectedBooking(booking)}>
                  <UpcomingBooking 
                    courtName={booking.courtName}
                    courtType={booking.courtType}
                    date={booking.date}
                    time={booking.time}
                    image={booking.image}
                  />
                </TouchableOpacity>
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
              <Text style={styles.serviceDescription}>Kort rezervasyonu yapın ve oyununuzu planlayın</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.serviceCard}
              onPress={() => setSelectedService('lessons')}
            >
              <View style={[styles.serviceIcon, { backgroundColor: 'rgba(50, 209, 255, 0.15)' }]}>
                <GraduationCap size={24} color="#32D1FF" />
              </View>
              <Text style={styles.serviceTitle}>Dersler</Text>
              <Text style={styles.serviceDescription}>Profesyonel eğitmenlerden özel ders alın</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.serviceCard}
              onPress={() => setSelectedService('tournaments')}
            >
              <View style={[styles.serviceIcon, { backgroundColor: 'rgba(255, 86, 86, 0.15)' }]}>
                <Trophy size={24} color="#FF5656" />
              </View>
              <Text style={styles.serviceTitle}>Turnuvalar</Text>
              <Text style={styles.serviceDescription}>Turnuvalara katılın ve ödüller kazanın</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Tournaments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Yaklaşan Turnuvalar</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tournamentCard}>
            <Image 
              source={{ uri: "https://images.pexels.com/photos/8224728/pexels-photo-8224728.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" }}
              style={styles.tournamentImage}
            />
            <View style={styles.tournamentInfo}>
              <Text style={styles.tournamentTitle}>Bahar Padel Şampiyonası</Text>
              <Text style={styles.tournamentDate}>15-17 Mart 2024</Text>
              <TouchableOpacity style={styles.registerButton}>
                <Text style={styles.registerButtonText}>Şimdi Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>İletişim</Text>
          
          {/* Map */}
          <View style={styles.mapContainer}>
            <LocationMap />
          </View>

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
  headerLogo: {
    width: 140,
    height: 140,
    marginRight: 16,
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
    flexWrap: 'wrap',
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
    marginBottom: 4,
    textAlign: 'center',
  },
  serviceDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.text.disabled,
    textAlign: 'center',
  },
  tournamentCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tournamentImage: {
    width: '100%',
    height: 160,
  },
  tournamentInfo: {
    padding: 16,
  },
  tournamentTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.charcoal,
    marginBottom: 4,
  },
  tournamentDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.disabled,
    marginBottom: 12,
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: colors.white,
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
  topRightLogo: {
    width: 130,
    height: 50,
  },
  mapContainer: {
    width: Dimensions.get('window').width - 32,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
});