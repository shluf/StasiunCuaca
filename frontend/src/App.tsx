import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProviders } from './app/AppProviders';
import { Dashboard } from './features/dashboard';
import { useOnboarding } from './hooks/useOnboarding';
import { Onboarding } from './components/onboarding';
import { FeatureTour } from './components/tour';
import { WeatherHistory } from './features/history';
import { NotificationHistory } from './features/notifications';
import { SettingsView } from './features/settings';
import { NewsView } from './features/news/NewsView';
import { InsightsView } from './features/insights/InsightsView';
import { AuthPage } from './features/auth/AuthPage';
import { MainLayout } from './components/layout';

function AppContent() {
  const { hasCompletedOnboarding } = useOnboarding();
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      {!hasCompletedOnboarding ? <Onboarding /> : <FeatureTour />}

      {isAuthPage ? (
        <main className="min-h-screen">
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
          </Routes>
        </main>
      ) : (
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<WeatherHistory />} />
            <Route path="/insights" element={<InsightsView />} />
            <Route path="/alert" element={<NotificationHistory />} />
            <Route path="/settings" element={<SettingsView />} />

            {/* News Routes */}
            <Route path="/article" element={<NewsView />} />
            <Route path="/article/create" element={<NewsView />} />
            <Route path="/article/:slug" element={<NewsView />} />
            <Route path="/article/edit/:slug" element={<NewsView />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      )}
    </>
  );
}

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
