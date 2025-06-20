import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import type { Database } from '@/types/database';

// Get environment variables with proper fallbacks
const getEnvVar = (key: string): string => {
  // Try multiple sources for environment variables
  const sources = [
    Constants.expoConfig?.extra?.env?.[key],
    Constants.manifest?.extra?.[key],
    process.env[key],
    // @ts-ignore - for web compatibility
    typeof window !== 'undefined' ? window.ENV?.[key] : undefined
  ];
  
  return sources.find(value => value && typeof value === 'string') || '';
};

const supabaseUrl = getEnvVar('EXPO_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('EXPO_PUBLIC_SUPABASE_ANON_KEY');

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required variables:');
  console.error('- EXPO_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('- EXPO_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌');
  console.error('Please check your .env file and app.json configuration');
}

// Create Supabase client with proper TypeScript typing
export const supabase = createClient<Database>(
  supabaseUrl || 'https://ntdjhvcdtzqiephcfdur.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    },
    global: {
      headers: {
        'X-Client-Info': 'expo-app'
      }
    }
  }
);

// Auth helper functions with proper error handling
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error.message);
      throw error;
    }
    return user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Sign in error:', error.message);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in signInWithEmail:', error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
  try {
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
      console.error('Sign up error:', error.message);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in signUpWithEmail:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error.message);
      throw error;
    }
  } catch (error) {
    console.error('Error in signOut:', error);
    throw error;
  }
};

// Test connection helper
export const testSupabaseConnection = async () => {
  try {
    console.log('🔄 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('courts')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test error:', error);
    return false;
  }
};

// Initialize connection test on app start
if (__DEV__) {
  testSupabaseConnection();
}