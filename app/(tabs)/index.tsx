import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell, Trophy, GraduationCap, BookOpen } from 'lucide-react-native';
import { UpcomingBooking } from '@/components/home/UpcomingBooking';
import { ImageSlider } from '@/components/home/ImageSlider';
import { ServiceDetailsModal } from '@/components/home/ServiceDetailsModal';
import { BookingDetailsModal } from '@/components/home/BookingDetailsModal';
import { colors } from '@/app/theme/colors';
import Logo2 from '../../assets/images/logo2.png';

type Booking = {
  courtName: string;
  courtType: "padel" | "pickleball";
  date: string;
  time: string;
  image: string;
  players: Array<{ name: string; skillLevel: string }>;
};

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedService, setSelectedService] = useState<'court' | 'lessons' | 'tournaments' | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const bookings: Booking[] = [
    {
      courtName: "Padel Court 2",
      courtType: "padel",
      date: "Today",
      time: "18:00 - 19:30",
      image: "https://images.pexels.com/photos/2277981/pexels-photo-2277981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      players: [
        { name: "Alex Johnson", skillLevel: "Advanced" },
        { name: "Sarah Smith", skillLevel: "Intermediate" },
        { name: "Mike Wilson", skillLevel: "Advanced" }
      ]
    },
    {
      courtName: "Pickleball Court 1",
      courtType: "pickleball",
      date: "Tomorrow",
      time: "10:00 - 11:30",
      image: "https://images.pexels.com/photos/6765942/pexels-photo-6765942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      players: [
        { name: "Emma Davis", skillLevel: "Intermediate" },
        { name: "John Smith", skillLevel: "Beginner" }
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Welcome Header */}
        <View style={styles.welcomeHeader}>
          <View>
            <Text style={styles.greeting}>Hey, Alex!</Text>
            <Text style={styles.subtitle}>Ready to hit the courts?</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Search size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Header with Logo and About */}
        <View style={styles.headerContainer}>
          <Image source={Logo2} style={styles.headerLogo} resizeMode="contain" />
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutTitle}>Alacati Padel Club</Text>
            <Text style={styles.aboutText}>
              Alaçatı Padel Club is a racket sports club located in Alaçatı, a popular holiday resort in Izmir. The club offers padel and pickleball court rentals, private lessons, group matches and social events...
            </Text>
          </View>
        </View>

        {/* Image Slider */}
        <ImageSlider />

        {/* Upcoming bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bookingsScroll}>
            {bookings.map((booking, index) => (
              <TouchableOpacity key={index} onPress={() => setSelectedBooking(booking)}>
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
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.servicesGrid}>
            <TouchableOpacity 
              style={styles.serviceCard}
              onPress={() => setSelectedService('court')}
            >
              <View style={[styles.serviceIcon, { backgroundColor: 'rgba(22, 255, 145, 0.15)' }]}>
                <BookOpen size={24} color="#16FF91" />
              </View>
              <Text style={styles.serviceTitle}>Court Booking</Text>
              <Text style={styles.serviceDescription}>Book your court</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.serviceCard}
              onPress={() => setSelectedService('lessons')}
            >
              <View style={[styles.serviceIcon, { backgroundColor: 'rgba(50, 209, 255, 0.15)' }]}>
                <GraduationCap size={24} color="#32D1FF" />
              </View>
              <Text style={styles.serviceTitle}>Lessons</Text>
              <Text style={styles.serviceDescription}>Learn from pros</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.serviceCard}
              onPress={() => setSelectedService('tournaments')}
            >
              <View style={[styles.serviceIcon, { backgroundColor: 'rgba(255, 86, 86, 0.15)' }]}>
                <Trophy size={24} color="#FF5656" />
              </View>
              <Text style={styles.serviceTitle}>Tournaments</Text>
              <Text style={styles.serviceDescription}>Join competitions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Tournaments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Tournaments</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tournamentCard}>
            <Image 
              source={{ uri: "https://images.pexels.com/photos/8224728/pexels-photo-8224728.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" }}
              style={styles.tournamentImage}
            />
            <View style={styles.tournamentInfo}>
              <Text style={styles.tournamentTitle}>Spring Padel Championship</Text>
              <Text style={styles.tournamentDate}>March 15-17, 2024</Text>
              <TouchableOpacity style={styles.registerButton}>
                <Text style={styles.registerButtonText}>Register Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Contact Us</Text>
          <Text style={styles.contactText}>Alaçatı Padel Club</Text>
          <Text style={styles.contactText}>12065. Sokak No: 3</Text>
          <Text style={styles.contactText}>Alaçatı, İzmir</Text>
          <Text style={styles.contactEmail}>alacatipadelclub@gmail.com</Text>
          <Text style={styles.contactPhone}>Tel: +90 535 306 2892</Text>
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
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
  },
  headerLogo: {
    width: 100,
    height: 60,
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
  contactText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.disabled,
    marginBottom: 4,
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