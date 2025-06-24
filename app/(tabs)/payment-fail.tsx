import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Circle as XCircle, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { colors } from '@/app/theme/colors';

export default function PaymentFailScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <XCircle size={80} color={colors.status.error} />
        <Text style={styles.title}>Ödeme Başarısız</Text>
        <Text style={styles.message}>
          Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin veya farklı bir ödeme yöntemi kullanın.
        </Text>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.white} />
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.replace('/(tabs)/')}
        >
          <Text style={styles.homeButtonText}>Ana Sayfaya Git</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.status.error,
    marginTop: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.charcoal,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  backButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    minWidth: 200,
    gap: 8,
  },
  backButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.white,
  },
  homeButton: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  homeButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.primary,
  },
});