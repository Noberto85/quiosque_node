import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authService } from '@/lib/auth-service';
import { useAuth } from '@/stores/auth';
import { toast } from 'sonner';
import { UtensilsCrossed } from 'lucide-react';
import { get } from 'http';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [mesaId, setMesaId] = useState('');
  const [garcom, setGarcom] = useState('');
  const [quiosque, setQuiosque] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contextLoading, setContextLoading] = useState(false);
  const [context, setContext] = useState<any>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const token = params.token ?? searchParams.get('me') ?? undefined;


  useEffect(() => {
    debugger
    if (token) {
      setContextLoading(true);
      fetch(`http://localhost:8081/api/v1/auth?token=${token}`)
        .then((res) => {
          debugger
          if (!res.ok) throw new Error('Erro ao obter dados do QRCode');
          return res.json();
        })
        .then((data) => {
          setContext(data);
          if (data?.token) {
            try {
              setQuiosque(data.quiosque);
              localStorage.setItem('qrToken', data.token);
            } catch { }
          }
        })
        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => setContextLoading(false));
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await authService.signInWithPassword(email, password);
      login(authService.mapUser(user));
      navigate('/menu');
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.sendOtp(email);
      setOtpSent(true);
      toast.success('Código enviado para seu email!');
      setLoading(false);
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await authService.verifyOtpAndSetPassword(email, otp, password, username);
      login(authService.mapUser(user));
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full gradient-primary">
            <UtensilsCrossed className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-gradient">QuiosQ</CardTitle>
          <CardDescription>Entre ou cadastre-se para fazer seu pedido</CardDescription>
        </CardHeader>
        <CardContent>
          {<div className="mb-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">Dados do atendimento</p>
              {contextLoading && (
                <span className="text-sm text-muted-foreground">Carregando...</span>
              )}
            </div>
            <div  className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground sm:grid-cols-3">
              <span>Quiosque: <span className="font-medium">{context?.quiosque ?? quiosque}</span></span>

            </div>
            <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground sm:grid-cols-3">
              <span>Mesa: <span className="font-medium">{context?.mesa ?? mesaId}</span></span>
              <span>Garçom: <span className="font-medium">{context?.garcom ?? '-'}</span></span>
            </div>
          </div>}
          {
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Senha</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          }


        </CardContent>
      </Card>
    </div>
  );
}
