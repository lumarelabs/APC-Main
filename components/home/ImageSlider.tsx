import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Logo1 from '../../assets/images/logo1.png';
import Logo2 from '../../assets/images/logo2.png';
import Logo3 from '../../assets/images/logo3.png';
import Logo4 from '../../assets/images/logo4.png';

const { width } = Dimensions.get('window');

export const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [Logo4, Logo3];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={images[currentIndex]} style={styles.image} resizeMode="cover" />
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: '100%',
    marginVertical: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
  },
}); 