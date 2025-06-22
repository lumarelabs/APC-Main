import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
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

  // Filter courts based on selected type
  const filteredCourts = courtType === 'all' 
    ? courts 
    : courts.filter(court => {
        console.log('Filtering court:', court.name, 'type:', court.type, 'matches:', court.type === courtType);
        return court.type === courtType;
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
      </View>
    );
  }

  if (filteredCourts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {courtType === 'padel' 
            ? 'Padel kortu bulunamadı' 
            : courtType === 'pickleball'
            ? 'Pickleball kortu bulunamadı'
            : 'Uygun kort bulunamadı'
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
      <Text style={styles.title}>Kort Seçiniz</Text>
      
      <FlatList
        data={filteredCourts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <CourtCard
            name={item.name}
            type={item.type}
            price={item.price_per_hour / 100} // Convert from cents to TL
            image={item.image_url || 'https://images.pexels.com/photos/2277981/pexels-photo-2277981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
            location={item.location}
            onPress={() => onSelectCourt(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.charcoal,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: 'space-between',
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