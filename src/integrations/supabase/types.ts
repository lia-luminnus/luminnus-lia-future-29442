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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "admin_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_conversations: {
        Row: {
          created_at: string
          id: string
          message_count: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_count?: number
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message_count?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      agendamentos: {
        Row: {
          created_at: string
          data: string
          descricao: string | null
          hora: string
          id: string
          status: string | null
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data: string
          descricao?: string | null
          hora: string
          id?: string
          status?: string | null
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: string
          descricao?: string | null
          hora?: string
          id?: string
          status?: string | null
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_configs: {
        Row: {
          annual_price: string | null
          created_at: string
          custom_cta_action: string | null
          custom_cta_text: string | null
          description: string | null
          discount_percentage: number | null
          features: string[] | null
          gradient_end: string | null
          gradient_start: string | null
          id: string
          is_popular: boolean | null
          lia_quote: string | null
          max_channels: string | null
          max_conversations: string | null
          max_messages: string | null
          plan_name: string
          price: string | null
          updated_at: string
        }
        Insert: {
          annual_price?: string | null
          created_at?: string
          custom_cta_action?: string | null
          custom_cta_text?: string | null
          description?: string | null
          discount_percentage?: number | null
          features?: string[] | null
          gradient_end?: string | null
          gradient_start?: string | null
          id?: string
          is_popular?: boolean | null
          lia_quote?: string | null
          max_channels?: string | null
          max_conversations?: string | null
          max_messages?: string | null
          plan_name: string
          price?: string | null
          updated_at?: string
        }
        Update: {
          annual_price?: string | null
          created_at?: string
          custom_cta_action?: string | null
          custom_cta_text?: string | null
          description?: string | null
          discount_percentage?: number | null
          features?: string[] | null
          gradient_end?: string | null
          gradient_start?: string | null
          id?: string
          is_popular?: boolean | null
          lia_quote?: string | null
          max_channels?: string | null
          max_conversations?: string | null
          max_messages?: string | null
          plan_name?: string
          price?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      planos: {
        Row: {
          created_at: string
          data_fim: string | null
          data_inicio: string
          id: string
          plano_nome: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          id?: string
          plano_nome: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          id?: string
          plano_nome?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          full_name: string | null
          id: string
          plan_type: string | null
          updated_at: string | null
          whatsapp_connected_at: string | null
          whatsapp_numero: string | null
          whatsapp_qr_code: string | null
          whatsapp_status: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          plan_type?: string | null
          updated_at?: string | null
          whatsapp_connected_at?: string | null
          whatsapp_numero?: string | null
          whatsapp_qr_code?: string | null
          whatsapp_status?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          plan_type?: string | null
          updated_at?: string | null
          whatsapp_connected_at?: string | null
          whatsapp_numero?: string | null
          whatsapp_qr_code?: string | null
          whatsapp_status?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          section_key: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          section_key: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          section_key?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      site_content_versions: {
        Row: {
          content: Json
          content_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          version_number: number
        }
        Insert: {
          content: Json
          content_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          version_number: number
        }
        Update: {
          content?: Json
          content_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "site_content_versions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "site_content"
            referencedColumns: ["id"]
          },
        ]
      }
      site_theme: {
        Row: {
          colors: Json
          created_at: string | null
          fonts: Json
          id: string
          is_active: boolean | null
          spacing: Json
          theme_name: string
          updated_at: string | null
        }
        Insert: {
          colors: Json
          created_at?: string | null
          fonts: Json
          id?: string
          is_active?: boolean | null
          spacing: Json
          theme_name: string
          updated_at?: string | null
        }
        Update: {
          colors?: Json
          created_at?: string | null
          fonts?: Json
          id?: string
          is_active?: boolean | null
          spacing?: Json
          theme_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      usage_limits: {
        Row: {
          agendamentos_count: number
          conversas_count: number
          created_at: string
          id: string
          mensagens_count: number
          periodo_mes: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agendamentos_count?: number
          conversas_count?: number
          created_at?: string
          id?: string
          mensagens_count?: number
          periodo_mes?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agendamentos_count?: number
          conversas_count?: number
          created_at?: string
          id?: string
          mensagens_count?: number
          periodo_mes?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          created_at: string
          direction: string
          id: string
          message_content: string
          phone_number: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          direction: string
          id?: string
          message_content: string
          phone_number: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          direction?: string
          id?: string
          message_content?: string
          phone_number?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      metrics_openai: {
        Row: {
          id: string
          empresa_id: string | null
          usuario_id: string | null
          timestamp: string
          detalhes: Json | null
          custo: number
          input_tokens: number
          output_tokens: number
          modelo: string
          origem: string | null
          erro: string | null
          created_at: string
        }
        Insert: {
          id?: string
          empresa_id?: string | null
          usuario_id?: string | null
          timestamp?: string
          detalhes?: Json | null
          custo?: number
          input_tokens?: number
          output_tokens?: number
          modelo?: string
          origem?: string | null
          erro?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          empresa_id?: string | null
          usuario_id?: string | null
          timestamp?: string
          detalhes?: Json | null
          custo?: number
          input_tokens?: number
          output_tokens?: number
          modelo?: string
          origem?: string | null
          erro?: string | null
          created_at?: string
        }
        Relationships: []
      }
      metrics_cartesia: {
        Row: {
          id: string
          empresa_id: string | null
          usuario_id: string | null
          timestamp: string
          detalhes: Json | null
          custo: number
          caracteres: number
          duracao_segundos: number
          voz_id: string | null
          origem: string | null
          erro: string | null
          created_at: string
        }
        Insert: {
          id?: string
          empresa_id?: string | null
          usuario_id?: string | null
          timestamp?: string
          detalhes?: Json | null
          custo?: number
          caracteres?: number
          duracao_segundos?: number
          voz_id?: string | null
          origem?: string | null
          erro?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          empresa_id?: string | null
          usuario_id?: string | null
          timestamp?: string
          detalhes?: Json | null
          custo?: number
          caracteres?: number
          duracao_segundos?: number
          voz_id?: string | null
          origem?: string | null
          erro?: string | null
          created_at?: string
        }
        Relationships: []
      }
      metrics_render: {
        Row: {
          id: string
          empresa_id: string | null
          timestamp: string
          detalhes: Json | null
          servico: string
          status: string
          cpu_percent: number | null
          memoria_percent: number | null
          memoria_mb: number | null
          uptime_seconds: number | null
          requests_count: number | null
          erro: string | null
          created_at: string
        }
        Insert: {
          id?: string
          empresa_id?: string | null
          timestamp?: string
          detalhes?: Json | null
          servico?: string
          status?: string
          cpu_percent?: number | null
          memoria_percent?: number | null
          memoria_mb?: number | null
          uptime_seconds?: number | null
          requests_count?: number | null
          erro?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          empresa_id?: string | null
          timestamp?: string
          detalhes?: Json | null
          servico?: string
          status?: string
          cpu_percent?: number | null
          memoria_percent?: number | null
          memoria_mb?: number | null
          uptime_seconds?: number | null
          requests_count?: number | null
          erro?: string | null
          created_at?: string
        }
        Relationships: []
      }
      metrics_cloudflare: {
        Row: {
          id: string
          empresa_id: string | null
          timestamp: string
          detalhes: Json | null
          custo: number
          requests_count: number
          worker_name: string | null
          cpu_time_ms: number | null
          bandwidth_bytes: number | null
          erros_count: number | null
          origem: string | null
          erro: string | null
          created_at: string
        }
        Insert: {
          id?: string
          empresa_id?: string | null
          timestamp?: string
          detalhes?: Json | null
          custo?: number
          requests_count?: number
          worker_name?: string | null
          cpu_time_ms?: number | null
          bandwidth_bytes?: number | null
          erros_count?: number | null
          origem?: string | null
          erro?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          empresa_id?: string | null
          timestamp?: string
          detalhes?: Json | null
          custo?: number
          requests_count?: number
          worker_name?: string | null
          cpu_time_ms?: number | null
          bandwidth_bytes?: number | null
          erros_count?: number | null
          origem?: string | null
          erro?: string | null
          created_at?: string
        }
        Relationships: []
      }
      metrics_supabase: {
        Row: {
          id: string
          empresa_id: string | null
          timestamp: string
          detalhes: Json | null
          leituras: number
          escritas: number
          storage_bytes: number | null
          realtime_connections: number | null
          bandwidth_bytes: number | null
          origem: string | null
          erro: string | null
          created_at: string
        }
        Insert: {
          id?: string
          empresa_id?: string | null
          timestamp?: string
          detalhes?: Json | null
          leituras?: number
          escritas?: number
          storage_bytes?: number | null
          realtime_connections?: number | null
          bandwidth_bytes?: number | null
          origem?: string | null
          erro?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          empresa_id?: string | null
          timestamp?: string
          detalhes?: Json | null
          leituras?: number
          escritas?: number
          storage_bytes?: number | null
          realtime_connections?: number | null
          bandwidth_bytes?: number | null
          origem?: string | null
          erro?: string | null
          created_at?: string
        }
        Relationships: []
      }
      metrics_alerts: {
        Row: {
          id: string
          empresa_id: string | null
          tipo: string
          severidade: string
          mensagem: string
          provedor: string
          valor_atual: number | null
          valor_limite: number | null
          resolvido: boolean
          resolvido_em: string | null
          detalhes: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          empresa_id?: string | null
          tipo: string
          severidade?: string
          mensagem: string
          provedor: string
          valor_atual?: number | null
          valor_limite?: number | null
          resolvido?: boolean
          resolvido_em?: string | null
          detalhes?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          empresa_id?: string | null
          tipo?: string
          severidade?: string
          mensagem?: string
          provedor?: string
          valor_atual?: number | null
          valor_limite?: number | null
          resolvido?: boolean
          resolvido_em?: string | null
          detalhes?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      metrics_daily_summary: {
        Row: {
          id: string
          empresa_id: string | null
          data: string
          provedor: string
          total_requests: number
          total_custo: number
          total_erros: number
          detalhes: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          empresa_id?: string | null
          data: string
          provedor: string
          total_requests?: number
          total_custo?: number
          total_erros?: number
          detalhes?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          empresa_id?: string | null
          data?: string
          provedor?: string
          total_requests?: number
          total_custo?: number
          total_erros?: number
          detalhes?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      metrics_alert_configs: {
        Row: {
          id: string
          empresa_id: string | null
          provedor: string
          tipo: string
          limite_valor: number
          ativo: boolean
          notificar_email: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          empresa_id?: string | null
          provedor: string
          tipo: string
          limite_valor: number
          ativo?: boolean
          notificar_email?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          empresa_id?: string | null
          provedor?: string
          tipo?: string
          limite_valor?: number
          ativo?: boolean
          notificar_email?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_usage_limit: {
        Args: { p_type: string; p_user_id: string }
        Returns: undefined
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
