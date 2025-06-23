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
          role: string | null
          full_name: string | null
          email: string | null
          level: string | null
          profile_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: string | null
          full_name?: string | null
          email?: string | null
          level?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: string | null
          full_name?: string | null
          email?: string | null
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
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          id: string
          title: string
          type: 'private' | 'group'
          description: string | null
          price: number
          duration_weeks: number | null
          sessions_per_week: number | null
          max_participants: number | null
          instructor_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          type: 'private' | 'group'
          description?: string | null
          price: number
          duration_weeks?: number | null
          sessions_per_week?: number | null
          max_participants?: number | null
          instructor_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          type?: 'private' | 'group'
          description?: string | null
          price?: number
          duration_weeks?: number | null
          sessions_per_week?: number | null
          max_participants?: number | null
          instructor_name?: string | null
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
          type: string | null
          lesson_id: string | null
          includes_racket: boolean | null
          includes_lighting: boolean | null
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
          type?: string | null
          lesson_id?: string | null
          includes_racket?: boolean | null
          includes_lighting?: boolean | null
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
          type?: string | null
          lesson_id?: string | null
          includes_racket?: boolean | null
          includes_lighting?: boolean | null
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
          },
          {
            foreignKeyName: "bookings_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          amount: number
          status: string
          payment_method: string
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          amount: number
          status: string
          payment_method: string
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          amount?: number
          status?: string
          payment_method?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
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