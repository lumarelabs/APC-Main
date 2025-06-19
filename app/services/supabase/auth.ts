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
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting initial session:', error.message);
        this.updateState({ user: null, loading: false, error: error.message });
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
      this.updateState({ user: null, loading: false, error: 'Failed to initialize authentication' });
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
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email,
            level: 'Başlangıç',
            role: 'user',
            profile_image_url: user.user_metadata?.avatar_url || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          });

        if (insertError) {
          console.error('Error creating user profile:', insertError.message);
        } else {
          console.log('✅ User profile created successfully');
        }
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

  async signIn(email: string, password: string): Promise<void> {
    try {
      this.updateState({ loading: true, error: null });
      await signInWithEmail(email, password);
    } catch (error: any) {
      this.updateState({ 
        loading: false, 
        error: error.message || 'Failed to sign in' 
      });
      throw error;
    }
  }

  async signUp(email: string, password: string, fullName?: string): Promise<void> {
    try {
      this.updateState({ loading: true, error: null });
      await signUpWithEmail(email, password, fullName);
    } catch (error: any) {
      this.updateState({ 
        loading: false, 
        error: error.message || 'Failed to sign up' 
      });
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      this.updateState({ loading: true, error: null });
      await signOut();
    } catch (error: any) {
      this.updateState({ 
        loading: false, 
        error: error.message || 'Failed to sign out' 
      });
      throw error;
    }
  }

  async updateProfile(updates: { full_name?: string; level?: string; profile_image_url?: string }): Promise<void> {
    try {
      if (!this.currentState.user) {
        throw new Error('No authenticated user');
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
      throw error;
    }
  }
}

export const authService = AuthService.getInstance();