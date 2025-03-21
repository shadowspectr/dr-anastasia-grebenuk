export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_time: string
          client_name: string
          created_at: string
          id: string
          service_id: string | null
        }
        Insert: {
          appointment_time: string
          client_name: string
          created_at?: string
          id?: string
          service_id?: string | null
        }
        Update: {
          appointment_time?: string
          client_name?: string
          created_at?: string
          id?: string
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          address: string
          created_at: string
          email: string
          id: string
          instagram: string
          phone: string
        }
        Insert: {
          address: string
          created_at?: string
          email: string
          id?: string
          instagram: string
          phone: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string
          id?: string
          instagram?: string
          phone?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          description: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          title?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      education_photos: {
        Row: {
          created_at: string
          education_id: string | null
          id: string
          photo_url: string
        }
        Insert: {
          created_at?: string
          education_id?: string | null
          id?: string
          photo_url: string
        }
        Update: {
          created_at?: string
          education_id?: string | null
          id?: string
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_photos_education_id_fkey"
            columns: ["education_id"]
            isOneToOne: false
            referencedRelation: "education"
            referencedColumns: ["id"]
          },
        ]
      }
      footer_links: {
        Row: {
          created_at: string
          id: string
          instagram: string
          telegram: string
          whatsapp: string
        }
        Insert: {
          created_at?: string
          id?: string
          instagram?: string
          telegram?: string
          whatsapp?: string
        }
        Update: {
          created_at?: string
          id?: string
          instagram?: string
          telegram?: string
          whatsapp?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          created_at: string
          description: string
          id: string
          image: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image?: string
          title?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category_id: string | null
          created_at: string
          description: string
          icon: string
          id: string
          price: string
          title: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description: string
          icon: string
          id?: string
          price: string
          title: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string
          icon?: string
          id?: string
          price?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
