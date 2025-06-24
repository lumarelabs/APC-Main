declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
      EXPO_PUBLIC_API_URL: string;
      PAYTR_MERCHANT_ID: string;
      PAYTR_MERCHANT_KEY: string;
      PAYTR_MERCHANT_SALT: string;
    }
  }
}

// Ensure this file is treated as a module
export {};