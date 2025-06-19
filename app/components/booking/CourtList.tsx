import { View, Text, StyleSheet, FlatList } from 'react-native';
import { CourtCard } from '@/app/components/courts/CourtCard';

type CourtListProps = {
  courts: any[];
  courtType: 'all' | 'padel' | 'pickleball';
  onSelectCourt: (court: any) => void;
};

export function CourtList({ courts, courtType, onSelectCourt }: CourtListProps) {
  const filteredCourts = courtType === 'all' ? courts : courts.filter(court => court.type === courtType);

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
            type={item.type as 'padel' | 'pickleball'}
            price={item.price_per_hour / 100} // Convert from cents to currency
            rating={item.rating || 4.5}
            distance="1.2 km" // This could be calculated based on user location
            image={item.image_url || 'https://images.pexels.com/photos/2277981/pexels-photo-2277981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
            availableSlots={5} // This could be calculated based on bookings
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
    color: '#000000',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});