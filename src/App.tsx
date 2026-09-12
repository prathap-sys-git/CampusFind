import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { PublicLayout } from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public pages
import { LandingPage } from './pages/LandingPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Authenticated application pages
import { DashboardPage } from './pages/app/DashboardPage';
import { ReportItemPage } from './pages/app/ReportItemPage';
import { BrowseItemsPage } from './pages/app/BrowseItemsPage';
import { AiMatchesPage } from './pages/app/AiMatchesPage';
import { ClaimsPage } from './pages/app/ClaimsPage';
import { NotificationsPage } from './pages/app/NotificationsPage';
import { ItemDetailsPage } from './pages/app/ItemDetailsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* 1. PUBLIC MARKETING WEBSITE ROUTES */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* 2. PROTECTED AUTHENTICATED APPLICATION ROUTES */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/report-lost" element={<ReportItemPage type="lost" />} />
                <Route path="/report-found" element={<ReportItemPage type="found" />} />
                <Route path="/lost-items" element={<BrowseItemsPage type="lost" />} />
                <Route path="/found-items" element={<BrowseItemsPage type="found" />} />
                <Route path="/matches" element={<AiMatchesPage />} />
                <Route path="/claims" element={<ClaimsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/items/:id" element={<ItemDetailsPage />} />
                <Route path="/profile" element={<SettingsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* 3. CATCH-ALL FALLBACK */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
