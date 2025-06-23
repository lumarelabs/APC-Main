import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/app/hooks/useAuth';
import { colors } from '@/app/theme/colors';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [skillLevel, setSkillLevel] = useState<'Başlangıç' | 'Orta' | 'İleri'>('Başlangıç');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Google OAuth completion modal
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleUserData, setGoogleUserData] = useState<any>(null);

  const { signIn, signUp, signInWithGoogle, error: authError, clearError, updateProfile } = useAuth();

  // Clear errors when switching modes or changing inputs
  useEffect(() => {
    setLocalError(null);
    if (clearError) clearError();
  }, [isSignUp, email, password, fullName, skillLevel]);

  const handleSubmit = async () => {
    if (!email || !password) {
      setLocalError('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    if (isSignUp && !fullName) {
      setLocalError('Lütfen adınızı ve soyadınızı girin');
      return;
    }

    if (password.length < 6) {
      setLocalError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    try {
      setLoading(true);
      setLocalError(null);

      if (isSignUp) {
        await signUp(email, password, fullName, skillLevel);
        Alert.alert(
          'Başarılı!', 
          'Hesabınız oluşturuldu. Giriş yapabilirsiniz.',
          [
            {
              text: 'Tamam',
              onPress: () => {
                setIsSignUp(false);
                setPassword('');
                setFullName('');
                setSkillLevel('Başlangıç');
              }
            }
          ]
        );
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setLocalError(err.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setLocalError(null);
      
      const result = await signInWithGoogle();
      
      // If Google sign-in is successful but user needs to complete profile
      if (result && result.isNewUser) {
        setGoogleUserData(result.user);
        setShowGoogleModal(true);
      }
    } catch (err: any) {
      setLocalError(err.message || 'Google ile giriş yapılamadı');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleProfileComplete = async () => {
    if (!fullName.trim()) {
      setLocalError('Lütfen adınızı ve soyadınızı girin');
      return;
    }

    try {
      setLoading(true);
      
      // Update user profile with additional info
      await updateProfile({
        full_name: fullName.trim(),
        level: skillLevel
      });
      
      setShowGoogleModal(false);
      setGoogleUserData(null);
      setFullName('');
      setSkillLevel('Başlangıç');
    } catch (err: any) {
      setLocalError(err.message || 'Profil güncellenemedi');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setLocalError(null);
    setEmail('');
    setPassword('');
    setFullName('');
    setSkillLevel('Başlangıç');
    if (clearError) clearError();
  };

  const displayError = localError || authError;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isSignUp ? 'Hesap Oluştur' : 'Hoş Geldiniz'}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp 
                ? 'Kort rezervasyonu yapmak için hesap oluşturun' 
                : 'Hesabınıza giriş yapın'
              }
            </Text>
          </View>

          <View style={styles.form}>
            {isSignUp && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Ad Soyad</Text>
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Adınızı ve soyadınızı girin"
                    placeholderTextColor={colors.text.disabled}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Seviye</Text>
                  <View style={styles.skillLevelContainer}>
                    {(['Başlangıç', 'Orta', 'İleri'] as const).map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.skillLevelButton,
                          skillLevel === level && styles.skillLevelButtonActive
                        ]}
                        onPress={() => setSkillLevel(level)}
                      >
                        <Text style={[
                          styles.skillLevelText,
                          skillLevel === level && styles.skillLevelTextActive
                        ]}>
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-posta</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="E-posta adresinizi girin"
                placeholderTextColor={colors.text.disabled}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Şifre</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Şifrenizi girin"
                placeholderTextColor={colors.text.disabled}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {displayError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{displayError}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isSignUp ? 'Hesap Oluştur' : 'Giriş Yap'}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[styles.googleButton, googleLoading && styles.submitButtonDisabled]}
              onPress={handleGoogleSignIn}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <ActivityIndicator size="small" color={colors.charcoal} />
              ) : (
                <>
                  <Text style={styles.googleIcon}>G</Text>
                  <Text style={styles.googleButtonText}>Google ile devam et</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
              <Text style={styles.toggleButtonText}>
                {isSignUp 
                  ? 'Zaten hesabınız var mı? Giriş Yapın' 
                  : "Hesabınız yok mu? Hesap Oluşturun"
                }
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Google Profile Completion Modal */}
      <Modal
        visible={showGoogleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGoogleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profili Tamamla</Text>
            <Text style={styles.modalSubtitle}>
              Google hesabınızla giriş yaptınız. Lütfen profil bilgilerinizi tamamlayın.
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ad Soyad</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Adınızı ve soyadınızı girin"
                placeholderTextColor={colors.text.disabled}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Seviye</Text>
              <View style={styles.skillLevelContainer}>
                {(['Başlangıç', 'Orta', 'İleri'] as const).map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.skillLevelButton,
                      skillLevel === level && styles.skillLevelButtonActive
                    ]}
                    onPress={() => setSkillLevel(level)}
                  >
                    <Text style={[
                      styles.skillLevelText,
                      skillLevel === level && styles.skillLevelTextActive
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {displayError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{displayError}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleGoogleProfileComplete}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>Profili Tamamla</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.charcoal,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.disabled,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.charcoal,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.charcoal,
    borderWidth: 1,
    borderColor: colors.background.tertiary,
  },
  skillLevelContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  skillLevelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  skillLevelButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  skillLevelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
  },
  skillLevelTextActive: {
    fontFamily: 'Inter-Bold',
    color: colors.white,
  },
  errorContainer: {
    backgroundColor: colors.status.error + '20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.status.error,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.white,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.background.tertiary,
  },
  dividerText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.disabled,
    marginHorizontal: 16,
  },
  googleButton: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.background.tertiary,
  },
  googleIcon: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.primary,
    marginRight: 12,
  },
  googleButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.charcoal,
  },
  toggleButton: {
    alignItems: 'center',
    padding: 12,
  },
  toggleButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.charcoal,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.disabled,
    textAlign: 'center',
    marginBottom: 24,
  },
});