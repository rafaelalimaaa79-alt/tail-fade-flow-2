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
      bets: {
        Row: {
          bet_type: string
          created_at: string
          event: string
          id: string
          is_processed: boolean | null
          odds: string
          parsed_email_id: string | null
          result: string | null
          sportsbook_id: string | null
          timestamp: string
          units_risked: number
          units_won_lost: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bet_type: string
          created_at?: string
          event: string
          id?: string
          is_processed?: boolean | null
          odds: string
          parsed_email_id?: string | null
          result?: string | null
          sportsbook_id?: string | null
          timestamp?: string
          units_risked: number
          units_won_lost?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bet_type?: string
          created_at?: string
          event?: string
          id?: string
          is_processed?: boolean | null
          odds?: string
          parsed_email_id?: string | null
          result?: string | null
          sportsbook_id?: string | null
          timestamp?: string
          units_risked?: number
          units_won_lost?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bets_parsed_email_id_fkey"
            columns: ["parsed_email_id"]
            isOneToOne: false
            referencedRelation: "parsed_emails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bets_sportsbook_id_fkey"
            columns: ["sportsbook_id"]
            isOneToOne: false
            referencedRelation: "sportsbooks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_fade"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_tail"
            referencedColumns: ["user_id"]
          },
        ]
      }
      challenge_participants: {
        Row: {
          bets_placed: number | null
          challenge_id: string
          id: string
          is_eliminated: boolean | null
          is_winner: boolean | null
          joined_at: string
          team: string | null
          units_gained: number | null
          user_id: string
        }
        Insert: {
          bets_placed?: number | null
          challenge_id: string
          id?: string
          is_eliminated?: boolean | null
          is_winner?: boolean | null
          joined_at?: string
          team?: string | null
          units_gained?: number | null
          user_id: string
        }
        Update: {
          bets_placed?: number | null
          challenge_id?: string
          id?: string
          is_eliminated?: boolean | null
          is_winner?: boolean | null
          joined_at?: string
          team?: string | null
          units_gained?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          created_at: string
          creator_user_id: string
          duration_days: number
          end_time: string | null
          entry_fee: number
          format: string
          id: string
          min_bets_required: number
          pot_total_cents: number
          rake_cents: number
          start_time: string | null
          status: string
          type: string
        }
        Insert: {
          created_at?: string
          creator_user_id: string
          duration_days: number
          end_time?: string | null
          entry_fee: number
          format: string
          id?: string
          min_bets_required?: number
          pot_total_cents?: number
          rake_cents?: number
          start_time?: string | null
          status?: string
          type: string
        }
        Update: {
          created_at?: string
          creator_user_id?: string
          duration_days?: number
          end_time?: string | null
          entry_fee?: number
          format?: string
          id?: string
          min_bets_required?: number
          pot_total_cents?: number
          rake_cents?: number
          start_time?: string | null
          status?: string
          type?: string
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_fade"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_tail"
            referencedColumns: ["user_id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          item_id: string
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          item_id: string
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          item_id?: string
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_fade"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_tail"
            referencedColumns: ["user_id"]
          },
        ]
      }
      confidence_scores: {
        Row: {
          id: string
          last_calculated: string
          score: number
          sport_specific_score: Json | null
          user_id: string
        }
        Insert: {
          id?: string
          last_calculated?: string
          score?: number
          sport_specific_score?: Json | null
          user_id: string
        }
        Update: {
          id?: string
          last_calculated?: string
          score?: number
          sport_specific_score?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "confidence_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "leaderboard_fade"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "confidence_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "leaderboard_tail"
            referencedColumns: ["user_id"]
          },
        ]
      }
      match_bets: {
        Row: {
          bet_id: string
          created_at: string
          id: string
          match_id: string
          participant_id: string
        }
        Insert: {
          bet_id: string
          created_at?: string
          id?: string
          match_id: string
          participant_id: string
        }
        Update: {
          bet_id?: string
          created_at?: string
          id?: string
          match_id?: string
          participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_bets_bet_id_fkey"
            columns: ["bet_id"]
            isOneToOne: false
            referencedRelation: "bets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_bets_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_bets_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "match_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      match_participants: {
        Row: {
          created_at: string
          id: string
          is_winner: boolean | null
          match_id: string
          payment_id: string | null
          units_gained: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_winner?: boolean | null
          match_id: string
          payment_id?: string | null
          units_gained?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_winner?: boolean | null
          match_id?: string
          payment_id?: string | null
          units_gained?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_participants_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_fade"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "match_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_tail"
            referencedColumns: ["user_id"]
          },
        ]
      }
      matches: {
        Row: {
          buy_in: number
          created_at: string
          created_by: string
          duration_days: number
          end_time: string | null
          id: string
          match_type: string
          start_time: string | null
          status: string
        }
        Insert: {
          buy_in?: number
          created_at?: string
          created_by: string
          duration_days: number
          end_time?: string | null
          id?: string
          match_type: string
          start_time?: string | null
          status?: string
        }
        Update: {
          buy_in?: number
          created_at?: string
          created_by?: string
          duration_days?: number
          end_time?: string | null
          id?: string
          match_type?: string
          start_time?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "leaderboard_fade"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "matches_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "leaderboard_tail"
            referencedColumns: ["user_id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_fade"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_tail"
            referencedColumns: ["user_id"]
          },
        ]
      }
      parsed_emails: {
        Row: {
          email_source: string
          error_message: string | null
          id: string
          parsed_at: string
          parsed_successfully: boolean | null
          raw_content: string
          user_id: string
        }
        Insert: {
          email_source: string
          error_message?: string | null
          id?: string
          parsed_at?: string
          parsed_successfully?: boolean | null
          raw_content: string
          user_id: string
        }
        Update: {
          email_source?: string
          error_message?: string | null
          id?: string
          parsed_at?: string
          parsed_successfully?: boolean | null
          raw_content?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parsed_emails_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_fade"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "parsed_emails_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_tail"
            referencedColumns: ["user_id"]
          },
        ]
      }
      sportsbooks: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      tail_fade_actions: {
        Row: {
          bet_id: string | null
          created_at: string
          id: string
          portfolio_id: string
          result: string | null
          units_result: number | null
          units_risked: number
          updated_at: string
        }
        Insert: {
          bet_id?: string | null
          created_at?: string
          id?: string
          portfolio_id: string
          result?: string | null
          units_result?: number | null
          units_risked: number
          updated_at?: string
        }
        Update: {
          bet_id?: string | null
          created_at?: string
          id?: string
          portfolio_id?: string
          result?: string | null
          units_result?: number | null
          units_risked?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tail_fade_actions_bet_id_fkey"
            columns: ["bet_id"]
            isOneToOne: false
            referencedRelation: "bets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tail_fade_actions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "user_portfolio"
            referencedColumns: ["id"]
          },
        ]
      }
      user_portfolio: {
        Row: {
          active: boolean | null
          bettor_id: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
          variant: string
        }
        Insert: {
          active?: boolean | null
          bettor_id: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          variant: string
        }
        Update: {
          active?: boolean | null
          bettor_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_portfolio_bettor_id_fkey"
            columns: ["bettor_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_fade"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_portfolio_bettor_id_fkey"
            columns: ["bettor_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_tail"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_portfolio_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_fade"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_portfolio_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_tail"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          roi: number | null
          total_bets: number | null
          units_gained: number | null
          updated_at: string
          username: string | null
          win_rate: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id: string
          roi?: number | null
          total_bets?: number | null
          units_gained?: number | null
          updated_at?: string
          username?: string | null
          win_rate?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          roi?: number | null
          total_bets?: number | null
          units_gained?: number | null
          updated_at?: string
          username?: string | null
          win_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "leaderboard_fade"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "leaderboard_tail"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_trend_history: {
        Row: {
          created_at: string
          date: string
          id: string
          units_balance: number
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          units_balance?: number
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          units_balance?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_trend_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_fade"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_trend_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_tail"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_win_milestones: {
        Row: {
          bet_id: string
          created_at: string
          id: string
          milestone_type: string
          units_won: number
          user_id: string
        }
        Insert: {
          bet_id: string
          created_at?: string
          id?: string
          milestone_type: string
          units_won: number
          user_id: string
        }
        Update: {
          bet_id?: string
          created_at?: string
          id?: string
          milestone_type?: string
          units_won?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_win_milestones_bet_id_fkey"
            columns: ["bet_id"]
            isOneToOne: false
            referencedRelation: "bets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_win_milestones_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_fade"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_win_milestones_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_tail"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      leaderboard_fade: {
        Row: {
          losses: number | null
          total_faded: number | null
          units_gained: number | null
          user_id: string | null
          username: string | null
          win_rate: number | null
          wins: number | null
        }
        Relationships: []
      }
      leaderboard_tail: {
        Row: {
          losses: number | null
          total_tailed: number | null
          units_gained: number | null
          user_id: string | null
          username: string | null
          win_rate: number | null
          wins: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_comments_with_likes: {
        Args: { target_item_id: string; requesting_user_id?: string }
        Returns: {
          id: string
          item_id: string
          user_id: string
          username: string
          content: string
          created_at: string
          likes_count: number
          user_has_liked: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
