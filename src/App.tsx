import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import UserDetailPage from './pages/UserDetailPage';
import StatsPage from './pages/StatsPage';
import PushPage from './pages/PushPage';
import BannersPage from './pages/BannersPage';
import BannerFormPage from './pages/BannerFormPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/:uid" element={<UserDetailPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/push" element={<PushPage />} />
              <Route path="/banners" element={<BannersPage />} />
              <Route path="/banners/new" element={<BannerFormPage />} />
              <Route path="/banners/:id/edit" element={<BannerFormPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
