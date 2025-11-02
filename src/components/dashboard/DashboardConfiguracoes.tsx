import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Shield, Bell, Palette } from 'lucide-react';

/**
 * COMPONENTE: DashboardConfiguracoes
 *
 * Página de configurações da conta
 */
const DashboardConfiguracoes = () => {
  const { user } = useAuth();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';
  const userEmail = user?.email || '';

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Configurações da Conta
        </h1>
        <p className="text-white/60">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      {/* INFORMAÇÕES PESSOAIS */}
      <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5 text-[#00C2FF]" />
            Informações Pessoais
          </CardTitle>
          <CardDescription className="text-white/60">
            Seus dados cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nome */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-white/60" />
              <div>
                <p className="text-white/60 text-sm">Nome Completo</p>
                <p className="text-white font-medium">{userName}</p>
              </div>
            </div>
            <Button variant="ghost" className="text-[#00C2FF] hover:text-[#00C2FF]/80 hover:bg-white/5">
              Editar
            </Button>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-white/60" />
              <div>
                <p className="text-white/60 text-sm">E-mail</p>
                <p className="text-white font-medium">{userEmail}</p>
              </div>
            </div>
            <Button variant="ghost" className="text-[#00C2FF] hover:text-[#00C2FF]/80 hover:bg-white/5">
              Editar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SEGURANÇA */}
      <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Segurança
          </CardTitle>
          <CardDescription className="text-white/60">
            Proteja sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div>
              <p className="text-white font-medium">Alterar Senha</p>
              <p className="text-white/60 text-sm">Última alteração há 3 meses</p>
            </div>
            <Button variant="ghost" className="text-[#00C2FF] hover:text-[#00C2FF]/80 hover:bg-white/5">
              Alterar
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div>
              <p className="text-white font-medium">Autenticação de Dois Fatores</p>
              <p className="text-white/60 text-sm">Adicione uma camada extra de segurança</p>
            </div>
            <Button variant="ghost" className="text-[#00C2FF] hover:text-[#00C2FF]/80 hover:bg-white/5">
              Ativar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PREFERÊNCIAS */}
      <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            Preferências
          </CardTitle>
          <CardDescription className="text-white/60">
            Personalize sua experiência
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div>
              <p className="text-white font-medium">Idioma</p>
              <p className="text-white/60 text-sm">Português (Brasil)</p>
            </div>
            <Button variant="ghost" className="text-[#00C2FF] hover:text-[#00C2FF]/80 hover:bg-white/5">
              Alterar
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-white/60" />
              <div>
                <p className="text-white font-medium">Notificações</p>
                <p className="text-white/60 text-sm">Receber alertas por e-mail</p>
              </div>
            </div>
            <Button variant="ghost" className="text-[#00C2FF] hover:text-[#00C2FF]/80 hover:bg-white/5">
              Configurar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ZONA DE PERIGO */}
      <Card className="bg-red-500/10 backdrop-blur-lg border border-red-500/20">
        <CardHeader>
          <CardTitle className="text-red-400">Zona de Perigo</CardTitle>
          <CardDescription className="text-white/60">
            Ações irreversíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-red-500/20">
            <div>
              <p className="text-white font-medium">Excluir Conta</p>
              <p className="text-white/60 text-sm">Remover permanentemente sua conta e dados</p>
            </div>
            <Button variant="destructive" className="bg-red-500/20 hover:bg-red-500/30 text-red-400">
              Excluir
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardConfiguracoes;
