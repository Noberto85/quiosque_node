import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { useAuthCliente } from './stores/auth';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Home from './pages/Home';
import ErrorPage from './pages/Error';
import Checkout from './pages/Checkout';
import PixPayment from './pages/PixPayment';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import { quiosqueStorage } from './lib/quiosque-storage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthCliente();
 
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  
  const claim = quiosqueStorage.getClaim();
  if (!claim) {
    toast.error('Sessão expirada. Por favor, faça login novamente.');
    return <Navigate to="/" />;
  }

  /* if (!user) {
    return <Navigate to="/login" replace />;
  } */

  return <>{children}</>;
}

export default function App() {
  const { setLoading } = useAuthCliente();

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/erro" element={<ErrorPage />} />
        <Route path="/login/:token" element={<Login />} />
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>


          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/pix"
          element={
            <ProtectedRoute>
              <PixPayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />
        <Route path="/orders" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/erro" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
