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
      addresses: {
        Row: {
          city: string
          created_at: string
          details: string | null
          district: string | null
          full_name: string
          id: string
          label: string
          lat: number | null
          lng: number | null
          map_url: string | null
          phone: string
          street: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string
          created_at?: string
          details?: string | null
          district?: string | null
          full_name?: string
          id?: string
          label?: string
          lat?: number | null
          lng?: number | null
          map_url?: string | null
          phone?: string
          street?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string
          details?: string | null
          district?: string | null
          full_name?: string
          id?: string
          label?: string
          lat?: number | null
          lng?: number | null
          map_url?: string | null
          phone?: string
          street?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name_ar: string
          name_en: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id: string
          name_ar: string
          name_en: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name_ar?: string
          name_en?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          series_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          series_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          series_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      nav_links: {
        Row: {
          active: boolean
          created_at: string
          id: string
          label_ar: string
          label_en: string
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          label_ar: string
          label_en: string
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          label_ar?: string
          label_en?: string
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          active: boolean
          badge_ar: string | null
          badge_en: string | null
          created_at: string
          cta_url: string | null
          description_ar: string
          description_en: string
          discount_pct: number | null
          expires_at: string | null
          gradient: string
          id: string
          series_id: string | null
          sort_order: number
          title_ar: string
          title_en: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          badge_ar?: string | null
          badge_en?: string | null
          created_at?: string
          cta_url?: string | null
          description_ar?: string
          description_en?: string
          discount_pct?: number | null
          expires_at?: string | null
          gradient?: string
          id?: string
          series_id?: string | null
          sort_order?: number
          title_ar: string
          title_en: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          badge_ar?: string | null
          badge_en?: string | null
          created_at?: string
          cta_url?: string | null
          description_ar?: string
          description_en?: string
          discount_pct?: number | null
          expires_at?: string | null
          gradient?: string
          id?: string
          series_id?: string | null
          sort_order?: number
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: Json | null
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          items: Json
          payment_method: Database["public"]["Enums"]["payment_method"]
          receipt_name: string | null
          status: Database["public"]["Enums"]["order_status"]
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: Json | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          items?: Json
          payment_method?: Database["public"]["Enums"]["payment_method"]
          receipt_name?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: Json | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          items?: Json
          payment_method?: Database["public"]["Enums"]["payment_method"]
          receipt_name?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          id: string
          rating: number
          series_id: string
          updated_at: string
          user_id: string
          user_name: string
        }
        Insert: {
          comment?: string
          created_at?: string
          id?: string
          rating: number
          series_id: string
          updated_at?: string
          user_id: string
          user_name?: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          rating?: number
          series_id?: string
          updated_at?: string
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      series: {
        Row: {
          background_image: string | null
          category: string
          created_at: string
          description_ar: string
          description_en: string
          episodes: number
          featured: boolean
          genres: Json
          id: string
          imdb: number
          is_new: boolean
          poster_color: string
          poster_image: string | null
          price: number
          related_ids: Json
          seasons: number
          slug: string
          source: string
          title_ar: string
          title_en: string
          top_watched: boolean
          trailer_url: string
          trending: boolean
          updated_at: string
          year: number
        }
        Insert: {
          background_image?: string | null
          category: string
          created_at?: string
          description_ar?: string
          description_en?: string
          episodes?: number
          featured?: boolean
          genres?: Json
          id: string
          imdb?: number
          is_new?: boolean
          poster_color?: string
          poster_image?: string | null
          price?: number
          related_ids?: Json
          seasons?: number
          slug: string
          source?: string
          title_ar: string
          title_en: string
          top_watched?: boolean
          trailer_url?: string
          trending?: boolean
          updated_at?: string
          year?: number
        }
        Update: {
          background_image?: string | null
          category?: string
          created_at?: string
          description_ar?: string
          description_en?: string
          episodes?: number
          featured?: boolean
          genres?: Json
          id?: string
          imdb?: number
          is_new?: boolean
          poster_color?: string
          poster_image?: string | null
          price?: number
          related_ids?: Json
          seasons?: number
          slug?: string
          source?: string
          title_ar?: string
          title_en?: string
          top_watched?: boolean
          trailer_url?: string
          trending?: boolean
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      series_requests: {
        Row: {
          created_at: string
          details: string
          id: string
          status: Database["public"]["Enums"]["request_status"]
          title: string
          updated_at: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: string
          id?: string
          status?: Database["public"]["Enums"]["request_status"]
          title: string
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: string
          id?: string
          status?: Database["public"]["Enums"]["request_status"]
          title?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: number
          logo_text: string
          logo_url: string | null
          popup_active: boolean
          popup_text_ar: string | null
          popup_text_en: string | null
          popup_title_ar: string | null
          popup_title_en: string | null
          theme_mode: string
          theme_preset: string
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          id?: number
          logo_text?: string
          logo_url?: string | null
          popup_active?: boolean
          popup_text_ar?: string | null
          popup_text_en?: string | null
          popup_title_ar?: string | null
          popup_title_en?: string | null
          theme_mode?: string
          theme_preset?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          id?: number
          logo_text?: string
          logo_url?: string | null
          popup_active?: boolean
          popup_text_ar?: string | null
          popup_text_en?: string | null
          popup_title_ar?: string | null
          popup_title_en?: string | null
          theme_mode?: string
          theme_preset?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      slides: {
        Row: {
          active: boolean
          created_at: string
          cta_url: string | null
          gradient: string
          id: string
          image: string | null
          series_id: string | null
          sort_order: number
          subtitle_ar: string
          subtitle_en: string
          title_ar: string
          title_en: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          cta_url?: string | null
          gradient?: string
          id?: string
          image?: string | null
          series_id?: string | null
          sort_order?: number
          subtitle_ar?: string
          subtitle_en?: string
          title_ar: string
          title_en: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          cta_url?: string | null
          gradient?: string
          id?: string
          image?: string | null
          series_id?: string | null
          sort_order?: number
          subtitle_ar?: string
          subtitle_en?: string
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "slides_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          active: boolean
          created_at: string
          icon: string | null
          id: string
          name: string
          number: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          number?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          number?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      order_status: "pending" | "delivered" | "rejected"
      payment_method: "wallet_transfer" | "cod" | "wallet"
      request_status: "open" | "approved" | "rejected"
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
    Enums: {
      app_role: ["admin", "user"],
      order_status: ["pending", "delivered", "rejected"],
      payment_method: ["wallet_transfer", "cod", "wallet"],
      request_status: ["open", "approved", "rejected"],
    },
  },
} as const
