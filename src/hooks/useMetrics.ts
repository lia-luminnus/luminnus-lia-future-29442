import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

// Types
export type MetricsOpenAI = Tables<"metrics_openai">;
export type MetricsCartesia = Tables<"metrics_cartesia">;
export type MetricsRender = Tables<"metrics_render">;
export type MetricsCloudflare = Tables<"metrics_cloudflare">;
export type MetricsSupabase = Tables<"metrics_supabase">;
export type MetricsAlert = Tables<"metrics_alerts">;
export type MetricsDailySummary = Tables<"metrics_daily_summary">;
export type MetricsAlertConfig = Tables<"metrics_alert_configs">;

// Provider types
export type ProviderType = "openai" | "cartesia" | "render" | "cloudflare" | "supabase";

// Cost calculation constants
export const COST_RATES = {
  openai: {
    inputPerToken: 0.00000015, // $0.15 per 1M tokens
    outputPerToken: 0.0000006, // $0.60 per 1M tokens
  },
  cartesia: {
    charsPerMinute: 850, // 850 characters = 1 minute of audio
  },
  cloudflare: {
    perRequest: 0.0000005, // $0.50 per 1M requests
  },
};

// Helper functions for cost calculation
export const calculateOpenAICost = (inputTokens: number, outputTokens: number): number => {
  return (inputTokens * COST_RATES.openai.inputPerToken) + (outputTokens * COST_RATES.openai.outputPerToken);
};

export const calculateCartesiaDuration = (caracteres: number): number => {
  return (caracteres / COST_RATES.cartesia.charsPerMinute) * 60; // Returns duration in seconds
};

export const calculateCloudflareCost = (requests: number): number => {
  return requests * COST_RATES.cloudflare.perRequest;
};

// Format currency
export const formatCurrency = (value: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(value);
};

// Format large numbers
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("pt-BR").format(value);
};

// Date range helper
const getDateRange = (days: number) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start: start.toISOString(), end: end.toISOString() };
};

// ================================
// OpenAI Metrics Hooks
// ================================
export function useMetricsOpenAI(days: number = 30, refetchInterval: number = 60000) {
  const { start, end } = getDateRange(days);

  return useQuery({
    queryKey: ["metrics-openai", days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metrics_openai")
        .select("*")
        .gte("timestamp", start)
        .lte("timestamp", end)
        .order("timestamp", { ascending: false });

      if (error) throw error;
      return data as MetricsOpenAI[];
    },
    refetchInterval,
    staleTime: 30000,
  });
}

