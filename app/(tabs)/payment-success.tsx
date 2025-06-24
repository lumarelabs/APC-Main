import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { colors } from '@/app/theme/colors';

export default function PaymentSuccessScreen() {
  useEffect(() => {
    // Redirect to home after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)/');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <CheckCircle size={80} color={colors.status.success} />
        <Text style={styles.title}>Ödeme Başarılı!</Text>
        <Text style={styles.message}>
          Ödemeniz başarıyla tamamlandı. Rezervasyonunuz onaylanmıştır.
        </Text>
        <Text style={styles.redirect}>
          Ana sayfaya yönlendiriliyorsunuz...
        </Text>
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
    color: colors.status.success,
    marginTop: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.charcoal,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  redirect: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.disabled,
    textAlign: 'center',
  },
});