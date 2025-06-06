# Court Booking Backend API

A robust Express.js backend API for the court booking application, integrated with Supabase for database operations and authentication.

## Features

- 🔐 JWT Authentication with Supabase
- 🏓 Complete CRUD operations for courts, bookings, and matches
- 🛡️ Row Level Security (RLS) compliance
- ✅ Input validation with Joi
- 🚀 Rate limiting and security middleware
- 📊 Comprehensive error handling
- 🔍 Filtering and querying capabilities

## Quick Start

### Prerequisites

- Node.js 18+ 
- Supabase project with the provided migration applied
- Environment variables configured

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Configure your `.env` file with Supabase credentials:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3000
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Users

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users` - Create user profile

### Courts

- `GET /api/courts` - Get all courts (with optional filtering)
- `GET /api/courts/:id` - Get single court
- `GET /api/courts/:id/availability` - Get court availability

### Bookings

- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking
- `GET /api/bookings/by-court/:courtId` - Get court bookings

### Matches

- `GET /api/matches` - Get user's matches
- `POST /api/matches` - Create new match
- `PUT /api/matches/:id` - Update match
- `POST /api/matches/:matchId/players` - Add player to match
- `DELETE /api/matches/:matchId/players/:userId` - Remove player from match

## Query Parameters

### Courts
- `type` - Filter by court type (padel, pickleball)
- `location` - Filter by location (partial match)
- `min_rating` - Minimum rating filter
- `max_price` - Maximum price filter

### Bookings
- `status` - Filter by status (pending, confirmed, canceled)
- `date_from` - Filter from date (YYYY-MM-DD)
- `date_to` - Filter to date (YYYY-MM-DD)

### Matches
- `status` - Filter by status (pending, confirmed, completed)

## Request/Response Examples

### Create Booking
```bash
POST /api/bookings
Content-Type: application/json
Authorization: Bearer <token>

{
  "court_id": "123e4567-e89b-12d3-a456-426614174000",
  "date": "2024-03-20",
  "start_time": "14:00",
  "end_time": "15:30",
  "status": "pending"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "id": "456e7890-e89b-12d3-a456-426614174000",
    "court_id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "789e0123-e89b-12d3-a456-426614174000",
    "date": "2024-03-20",
    "start_time": "14:00:00",
    "end_time": "15:30:00",
    "status": "pending",
    "created_at": "2024-03-15T10:30:00Z",
    "courts": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Padel Court 1",
      "type": "padel",
      "price_per_hour": 35
    }
  },
  "message": "Booking created successfully"
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., booking time conflict)
- `500` - Internal Server Error

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Joi schema validation
- **Authentication**: JWT token verification with Supabase
- **Authorization**: RLS policy compliance

## Development

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

### Project Structure

```
backend/
├── config/
│   └── supabase.js          # Supabase client configuration
├── controllers/             # Business logic
│   ├── users.js
│   ├── courts.js
│   ├── bookings.js
│   └── matches.js
├── middleware/              # Custom middleware
│   ├── auth.js             # Authentication middleware
│   ├── validation.js       # Input validation
│   └── errorHandler.js     # Error handling
├── routes/                  # API routes
│   ├── users.js
│   ├── courts.js
│   ├── bookings.js
│   └── matches.js
├── server.js               # Main application file
├── package.json
└── README.md
```

## Health Check

Check if the API is running:
```bash
GET /health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-03-15T10:30:00.000Z",
  "uptime": 3600
}
```

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation for new endpoints
4. Respect RLS policies
5. Add appropriate tests

## License

MIT License