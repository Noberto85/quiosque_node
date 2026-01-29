import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthCliente } from '@/stores/auth';
import { toast } from 'sonner';
import { UtensilsCrossed } from 'lucide-react';
import { qrAuthService } from '@/lib/qr-auth-service';
import { quiosqueStorage } from '@/lib/quiosque-storage';
import { formatPhoneBR, onlyDigits } from '@/lib/utils';
import { TabsContent } from '@radix-ui/react-tabs';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export default function Login() {

  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [contextLoading, setContextLoading] = useState(false);
  const [context, setContext] = useState<any>(null);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  const { login } = useAuthCliente();
  const navigate = useNavigate();
  const { token } = useParams();


  useEffect(() => {

    if (token) {
      setContextLoading(true);
      qrAuthService
        .getAuthContext(token as string)
        .then((data) => {
          setContext(data);
          if (data) {
            quiosqueStorage.setDataQuiosque(data);
          }
        })
        .catch((error: any) => {
          toast.error(error.message);
          navigate('/');
        })
        .finally(() => setContextLoading(false));
    } else {
      quiosqueStorage.removeDataQuiosque();
      navigate('/');
    }
  }, [token]);

  const handleSendOtp = async (e: React.FormEvent) => {
    
    e.preventDefault();
    setLoading(true);

    try {
      if (telefone.length < 14) {
        throw new Error('Telefone inválido');
      }
      setOtpSent(true);
     
      // Simulate API call
      await qrAuthService.sendSmsToken(onlyDigits(telefone)).then((data) => {
       toast.success('Código enviado para seu telefone!');
        setShowOtpModal(true);
        setLoading(false);
      },(error: any) => {
        clearFields();
        setLoading(false);
      });

    } catch (error: any) {
      clearFields();
      setLoading(false);
      clearFields();
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 4) {
      toast.error('O código deve ter 4 dígitos');
      return;
    }

    qrAuthService.validateSmsToken(onlyDigits(telefone), otp)
      .then((data) => {
        
        if (data.ativo) {
          toast.success('Código verificado com sucesso!');
          setIsOtpVerified(true);
          setShowOtpModal(false);
        } else {
          toast.error('Código inválido!');
          setOtp('');
        }
      })
      .catch((error: any) => {
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
  };

  const handleRegister = async (e: React.FormEvent) => {
    
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem!');
      setLoading(false);
      return;
    }

    await qrAuthService.createCliente({
      nome: username,
      telefone: onlyDigits(telefone),
      password: password,
    }).then(() => {
       toast.success('Cadastro realizado com sucesso!');
        setLoading(false);
        setActiveTab('login');
        clearFields();
    }).catch((error: any) => {
      setLoading(false);
      clearFields();
    });

  };


  const handleLogin = async (e: React.FormEvent) => {
debugger
    e.preventDefault();
    setLoading(true);
      await qrAuthService.getClientToken({
        quiosqueId: context?.quiosqueId,
        mesa: context?.mesa,
        password: password,
        telefone: onlyDigits(telefone),
      }).then((token) => {
        quiosqueStorage.setClaim(token.token);
        login({ telefone: onlyDigits(telefone) });
        quiosqueStorage.setUpdateDataQuiosque(onlyDigits(telefone));
        clearFields();
        navigate('/menu');
      },(error: any) => {
        clearFields();
        setLoading(false);
      });
    
  };

  const clearFields = () => {
    setUsername('');
    setTelefone('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
  }


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
            <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground sm:grid-cols-3">
              <span>Quiosque: <span className="font-medium">{context?.quiosque ?? '-'} </span></span>

            </div>
            <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground sm:grid-cols-3">
              <span>Mesa: <span className="font-medium">{context?.mesa ?? '-'} </span></span>
              <span>Garçom: <span className="font-medium">{context?.garcom ?? '-'}</span></span>
            </div>
          </div>}
          {
            <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">

                  <div className="space-y-2">
                    <Label htmlFor="login-telefone">Telefone</Label>
                    <Input
                      id="login-telefone"
                      type="text"
                      placeholder="(XX) XXXXX-XXXX"
                      value={telefone}
                      onChange={(e) => setTelefone(formatPhoneBR(e.target.value))}
                      inputMode="numeric"
                      maxLength={15}
                      required
                    />
                    <Label htmlFor="login-senha">Senha</Label>
                    <Input
                      id="login-senha"
                      type="password"
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      inputMode="numeric"
                      maxLength={15}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                {!isOtpVerified ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-telefone">Telefone</Label>
                      <Input
                        id="register-telefone"
                        type="text"
                        placeholder="(XX) XXXXX-XXXX"
                        value={telefone}
                        onChange={(e) => setTelefone(formatPhoneBR(e.target.value))}
                        inputMode="numeric"
                        maxLength={15}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                      {loading ? 'Enviando...' : 'Enviar Código'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Nome de Usuário</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Seu nome"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Confirmar Senha</Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Confirme sua senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                      {loading ? 'Cadastrando...' : 'Concluir Cadastro'}
                    </Button>
                  </form>
                )}
              </TabsContent>

            </Tabs>


          }
        </CardContent>
      </Card>

      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verificar Código</DialogTitle>
            <DialogDescription>
              Digite o código de 4 dígitos enviado para {telefone}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center space-x-2 py-4">
            <InputOTP
              maxLength={4}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="default"
              className="w-full gradient-primary"
              onClick={handleVerifyOtp}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
