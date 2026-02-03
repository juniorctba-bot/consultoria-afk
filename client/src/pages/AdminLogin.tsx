import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trpc } from '@/lib/trpc';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();
  
  const verifyPasswordMutation = trpc.adminAuth.verifyPassword.useMutation({
    onSuccess: () => {
      localStorage.setItem('admin_authenticated', 'true');
      setLocation('/admin');
    },
    onError: (error) => {
      setError(error.message || 'Senha inválida');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!password) {
      setError('Por favor, digite a senha');
      return;
    }
    verifyPasswordMutation.mutate({ password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFCE00] to-[#FFB800] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">Painel Administrativo</CardTitle>
          <CardDescription className="text-center">Consultoria AFK Financeira</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha de Acesso
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite a senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={verifyPasswordMutation.isPending}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-afk-yellow text-gray-800 hover:bg-yellow-500 font-semibold"
              disabled={verifyPasswordMutation.isPending}
            >
              {verifyPasswordMutation.isPending ? 'Verificando...' : 'Acessar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
