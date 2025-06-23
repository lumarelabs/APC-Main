export const colors = {
  // Primary Colors
  primary: '#e97d2b',    // Mediterranean orange
  secondary: '#f5ecd7',  // Beige
  charcoal: '#22282f',   // Charcoal
  white: '#ffffff',      // White
  error: '#FF5A5A',      // Red
  warning: '#FFC107',    // Yellow/Warning
  
  // Background Colors
  background: {
    primary: '#f5ecd7',    // Light beige
    secondary: '#ffffff',   // White
    tertiary: '#22282f10', // Semi-transparent charcoal
  },
  
  // Text Colors
  text: {
    primary: '#22282f',    // Charcoal
    secondary: '#e97d2b',  // Orange
    disabled: '#22282f80', // Semi-transparent charcoal
  },
  
  // Status Colors
  status: {
    success: '#4CAF50',    // Green
    error: '#FF5A5A',      // Red
    warning: '#FFC107',    // Yellow
  },
} as const;

// Type for type-safe color access
export type ColorTheme = typeof colors; 