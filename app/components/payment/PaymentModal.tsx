import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';
import { X } from 'lucide-react-native';
import { colors } from '@/app/theme/colors';

type PaymentModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
  amount: number;
  orderId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
};

export function PaymentModal({
  isVisible,
  onClose,
  onSuccess,
  onError,
  amount,
  orderId,
  userEmail,
  userName,
  userPhone
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);

  const initializePayment = async () => {
    try {
      setLoading(true);
      
      // FIXED: Use proper API URL construction
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8081';
      const paymentEndpoint = `${apiUrl}/payment`;
      
      console.log('Making payment request to:', paymentEndpoint);
      
      const response = await fetch(paymentEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          orderId,
          userEmail,
          userName,
          userPhone
        })
      });

      // FIXED: Better error handling for non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Non-JSON response received:', response.status, response.statusText);
        const textResponse = await response.text();
        console.error('Response body:', textResponse.substring(0, 200));
        
        if (response.status === 404) {
          onError('Ödeme servisi bulunamadı. Lütfen daha sonra tekrar deneyin.');
        } else {
          onError('Ödeme servisi ile bağlantı kurulamadı');
        }
        return;
      }

      const result = await response.json();
      console.log('Payment API response:', result);

      if (result.success) {
        setPaymentUrl(result.iframe_url);
      } else {
        onError(result.error || 'Ödeme başlatılamadı');
      }
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      
      // FIXED: Better error messages based on error type
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        onError('İnternet bağlantınızı kontrol edin');
      } else if (error.message?.includes('JSON')) {
        onError('Ödeme servisi geçici olarak kullanılamıyor');
      } else {
        onError('Ödeme servisi ile bağlantı kurulamadı');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWebViewNavigationStateChange = (navState: any) => {
    const { url } = navState;
    console.log('WebView navigation:', url);
    
    // Check for success URL
    if (url.includes('/payment-success')) {
      onSuccess();
      setPaymentUrl(null);
      return;
    }
    
    // Check for failure URL
    if (url.includes('/payment-fail')) {
      onError('Ödeme başarısız oldu');
      setPaymentUrl(null);
      return;
    }
  };

  const handleWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    onError('Ödeme sayfası yüklenirken hata oluştu');
    setPaymentUrl(null);
  };

  const openInBrowser = async () => {
    if (paymentUrl) {
      try {
        const result = await WebBrowser.openBrowserAsync(paymentUrl, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
          controlsColor: colors.primary,
        });
        
        if (result.type === 'cancel') {
          onClose();
        }
      } catch (error) {
        console.error('Browser open error:', error);
        onError('Tarayıcı açılamadı');
      }
    }
  };

  React.useEffect(() => {
    if (isVisible && !paymentUrl && !loading) {
      initializePayment();
    }
  }, [isVisible]);

  const handleClose = () => {
    setPaymentUrl(null);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Güvenli Ödeme</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color={colors.charcoal} />
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Ödeme sayfası hazırlanıyor...</Text>
            <Text style={styles.debugText}>
              API URL: {process.env.EXPO_PUBLIC_API_URL || 'Tanımlı değil'}
            </Text>
          </View>
        )}

        {paymentUrl && !loading && (
          <View style={styles.paymentContainer}>
            {Platform.OS === 'web' ? (
              // Web platform - use iframe
              <iframe
                src={paymentUrl}
                style={styles.iframe}
                title="PayTR Payment"
                onLoad={() => setLoading(false)}
              />
            ) : (
              // Mobile platforms
              <>
                <WebView
                  ref={webViewRef}
                  source={{ uri: paymentUrl }}
                  style={styles.webview}
                  onNavigationStateChange={handleWebViewNavigationStateChange}
                  onError={handleWebViewError}
                  startInLoadingState={true}
                  renderLoading={() => (
                    <View style={styles.webviewLoading}>
                      <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                  )}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  allowsInlineMediaPlayback={true}
                />
                
                <View style={styles.browserOption}>
                  <TouchableOpacity 
                    style={styles.browserButton} 
                    onPress={openInBrowser}
                  >
                    <Text style={styles.browserButtonText}>
                      Tarayıcıda Aç
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Ödeme işlemi PayTR güvencesi altında gerçekleştirilmektedir.
          </Text>
          <Text style={styles.amountText}>
            Ödenecek Tutar: ₺{amount}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.charcoal,
  },
  closeButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text.disabled,
    marginTop: 16,
    textAlign: 'center',
  },
  debugText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.text.disabled,
    marginTop: 8,
    textAlign: 'center',
  },
  paymentContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  webviewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  browserOption: {
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.background.tertiary,
  },
  browserButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  browserButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: colors.white,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.background.tertiary,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.text.disabled,
    textAlign: 'center',
    marginBottom: 8,
  },
  amountText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
  },
});