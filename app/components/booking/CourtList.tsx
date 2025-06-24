import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { CourtCard } from '@/app/components/courts/CourtCard';
import { useCourts } from '@/app/hooks/useSupabaseData';
import { colors } from '@/app/theme/colors';

type CourtListProps = {
  courtType: 'all' | 'padel' | 'pickleball';
  onSelectCourt: (court: any) => void;
};

export function CourtList({ courtType, onSelectCourt }: CourtListProps) {
  const { courts, loading, error } = useCourts();

  console.log('CourtList - courtType:', courtType);
  console.log('CourtList - all courts:', courts);

  // Filter courts based on selected type - FIXED: Use exact string matching
  const filteredCourts = courtType === 'all' 
    ? courts 
    : courts.filter(court => {
        console.log('Filtering court:', court.name, 'type:', court.type, 'courtType:', courtType);
        // Ensure exact string matching and handle case sensitivity
        const courtTypeNormalized = court.type?.toLowerCase();
        const selectedTypeNormalized = courtType.toLowerCase();
        const matches = courtTypeNormalized === selectedTypeNormalized;
        console.log('Match result:', matches);
        return matches;
      });

  console.log('CourtList - filtered courts:', filteredCourts);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Kortlar yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Kortlar yüklenirken hata oluştu: {error}</Text>
      </View>
    );
  }

  if (courts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Hiç kort bulunamadı</Text>
        <Text style={styles.emptySubtext}>Lütfen daha sonra tekrar deneyin.</Text>
      </View>
    );
  }

  // FIXED: Only show empty state if no courts match the filter AND a specific type is selected
  if (filteredCourts.length === 0 && courtType !== 'all') {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {courtType === 'padel' 
            ? 'Padel kortu bulunamadı' 
            : 'Pickleball kortu bulunamadı'
          }
        </Text>
        <Text style={styles.emptySubtext}>
          Lütfen farklı bir kort türü seçin veya daha sonra tekrar deneyin.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kort Seçiniz ({filteredCourts.length} kort)</Text>
      
      {/* FIXED: Proper grid layout with correct spacing */}
      <View style={styles.courtsGrid}>
        {filteredCourts.map((item, index) => (
          <View key={item.id} style={styles.courtCardContainer}>
            <CourtCard
              name={item.name}
              type={item.type}
              price={item.price_per_hour} // FIXED: Direct TL value, no division
              image={item.image_url || 'https://images.pexels.com/photos/2277981/pexels-photo-2277981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
              location={item.location}
              onPress={() => onSelectCourt(item)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.charcoal,
    marginBottom: 16,
  },
  courtsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  courtCardContainer: {
    width: '48%',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text.disabled,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.status.error,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
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