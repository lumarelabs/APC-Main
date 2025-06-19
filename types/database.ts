export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string | null
          level: string | null
          profile_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          level?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          level?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      courts: {
        Row: {
          id: string
          name: string
          type: 'padel' | 'pickleball'
          price_per_hour: number
          image_url: string | null
          rating: number | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'padel' | 'pickleball'
          price_per_hour: number
          image_url?: string | null
          rating?: number | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'padel' | 'pickleball'
          price_per_hour?: number
          image_url?: string | null
          rating?: number | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          court_id: string
          user_id: string
          date: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'canceled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          court_id: string
          user_id: string
          date: string
          start_time: string
          end_time: string
          status?: 'pending' | 'confirmed' | 'canceled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          court_id?: string
          user_id?: string
          date?: string
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'canceled'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      matches: {
        Row: {
          id: string
          booking_id: string
          status: 'pending' | 'confirmed' | 'completed'
          result: 'win' | 'loss' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          status?: 'pending' | 'confirmed' | 'completed'
          result?: 'win' | 'loss' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          status?: 'pending' | 'confirmed' | 'completed'
          result?: 'win' | 'loss' | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          }
        ]
      }
      match_players: {
        Row: {
          id: string
          match_id: string
          user_id: string
          team: 'home' | 'away'
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          user_id: string
          team: 'home' | 'away'
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          user_id?: string
          team?: 'home' | 'away'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_players_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_players_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}