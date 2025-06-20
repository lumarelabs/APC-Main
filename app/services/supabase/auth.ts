import { supabase, getCurrentUser, signInWithEmail, signUpWithEmail, signOut } from './config';
import type { User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export class AuthService {
  private static instance: AuthService;
  private listeners: ((state: AuthState) => void)[] = [];
  private currentState: AuthState = {
    user: null,
    loading: true,
    error: null
  };

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // Clear any previous errors
      this.updateState({ error: null });

      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting initial session:', error.message);
        this.updateState({ user: null, loading: false, error: null }); // Don't show session errors to user
        return;
      }

      this.updateState({ 
        user: session?.user || null, 
        loading: false, 
        error: null 
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        this.updateState({
          user: session?.user || null,
          loading: false,
          error: null
        });

        // Handle user profile creation/update
        if (event === 'SIGNED_IN' && session?.user) {
          await this.ensureUserProfile(session.user);
        }
      });

    } catch (error) {
      console.error('Error initializing auth:', error);
      this.updateState({ user: null, loading: false, error: null }); // Don't show initialization errors
    }
  }

  private async ensureUserProfile(user: User) {
    try {
      // Check if user profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user profile:', fetchError.message);
        return;
      }

      // Create profile if it doesn't exist
      if (!existingProfile) {
        const profileData = {
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email,
          level: 'Başlangıç',
          role: 'user',
          profile_image_url: user.user_metadata?.avatar_url || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        };

        const { error: insertError } = await supabase
          .from('users')
          .insert(profileData);

        if (insertError) {
          console.error('Error creating user profile:', insertError.message);
          
          // If it's a duplicate key error, try to update instead
          if (insertError.code === '23505') {
            const { error: updateError } = await supabase
              .from('users')
              .update(profileData)
              .eq('id', user.id);
              
            if (updateError) {
              console.error('Error updating user profile:', updateError.message);
            } else {
              console.log('✅ User profile updated successfully');
            }
          }
        } else {
          console.log('✅ User profile created successfully');
        }
      } else {
        console.log('✅ User profile already exists');
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
    }
  }

  private updateState(newState: Partial<AuthState>) {
    this.currentState = { ...this.currentState, ...newState };
    this.listeners.forEach(listener => listener(this.currentState));
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    // Immediately call with current state
    listener(this.currentState);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState(): AuthState {
    return this.currentState;
  }

  // Clear any persistent errors
  clearError(): void {
    this.updateState({ error: null });
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      this.updateState({ loading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        let errorMessage = 'Giriş yapılamadı';
        
        // Handle specific error cases
        if (error.message?.includes('Invalid login credentials')) {
          errorMessage = 'E-posta veya şifre hatalı';
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = 'E-posta adresinizi doğrulamanız gerekiyor';
        } else if (error.message?.includes('Too many requests')) {
          errorMessage = 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin';
        }

        this.updateState({ 
          loading: false, 
          error: errorMessage
        });
        throw new Error(errorMessage);
      }

      // Success state will be handled by onAuthStateChange
    } catch (error: any) {
      if (!error.message?.startsWith('E-posta') && 
          !error.message?.startsWith('Çok fazla')) {
        this.updateState({ 
          loading: false, 
          error: 'Giriş yapılamadı. Lütfen tekrar deneyin.'
        });
        throw new Error('Giriş yapılamadı. Lütfen tekrar deneyin.');
      }
      throw error;
    }
  }

  async signUp(email: string, password: string, fullName?: string): Promise<void> {
    try {
      this.updateState({ loading: true, error: null });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        let errorMessage = 'Hesap oluşturulamadı';
        
        // Handle specific error cases
        if (error.message?.includes('User already registered')) {
          errorMessage = 'Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.';
        } else if (error.message?.includes('Password should be at least')) {
          errorMessage = 'Şifre en az 6 karakter olmalıdır';
        } else if (error.message?.includes('Invalid email')) {
          errorMessage = 'Geçerli bir e-posta adresi girin';
        } else if (error.message?.includes('Signup is disabled')) {
          errorMessage = 'Yeni kayıt şu anda devre dışı';
        }

        this.updateState({ 
          loading: false, 
          error: errorMessage
        });
        throw new Error(errorMessage);
      }

      // If user is immediately confirmed (no email verification required)
      if (data.user && !data.session) {
        this.updateState({ 
          loading: false, 
          error: null
        });
        // Don't throw error, just show success message
        return;
      }

      this.updateState({ 
        loading: false, 
        error: null
      });

    } catch (error: any) {
      if (!error.message?.startsWith('Bu e-posta') && 
          !error.message?.startsWith('Şifre en az') && 
          !error.message?.startsWith('Geçerli bir') &&
          !error.message?.startsWith('Yeni kayıt')) {
        this.updateState({ 
          loading: false, 
          error: 'Hesap oluşturulamadı. Lütfen tekrar deneyin.'
        });
        throw new Error('Hesap oluşturulamadı. Lütfen tekrar deneyin.');
      }
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      this.updateState({ loading: true, error: null });
      await signOut();
      // Success state will be handled by onAuthStateChange
    } catch (error: any) {
      this.updateState({ 
        loading: false, 
        error: 'Çıkış yapılamadı. Lütfen tekrar deneyin.'
      });
      throw error;
    }
  }

  async updateProfile(updates: { full_name?: string; level?: string; profile_image_url?: string }): Promise<void> {
    try {
      if (!this.currentState.user) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', this.currentState.user.id);

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw new Error('Profil güncellenemedi');
    }
  }
}

export const authService = AuthService.getInstance();