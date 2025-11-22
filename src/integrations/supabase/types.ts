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
      lia_configurations: {
        Row: {
          created_at: string
          id: string
          metrics_settings: Json | null
          openai_api_key: string | null
          render_api_url: string | null
          supabase_anon_key: string | null
          supabase_service_role_key: string | null
          supabase_url: string | null
          system_prompt: string | null
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metrics_settings?: Json | null
          openai_api_key?: string | null
          render_api_url?: string | null
          supabase_anon_key?: string | null
          supabase_service_role_key?: string | null
          supabase_url?: string | null
          system_prompt?: string | null
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metrics_settings?: Json | null
          openai_api_key?: string | null
          render_api_url?: string | null
          supabase_anon_key?: string | null
          supabase_service_role_key?: string | null
          supabase_url?: string | null
          system_prompt?: string | null
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      metrics_alerts: {
        Row: {
          created_at: string
          fonte: string
          id: string
          mensagem: string
          nivel: string | null
          resolvido: boolean | null
          resolvido_em: string | null
          tipo_alerta: string
          valor_atual: number | null
          valor_limite: number | null
        }
        Insert: {
          created_at?: string
          fonte: string
          id?: string
          mensagem: string
          nivel?: string | null
          resolvido?: boolean | null
          resolvido_em?: string | null
          tipo_alerta: string
          valor_atual?: number | null
          valor_limite?: number | null
        }
        Update: {
          created_at?: string
          fonte?: string
          id?: string
          mensagem?: string
          nivel?: string | null
          resolvido?: boolean | null
          resolvido_em?: string | null
          tipo_alerta?: string
          valor_atual?: number | null
          valor_limite?: number | null
        }
        Relationships: []
      }
      metrics_cartesia: {
        Row: {
          caracteres_enviados: number
          created_at: string
          creditos_restantes: number | null
          creditos_usados: number | null
          custo_estimado: number | null
          data: string
          empresa_id: string | null
          id: string
          minutos_fala: number | null
          updated_at: string
          usuario_id: string | null
        }
        Insert: {
          caracteres_enviados?: number
          created_at?: string
          creditos_restantes?: number | null
          creditos_usados?: number | null
          custo_estimado?: number | null
          data?: string
          empresa_id?: string | null
          id?: string
          minutos_fala?: number | null
          updated_at?: string
          usuario_id?: string | null
        }
        Update: {
          caracteres_enviados?: number
          created_at?: string
          creditos_restantes?: number | null
          creditos_usados?: number | null
          custo_estimado?: number | null
          data?: string
          empresa_id?: string | null
          id?: string
          minutos_fala?: number | null
          updated_at?: string
          usuario_id?: string | null
        }
        Relationships: []
      }
      metrics_cloudflare: {
        Row: {
          created_at: string
          custo_estimado: number | null
          data: string
          empresa_id: string | null
          erros_4xx: number | null
          erros_5xx: number | null
          id: string
          plano: string | null
          requests_dia: number | null
          tempo_execucao_ms: number | null
          trafego_rota: Json | null
          updated_at: string
          workers_executados: number | null
        }
        Insert: {
          created_at?: string
          custo_estimado?: number | null
          data?: string
          empresa_id?: string | null
          erros_4xx?: number | null
          erros_5xx?: number | null
          id?: string
          plano?: string | null
          requests_dia?: number | null
          tempo_execucao_ms?: number | null
          trafego_rota?: Json | null
          updated_at?: string
          workers_executados?: number | null
        }
        Update: {
          created_at?: string
          custo_estimado?: number | null
          data?: string
          empresa_id?: string | null
          erros_4xx?: number | null
          erros_5xx?: number | null
          id?: string
          plano?: string | null
          requests_dia?: number | null
          tempo_execucao_ms?: number | null
          trafego_rota?: Json | null
          updated_at?: string
          workers_executados?: number | null
        }
        Relationships: []
      }
      metrics_openai: {
        Row: {
          created_at: string
          custo_estimado: number | null
          data: string
          empresa_id: string | null
          id: string
          modelo: string | null
          tokens_input: number
          tokens_output: number
          tokens_total: number | null
          updated_at: string
          usuario_id: string | null
        }
        Insert: {
          created_at?: string
          custo_estimado?: number | null
          data?: string
          empresa_id?: string | null
          id?: string
          modelo?: string | null
          tokens_input?: number
          tokens_output?: number
          tokens_total?: number | null
          updated_at?: string
          usuario_id?: string | null
        }
        Update: {
          created_at?: string
          custo_estimado?: number | null
          data?: string
          empresa_id?: string | null
          id?: string
          modelo?: string | null
          tokens_input?: number
          tokens_output?: number
          tokens_total?: number | null
          updated_at?: string
          usuario_id?: string | null
        }
        Relationships: []
      }
      metrics_render: {
        Row: {
          chamadas_dia: number | null
          cpu_percent: number | null
          created_at: string
          custo_mensal: number | null
          data: string
          erros_4xx: number | null
          erros_500: number | null
          id: string
          instancia_tipo: string | null
          logs_erro: Json | null
          ram_percent: number | null
          status: string | null
          tempo_resposta_ms: number | null
          updated_at: string
        }
        Insert: {
          chamadas_dia?: number | null
          cpu_percent?: number | null
          created_at?: string
          custo_mensal?: number | null
          data?: string
          erros_4xx?: number | null
          erros_500?: number | null
          id?: string
          instancia_tipo?: string | null
          logs_erro?: Json | null
          ram_percent?: number | null
          status?: string | null
          tempo_resposta_ms?: number | null
          updated_at?: string
        }
        Update: {
          chamadas_dia?: number | null
          cpu_percent?: number | null
          created_at?: string
          custo_mensal?: number | null
          data?: string
          erros_4xx?: number | null
          erros_500?: number | null
          id?: string
          instancia_tipo?: string | null
          logs_erro?: Json | null
          ram_percent?: number | null
          status?: string | null
          tempo_resposta_ms?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      metrics_supabase: {
        Row: {
          conexoes_abertas: number | null
          consultas_lentas: number | null
          consumo_tabela: Json | null
          created_at: string
          custo_estimado: number | null
          data: string
          escritas_segundo: number | null
          id: string
          leituras_segundo: number | null
          storage_limite_mb: number | null
          storage_usado_mb: number | null
          tamanho_banco_mb: number | null
          taxa_erros: number | null
          updated_at: string
        }
        Insert: {
          conexoes_abertas?: number | null
          consultas_lentas?: number | null
          consumo_tabela?: Json | null
          created_at?: string
          custo_estimado?: number | null
          data?: string
          escritas_segundo?: number | null
          id?: string
          leituras_segundo?: number | null
          storage_limite_mb?: number | null
          storage_usado_mb?: number | null
          tamanho_banco_mb?: number | null
          taxa_erros?: number | null
          updated_at?: string
        }
        Update: {
          conexoes_abertas?: number | null
          consultas_lentas?: number | null
          consumo_tabela?: Json | null
          created_at?: string
          custo_estimado?: number | null
          data?: string
          escritas_segundo?: number | null
          id?: string
          leituras_segundo?: number | null
          storage_limite_mb?: number | null
          storage_usado_mb?: number | null
          tamanho_banco_mb?: number | null
          taxa_erros?: number | null
          updated_at?: string
        }
        Relationships: []
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
