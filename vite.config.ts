import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Desabilita cache no servidor de desenvolvimento
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Limpa o diretório de saída antes de buildar (equivalente ao cleanDistDir)
    emptyOutDir: true,
    // Força rebuild completo ao desabilitar cache do Rollup
    rollupOptions: {
      cache: false,
      output: {
        // Adiciona hash aos arquivos para invalidar cache do navegador
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // Garante que todos os módulos sejam reconstruídos
    minify: 'esbuild',
    // Configurações adicionais para forçar rebuild
    sourcemap: false,
    // Remove cache de módulos
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  // Desabilita otimização de dependências em cache
  optimizeDeps: {
    force: true,
    // Inclui componentes admin para garantir rebuild
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ]
  },
  // Desabilita cache de ESBuild
  esbuild: {
    keepNames: false,
  }
}));