export function useMetricsOpenAISummary(days: number = 30) {
  const { start, end } = getDateRange(days);

  return useQuery({
    queryKey: ["metrics-openai-summary", days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metrics_openai")
        .select("input_tokens, output_tokens, custo, erro")
        .gte("timestamp", start)
        .lte("timestamp", end);

      if (error) throw error;

      const metrics = data as MetricsOpenAI[];
      const totalInputTokens = metrics.reduce((sum, m) => sum + (m.input_tokens || 0), 0);
      const totalOutputTokens = metrics.reduce((sum, m) => sum + (m.output_tokens || 0), 0);
      const totalCost = metrics.reduce((sum, m) => sum + (m.custo || 0), 0);
      const totalErrors = metrics.filter(m => m.erro).length;
      const totalRequests = metrics.length;

      return {
        totalInputTokens,
        totalOutputTokens,
        totalTokens: totalInputTokens + totalOutputTokens,
        totalCost,
        totalErrors,
        totalRequests,
        avgCostPerRequest: totalRequests > 0 ? totalCost / totalRequests : 0,
      };
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

// ================================
// Cartesia Metrics Hooks
// ================================
export function useMetricsCartesia(days: number = 30, refetchInterval: number = 60000) {
  const { start, end } = getDateRange(days);

  return useQuery({
    queryKey: ["metrics-cartesia", days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metrics_cartesia")
        .select("*")
        .gte("timestamp", start)
        .lte("timestamp", end)
        .order("timestamp", { ascending: false });

      if (error) throw error;
      return data as MetricsCartesia[];
    },
    refetchInterval,
    staleTime: 30000,
  });
}

export function useMetricsCartesiaSummary(days: number = 30) {
  const { start, end } = getDateRange(days);

  return useQuery({
    queryKey: ["metrics-cartesia-summary", days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metrics_cartesia")
        .select("caracteres, duracao_segundos, custo, erro")
        .gte("timestamp", start)
        .lte("timestamp", end);

      if (error) throw error;

      const metrics = data as MetricsCartesia[];
      const totalChars = metrics.reduce((sum, m) => sum + (m.caracteres || 0), 0);
      const totalDurationSeconds = metrics.reduce((sum, m) => sum + (m.duracao_segundos || 0), 0);
      const totalCost = metrics.reduce((sum, m) => sum + (m.custo || 0), 0);
      const totalErrors = metrics.filter(m => m.erro).length;
      const totalRequests = metrics.length;

      return {
        totalChars,
        totalDurationSeconds,
        totalDurationMinutes: totalDurationSeconds / 60,
        totalCost,
        totalErrors,
        totalRequests,
      };
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

// ================================
// Render Metrics Hooks
// ================================
export function useMetricsRender(days: number = 30, refetchInterval: number = 60000) {
  const { start, end } = getDateRange(days);

  return useQuery({
    queryKey: ["metrics-render", days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metrics_render")
        .select("*")
        .gte("timestamp", start)
        .lte("timestamp", end)
        .order("timestamp", { ascending: false });

      if (error) throw error;
      return data as MetricsRender[];
    },
    refetchInterval,
    staleTime: 30000,
  });
}

export function useMetricsRenderLatest() {
  return useQuery({
    queryKey: ["metrics-render-latest"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metrics_render")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as MetricsRender | null;
    },
    refetchInterval: 30000,
    staleTime: 15000,
  });
}

// ================================
// Cloudflare Metrics Hooks
// ================================
export function useMetricsCloudflare(days: number = 30, refetchInterval: number = 60000) {
  const { start, end } = getDateRange(days);

  return useQuery({
    queryKey: ["metrics-cloudflare", days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metrics_cloudflare")
        .select("*")
        .gte("timestamp", start)
        .lte("timestamp", end)
        .order("timestamp", { ascending: false });

      if (error) throw error;
      return data as MetricsCloudflare[];
    },
    refetchInterval,
    staleTime: 30000,
  });
}

export function useMetricsCloudflareSummary(days: number = 30) {
  const { start, end } = getDateRange(days);

  return useQuery({
    queryKey: ["metrics-cloudflare-summary", days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metrics_cloudflare")
        .select("requests_count, custo, erros_count, bandwidth_bytes, erro")
        .gte("timestamp", start)
        .lte("timestamp", end);

      if (error) throw error;

      const metrics = data as MetricsCloudflare[];
      const totalRequests = metrics.reduce((sum, m) => sum + (m.requests_count || 0), 0);
      const totalCost = metrics.reduce((sum, m) => sum + (m.custo || 0), 0);
      const totalErrors = metrics.reduce((sum, m) => sum + (m.erros_count || 0), 0);
      const totalBandwidth = metrics.reduce((sum, m) => sum + (m.bandwidth_bytes || 0), 0);

      return {
        totalRequests,
        totalCost,
        totalErrors,
        totalBandwidth,
        totalBandwidthMB: totalBandwidth / (1024 * 1024),
      };
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

// ================================
// Supabase Metrics Hooks
// ================================
export function useMetricsSupabase(days: number = 30, refetchInterval: number = 60000) {
  const { start, end } = getDateRange(days);

  return useQuery({
    queryKey: ["metrics-supabase", days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metrics_supabase")
        .select("*")
        .gte("timestamp", start)
        .lte("timestamp", end)
        .order("timestamp", { ascending: false });

      if (error) throw error;
      return data as MetricsSupabase[];
    },
    refetchInterval,
    staleTime: 30000,
  });
}

export function useMetricsSupabaseSummary(days: number = 30) {
  const { start, end } = getDateRange(days);

  return useQuery({
    queryKey: ["metrics-supabase-summary", days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metrics_supabase")
        .select("leituras, escritas, storage_bytes, realtime_connections, bandwidth_bytes")
        .gte("timestamp", start)
        .lte("timestamp", end);

      if (error) throw error;

      const metrics = data as MetricsSupabase[];
      const totalReads = metrics.reduce((sum, m) => sum + (m.leituras || 0), 0);
      const totalWrites = metrics.reduce((sum, m) => sum + (m.escritas || 0), 0);
      const latestStorage = metrics[0]?.storage_bytes || 0;
      const latestRealtime = metrics[0]?.realtime_connections || 0;
      const totalBandwidth = metrics.reduce((sum, m) => sum + (m.bandwidth_bytes || 0), 0);

      return {
        totalReads,
        totalWrites,
        totalOperations: totalReads + totalWrites,
        storageBytes: latestStorage,
        storageMB: latestStorage / (1024 * 1024),
        realtimeConnections: latestRealtime,
        totalBandwidth,
        totalBandwidthMB: totalBandwidth / (1024 * 1024),
      };
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

// ================================
// Daily Summary Hooks
// ================================
export function useMetricsDailySummary(days: number = 30, provider?: ProviderType) {
  return useQuery({
    queryKey: ["metrics-daily-summary", days, provider],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split("T")[0];

      let query = supabase
        .from("metrics_daily_summary")
        .select("*")
        .gte("data", startDateStr)
        .order("data", { ascending: false });

      if (provider) {
        query = query.eq("provedor", provider);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MetricsDailySummary[];
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

// ================================
// Alerts Hooks
// ================================
export function useMetricsAlerts(resolved?: boolean, provider?: ProviderType) {
  return useQuery({
    queryKey: ["metrics-alerts", resolved, provider],
    queryFn: async () => {
      let query = supabase
        .from("metrics_alerts")
        .select("*")
        .order("created_at", { ascending: false });

      if (resolved !== undefined) {
        query = query.eq("resolvido", resolved);
      }
      if (provider) {
        query = query.eq("provedor", provider);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MetricsAlert[];
    },
    refetchInterval: 30000,
    staleTime: 15000,
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from("metrics_alerts")
        .update({ resolvido: true, resolvido_em: new Date().toISOString() })
        .eq("id", alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics-alerts"] });
    },
  });
}

// ================================
// Alert Config Hooks
// ================================
export function useMetricsAlertConfigs(provider?: ProviderType) {
  return useQuery({
    queryKey: ["metrics-alert-configs", provider],
    queryFn: async () => {
      let query = supabase
        .from("metrics_alert_configs")
        .select("*")
        .order("created_at", { ascending: false });

      if (provider) {
        query = query.eq("provedor", provider);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MetricsAlertConfig[];
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

export function useUpdateAlertConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: Partial<MetricsAlertConfig> & { id: string }) => {
      const { id, ...updates } = config;
      const { error } = await supabase
        .from("metrics_alert_configs")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics-alert-configs"] });
    },
  });
}

export function useCreateAlertConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: Omit<MetricsAlertConfig, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("metrics_alert_configs").insert(config);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics-alert-configs"] });
    },
  });
}

// ================================
// Combined Dashboard Hook
// ================================
export function useMetricsDashboard(days: number = 30) {
  const openai = useMetricsOpenAISummary(days);
  const cartesia = useMetricsCartesiaSummary(days);
  const cloudflare = useMetricsCloudflareSummary(days);
  const supabaseMetrics = useMetricsSupabaseSummary(days);
  const renderLatest = useMetricsRenderLatest();
  const alerts = useMetricsAlerts(false);
  const dailySummary = useMetricsDailySummary(days);

  const isLoading =
    openai.isLoading ||
    cartesia.isLoading ||
    cloudflare.isLoading ||
    supabaseMetrics.isLoading ||
    renderLatest.isLoading ||
    alerts.isLoading ||
    dailySummary.isLoading;

  const totalCost =
    (openai.data?.totalCost || 0) +
    (cartesia.data?.totalCost || 0) +
    (cloudflare.data?.totalCost || 0);

  // Calculate daily average and monthly projection
  const dailyAvg = totalCost / days;
  const monthlyProjection = dailyAvg * 30;

  return {
    isLoading,
    openai: openai.data,
    cartesia: cartesia.data,
    cloudflare: cloudflare.data,
    supabase: supabaseMetrics.data,
    render: renderLatest.data,
    alerts: alerts.data,
    dailySummary: dailySummary.data,
    totals: {
      totalCost,
      dailyAvg,
      monthlyProjection,
      unresolvedAlerts: alerts.data?.length || 0,
    },
    refetch: () => {
      openai.refetch();
      cartesia.refetch();
      cloudflare.refetch();
      supabaseMetrics.refetch();
      renderLatest.refetch();
      alerts.refetch();
      dailySummary.refetch();
    },
  };
}

// ================================
// Provider Status Hook
// ================================
export function useProviderStatus() {
  return useQuery({
    queryKey: ["provider-status"],
    queryFn: async () => {
      // Check recent metrics to determine provider status
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      const timestamp = oneHourAgo.toISOString();

      const [openai, cartesia, render, cloudflare, supabaseData] = await Promise.all([
        supabase.from("metrics_openai").select("erro").gte("timestamp", timestamp).limit(10),
        supabase.from("metrics_cartesia").select("erro").gte("timestamp", timestamp).limit(10),
        supabase.from("metrics_render").select("status").order("timestamp", { ascending: false }).limit(1),
        supabase.from("metrics_cloudflare").select("erro").gte("timestamp", timestamp).limit(10),
        supabase.from("metrics_supabase").select("erro").gte("timestamp", timestamp).limit(10),
      ]);

      const getStatus = (data: { erro?: string | null }[] | null) => {
        if (!data || data.length === 0) return "unknown";
        const errors = data.filter(d => d.erro).length;
        if (errors === 0) return "operational";
        if (errors < data.length / 2) return "degraded";
        return "down";
      };

      return {
        openai: getStatus(openai.data),
        cartesia: getStatus(cartesia.data),
        render: render.data?.[0]?.status || "unknown",
        cloudflare: getStatus(cloudflare.data),
        supabase: getStatus(supabaseData.data),
      };
    },
    refetchInterval: 30000,
    staleTime: 15000,
  });
}
