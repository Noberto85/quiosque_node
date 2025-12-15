import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthCliente } from './stores/auth';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Home from './pages/Home';
import ErrorPage from './pages/Error';
import Checkout from './pages/Checkout';
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
debugger
  const claim = quiosqueStorage.getClaim();
  if (!claim) {
    return <Navigate to="/menu"  />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

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
         
              <Menu />
           
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
