import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { CreditCard } from 'lucide-react-native';
import { PaymentModal } from './PaymentModal';
import { useApp } from '@/app/context/AppContext';
import { colors } from '@/app/theme/colors';

type PaymentButtonProps = {
  amount: number;
  orderId: string;
  onPaymentSuccess: () => void;
  onPaymentError?: (error: string) => void;
  disabled?: boolean;
  style?: any;
};

export function PaymentButton({
  amount,
  orderId,
  onPaymentSuccess,
  onPaymentError,
  disabled = false,
  style
}: PaymentButtonProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { user, profile } = useApp();

  const handlePaymentPress = () => {
    if (!user || !profile) {
      Alert.alert(
        'Giriş Gerekli',
        'Ödeme yapabilmek için giriş yapmanız gerekiyor.',
        [{ text: 'Tamam' }]
      );
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setProcessing(false);
    
    Alert.alert(
      'Ödeme Başarılı!',
      'Ödemeniz başarıyla tamamlandı. Rezervasyonunuz onaylanmıştır.',
      [
        {
          text: 'Tamam',
          onPress: onPaymentSuccess
        }
      ]
    );
  };

  const handlePaymentError = (error: string) => {
    setShowPaymentModal(false);
    setProcessing(false);
    
    Alert.alert(
      'Ödeme Hatası',
      error || 'Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.',
      [{ text: 'Tamam' }]
    );
    
    onPaymentError?.(error);
  };

  const handleModalClose = () => {
    setShowPaymentModal(false);
    setProcessing(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.paymentButton,
          disabled && styles.disabledButton,
          style
        ]}
        onPress={handlePaymentPress}
        disabled={disabled || processing}
      >
        {processing ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <>
            <CreditCard size={20} color={colors.white} />
            <Text style={styles.paymentButtonText}>
              ₺{amount} - Güvenli Ödeme
            </Text>
          </>
        )}
      </TouchableOpacity>

      {user && profile && (
        <PaymentModal
          isVisible={showPaymentModal}
          onClose={handleModalClose}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          amount={amount}
          orderId={orderId}
          userEmail={user.email || ''}
          userName={profile.full_name || 'Kullanıcı'}
          userPhone={profile.phone || '5555555555'}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  paymentButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.6,
    backgroundColor: colors.text.disabled,
  },
  paymentButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.white,
  },
});