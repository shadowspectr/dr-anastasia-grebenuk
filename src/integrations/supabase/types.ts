export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      about_info: {
        Row: {
          achievements: string[] | null
          bio: string | null
          created_at: string
          credentials: string[] | null
          id: string
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          achievements?: string[] | null
          bio?: string | null
          created_at?: string
          credentials?: string[] | null
          id?: string
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          achievements?: string[] | null
          bio?: string | null
          created_at?: string
          credentials?: string[] | null
          id?: string
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          course_id: string | null
          created_at: string
          id: string
          message: string | null
          name: string
          phone: string
          status: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          id?: string
          message?: string | null
          name: string
          phone: string
          status?: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_info: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          key: string
          sort_order: number
          value: string | null
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          key: string
          sort_order?: number
          value?: string | null
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          key?: string
          sort_order?: number
          value?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          badge: string | null
          created_at: string
          description: string | null
          duration: string | null
          features: string[] | null
          format: string
          id: string
          is_active: boolean
          level: string
          old_price: number | null
          price: number | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          badge?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          features?: string[] | null
          format?: string
          id?: string
          is_active?: boolean
          level?: string
          old_price?: number | null
          price?: number | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          badge?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          features?: string[] | null
          format?: string
          id?: string
          is_active?: boolean
          level?: string
          old_price?: number | null
          price?: number | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      faq: {
        Row: {
          answer: string
          created_at: string
          id: string
          question: string
          sort_order: number
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question: string
          sort_order?: number
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question?: string
          sort_order?: number
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          id: string
          is_visible: boolean
          name: string
          photo_url: string | null
          rating: number | null
          sort_order: number
          specialization: string | null
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_visible?: boolean
          name: string
          photo_url?: string | null
          rating?: number | null
          sort_order?: number
          specialization?: string | null
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          is_visible?: boolean
          name?: string
          photo_url?: string | null
          rating?: number | null
          sort_order?: number
          specialization?: string | null
          text?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      social_proof: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          label: string
          sort_order: number
          value: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          label: string
          sort_order?: number
          value: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          label?: string
          sort_order?: number
          value?: string
        }
        Relationships: []
      }
      student_works: {
        Row: {
          after_photo_url: string | null
          before_photo_url: string | null
          course_title: string | null
          created_at: string
          description: string | null
          id: string
          is_visible: boolean
          sort_order: number
          student_name: string | null
        }
        Insert: {
          after_photo_url?: string | null
          before_photo_url?: string | null
          course_title?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_visible?: boolean
          sort_order?: number
          student_name?: string | null
        }
        Update: {
          after_photo_url?: string | null
          before_photo_url?: string | null
          course_title?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_visible?: boolean
          sort_order?: number
          student_name?: string | null
        }
        Relationships: []
      }
      training_steps: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
