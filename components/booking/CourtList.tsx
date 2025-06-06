import { View, Text, StyleSheet, FlatList } from 'react-native';
import { CourtCard } from '@/components/courts/CourtCard';

type CourtListProps = {
  courtType: 'all' | 'padel' | 'pickleball';
  onSelectCourt: (court: any) => void;
};

export function CourtList({ courtType, onSelectCourt }: CourtListProps) {
  const courts = [
    {
      id: '1',
      name: 'Padel Court 1',
      type: 'padel',
      price: 35,
      rating: 4.8,
      distance: '1.2 km',
      image: 'https://images.pexels.com/photos/2277981/pexels-photo-2277981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      availableSlots: 3,
    },
    {
      id: '2',
      name: 'Padel Court 2',
      type: 'padel',
      price: 35,
      rating: 4.7,
      distance: '1.2 km',
      image: 'https://images.pexels.com/photos/8224728/pexels-photo-8224728.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      availableSlots: 2,
    },
    {
      id: '3',
      name: 'Padel Court 3',
      type: 'padel',
      price: 35,
      rating: 4.9,
      distance: '1.2 km',
      image: 'https://images.pexels.com/photos/13635523/pexels-photo-13635523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      availableSlots: 4,
    },
    {
      id: '4',
      name: 'Padel Court 4',
      type: 'padel',
      price: 35,
      rating: 4.6,
      distance: '1.2 km',
      image: 'https://images.pexels.com/photos/2277981/pexels-photo-2277981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      availableSlots: 3,
    },
    {
      id: '5',
      name: 'Pickleball Court 1',
      type: 'pickleball',
      price: 25,
      rating: 4.5,
      distance: '1.2 km',
      image: 'https://images.pexels.com/photos/6765942/pexels-photo-6765942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      availableSlots: 5,
    },
    {
      id: '6',
      name: 'Pickleball Court 2',
      type: 'pickleball',
      price: 25,
      rating: 4.3,
      distance: '1.2 km',
      image: 'https://images.pexels.com/photos/6765986/pexels-photo-6765986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      availableSlots: 6,
    },
  ];

  const filteredCourts = courtType === 'all' ? courts : courts.filter(court => court.type === courtType);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Court</Text>
      
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
            price={item.price}
            rating={item.rating}
            distance={item.distance}
            image={item.image}
            availableSlots={item.availableSlots}
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
    color: '#FFFFFF',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});