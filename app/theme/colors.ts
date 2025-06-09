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
    primary: '#f5ecd7',
    secondary: '#ffffff',
  },
  
  // Text Colors
  text: {
    primary: '#22282f',
    secondary: '#e97d2b',
    disabled: '#b3b3b3', // Gri
  },
  
  // Status Colors
  status: {
    success: '#e97d2b',
    error:   '#d22b2b',
    warning: '#e9bd2b',
  },
} as const;

// Type for type-safe color access
export type ColorTheme = typeof colors; 