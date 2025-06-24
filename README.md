# Alaçatı Padel Club Mobile App

A comprehensive mobile application for court booking, lesson scheduling, and payment processing built with React Native Expo.

## 🚀 Features

### 🏟️ Court Booking System
- Real-time court availability checking
- Dynamic pricing with night rates (after 20:30)
- Conflict prevention with database constraints
- Racket rental integration

### 💳 Payment Integration
- Secure PayTR payment gateway integration
- Real-time payment processing
- Order tracking and verification
- Mobile-optimized payment experience

### 🔔 Notification System
- Booking reminders (1 hour before)
- Status update notifications
- Push notification support
- Cross-platform compatibility

### 👤 User Management
- Supabase authentication with Google OAuth
- User profiles with skill levels
- Secure session management

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo SDK 52
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Payment**: PayTR Gateway
- **Navigation**: Expo Router
- **Notifications**: Expo Notifications
- **Styling**: StyleSheet with custom design system

## 📱 Platform Support

- ✅ **iOS** (Expo Go + Custom Dev Client)
- ✅ **Android** (Expo Go + Custom Dev Client)
- ✅ **Web** (Progressive Web App)

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env` file in your project root:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# PayTR Configuration
PAYTR_MERCHANT_ID=your_merchant_id
PAYTR_MERCHANT_KEY=your_merchant_key
PAYTR_MERCHANT_SALT=your_merchant_salt

# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:8081
```

### EXPO_PUBLIC_API_URL Configuration

The `EXPO_PUBLIC_API_URL` environment variable is crucial for payment processing and API communication:

#### Development
```env
EXPO_PUBLIC_API_URL=http://localhost:8081
```

#### Production
```env
EXPO_PUBLIC_API_URL=https://your-production-domain.com
```

#### Expo Go (Mobile Testing)
```env
EXPO_PUBLIC_API_URL=https://your-tunnel-url.ngrok.io
```

**Important Notes:**
- For local development, use your machine's IP address if testing on physical devices
- For production, ensure HTTPS is enabled
- PayTR requires accessible callback URLs for payment verification

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase
1. Create a new Supabase project
2. Run the provided SQL migrations in `/supabase/migrations/`
3. Update environment variables with your Supabase credentials

### 3. Configure PayTR
1. Sign up for PayTR merchant account
2. Get your merchant credentials (ID, Key, Salt)
3. Update environment variables

### 4. Start Development Server
```bash
npm run dev
```

## 📊 Database Schema

### Core Tables
- **users**: User profiles and authentication data
- **courts**: Court information and pricing
- **bookings**: Reservation data with conflict prevention
- **lessons**: Lesson types and instructor information

### Key Features
- Row Level Security (RLS) enabled on all tables
- Real-time subscriptions for live updates
- Automatic conflict detection for double bookings
- Dynamic pricing based on time slots

## 🔔 Notification System

### Features
- **Booking Reminders**: Sent 1 hour before reservation
- **Status Updates**: Confirmation/cancellation notifications
- **Cross-platform**: Works on iOS, Android, and Web
- **Push Tokens**: Stored in user profiles for server-side notifications

### Implementation
```typescript
import { notificationService } from '@/app/services/notifications/NotificationService';

// Schedule a reminder
await notificationService.scheduleBookingReminder(
  bookingId,
  date,
  startTime,
  courtName
);

// Send status update
await notificationService.sendBookingStatusNotification(
  bookingId,
  'confirmed',
  courtName
);
```

## 💳 Payment Processing

### PayTR Integration
- Secure token generation with HMAC-SHA256
- Mobile-optimized payment interface
- Real-time payment verification
- Automatic booking confirmation

### Payment Flow
1. User completes booking details
2. Payment token generated server-side
3. PayTR payment modal opens
4. User completes payment securely
5. Webhook confirms payment
6. Booking status updated automatically

## 🎨 Design System

### Color Palette
- **Primary**: `#e97d2b` (Mediterranean Orange)
- **Secondary**: `#f5ecd7` (Beige)
- **Charcoal**: `#22282f`
- **Success**: `#4CAF50`
- **Warning**: `#FFC107`
- **Error**: `#FF5A5A`

### Typography
- **Font Family**: Inter (Regular, Medium, Bold)
- **Responsive**: Scales across all screen sizes
- **Accessibility**: High contrast ratios maintained

## 🔒 Security Features

### Authentication
- Supabase Auth with email/password
- Google OAuth integration
- Secure session management
- Row Level Security (RLS)

### Payment Security
- No card data storage
- PayTR PCI compliance
- HMAC signature verification
- SSL/TLS encryption

### Data Protection
- Database-level access controls
- API route protection
- Input validation and sanitization
- Error handling without data exposure

## 📱 Mobile Optimization

### Performance
- Lazy loading for large lists
- Image optimization with Pexels CDN
- Efficient state management
- Minimal re-renders

### User Experience
- Native-feeling animations
- Haptic feedback (iOS/Android)
- Offline-first approach for cached data
- Progressive Web App capabilities

## 🧪 Testing

### Development Testing
```bash
# Start Expo development server
npm run dev

# Test on iOS Simulator
i

# Test on Android Emulator
a

# Test on Web
w
```

### Production Testing
```bash
# Build for production
npm run build:web

# Test payment flows with PayTR test mode
# (Set test_mode: '1' in payment configuration)
```

## 🚀 Deployment

### Web Deployment
```bash
npm run build:web
# Deploy the dist/ folder to your hosting provider
```

### Mobile App Store Deployment
1. Create Expo development build
2. Test thoroughly on physical devices
3. Submit to App Store/Google Play
4. Configure production environment variables

## 📞 Support

For technical support or questions:
- **Email**: alacatipadelclub@gmail.com
- **Phone**: +90 535 306 2892
- **Instagram**: @alacatipadelclub

## 📄 License

This project is proprietary software for Alaçatı Padel Club.

---

Built with ❤️ using React Native Expo and Supabase