import os
from datetime import datetime, timedelta, time
import random
from typing import Dict, List
import uuid
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)

# Mock data
COURT_NAMES = [
    "Center Court 1", "Center Court 2",
    "Padel Pro Court", "Padel Elite Court",
    "Pickleball Main", "Pickleball Court A",
    "Padel Master Court", "Pickleball Court B"
]

COURT_TYPES = ["padel", "pickleball"]

COURT_LOCATIONS = [
    "Indoor Arena - Ground Floor",
    "Outdoor Complex - Zone A",
    "Indoor Arena - First Floor",
    "Outdoor Complex - Zone B"
]

COURT_IMAGES = [
    "https://example.com/courts/padel1.jpg",
    "https://example.com/courts/padel2.jpg",
    "https://example.com/courts/pickleball1.jpg",
    "https://example.com/courts/pickleball2.jpg"
]

USER_NAMES = [
    "John Smith", "Emma Wilson", "Michael Brown",
    "Sarah Davis", "James Johnson", "Lisa Anderson",
    "David Miller", "Jennifer Taylor", "Robert Wilson",
    "Maria Garcia"
]

PLAYER_LEVELS = ["Beginner", "Intermediate", "Advanced", "Pro"]

def create_mock_users() -> List[Dict]:
    """Create mock users with profile information."""
    users = []
    for name in USER_NAMES:
        user_data = {
            "id": str(uuid.uuid4()),
            "full_name": name,
            "level": random.choice(PLAYER_LEVELS),
            "profile_image_url": f"https://example.com/profiles/{name.lower().replace(' ', '_')}.jpg",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        users.append(user_data)
    
    return users

def create_mock_courts() -> List[Dict]:
    """Create mock court data."""
    courts = []
    for name in COURT_NAMES:
        court_type = "padel" if "Padel" in name else "pickleball"
        court_data = {
            "id": str(uuid.uuid4()),
            "name": name,
            "type": court_type,
            "price_per_hour": random.randint(30, 80) * 100,  # Price in cents
            "image_url": random.choice(COURT_IMAGES),
            "rating": round(random.uniform(3.5, 5.0), 1),
            "location": random.choice(COURT_LOCATIONS),
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        courts.append(court_data)
    
    return courts

def create_mock_bookings(users: List[Dict], courts: List[Dict]) -> List[Dict]:
    """Create mock booking data."""
    bookings = []
    start_date = datetime.now()
    
    for _ in range(20):  # Create 20 bookings
        booking_date = start_date + timedelta(days=random.randint(0, 14))
        start_hour = random.randint(8, 20)
        
        booking_data = {
            "id": str(uuid.uuid4()),
            "court_id": random.choice(courts)["id"],
            "user_id": random.choice(users)["id"],
            "date": booking_date.date().isoformat(),
            "start_time": time(start_hour, 0).isoformat(),
            "end_time": time(start_hour + 1, 0).isoformat(),
            "status": random.choice(["pending", "confirmed", "canceled"]),
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        bookings.append(booking_data)
    
    return bookings

def create_mock_matches(bookings: List[Dict]) -> tuple[List[Dict], List[Dict]]:
    """Create mock matches and match players data."""
    matches = []
    match_players = []
    
    for booking in bookings:
        if booking["status"] == "confirmed":
            match_data = {
                "id": str(uuid.uuid4()),
                "booking_id": booking["id"],
                "status": random.choice(["pending", "confirmed", "completed"]),
                "result": random.choice([None, "win", "loss"]) if random.random() > 0.5 else None,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            matches.append(match_data)
            
            # Create 2-4 players for each match
            num_players = random.randint(2, 4)
            for _ in range(num_players):
                player_data = {
                    "id": str(uuid.uuid4()),
                    "match_id": match_data["id"],
                    "user_id": random.choice([user["id"] for user in users]),
                    "team": random.choice(["home", "away"]),
                    "created_at": datetime.now().isoformat()
                }
                match_players.append(player_data)
    
    return matches, match_players

def populate_database():
    """Main function to populate the database with mock data."""
    try:
        # Create mock data
        print("Creating mock data...")
        users = create_mock_users()
        courts = create_mock_courts()
        bookings = create_mock_bookings(users, courts)
        matches, match_players = create_mock_matches(bookings)
        
        # Insert data into Supabase
        print("Inserting users...")
        supabase.table("users").insert(users).execute()
        
        print("Inserting courts...")
        supabase.table("courts").insert(courts).execute()
        
        print("Inserting bookings...")
        supabase.table("bookings").insert(bookings).execute()
        
        print("Inserting matches...")
        supabase.table("matches").insert(matches).execute()
        
        print("Inserting match players...")
        supabase.table("match_players").insert(match_players).execute()
        
        print("Database population completed successfully!")
        
    except Exception as e:
        print(f"Error populating database: {str(e)}")

if __name__ == "__main__":
    populate_database() 