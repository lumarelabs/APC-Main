import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { CourtCard } from '@/app/components/courts/CourtCard';
import { useCourts } from '@/app/hooks/useSupabaseData';
import { colors } from '@/app/theme/colors';

type CourtListProps = {
  courtType: 'all' | 'padel' | 'pickleball';
  onSelectCourt: (court: any) => void;
};

export function CourtList({ courtType, onSelectCourt }: CourtListProps) {
  const { courts, loading, error } = useCourts(courtType === 'all' ? undefined : courtType);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading courts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading courts: {error}</Text>
      </View>
    );
  }

  if (courts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No courts available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kort Seçiniz</Text>
      
      <FlatList
        data={courts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <CourtCard
            name={item.name}
            type={item.type}
            price={item.price_per_hour / 100} // Convert from cents
            rating={item.rating || 4.5}
            distance="1.2 km" // Static for now
            image={item.image_url || 'https://images.pexels.com/photos/2277981/pexels-photo-2277981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
            availableSlots={Math.floor(Math.random() * 5) + 1} // Random for now
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
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text.disabled,
    textAlign: 'center',
  },
});