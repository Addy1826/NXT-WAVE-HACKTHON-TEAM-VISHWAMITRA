import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Pages & Components
import { OnboardingPage } from './pages/OnboardingPage';
import { PatientLoginPage } from './pages/PatientLoginPage';
import { TherapistLoginPage } from './pages/TherapistLoginPage';
import { PatientSignupPage } from './pages/PatientSignupPage';
import { TherapistSignupPage } from './pages/TherapistSignupPage';
import { Dashboard } from './pages/Dashboard';
import { ProfilePage } from './pages/ProfilePage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LandingPage } from './pages/LandingPage';
import { BreathingExercisesPage } from './pages/BreathingExercisesPage';
import { ProgressPage } from './pages/ProgressPage';
import { PatientResourcesPage } from './pages/PatientResourcesPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { TherapistLayout } from './layouts/TherapistLayout';
import { TherapistDashboardPage } from './pages/TherapistDashboardPage';
import { MyPatientsPage } from './pages/therapist/MyPatientsPage';
import { TherapistAppointmentsPage } from './pages/therapist/TherapistAppointmentsPage';
import { TherapistProfilePage } from './pages/therapist/TherapistProfilePage';
import { EarningsPage } from './pages/therapist/EarningsPage';
import { SettingsPage } from './pages/therapist/SettingsPage';
import { PatientProfilePage } from './pages/therapist/PatientProfilePage';
import { SessionPage } from './pages/therapist/SessionPage';
import { MessagesPage } from './pages/therapist/MessagesPage';
import { PatientAppointmentsPage } from './pages/PatientAppointmentsPage';
import { TherapistBookingPage } from './pages/TherapistBookingPage';
import { PatientMessagesPage } from './pages/PatientMessagesPage';
import { VideoSessionPage } from './pages/VideoSessionPage';
import { PageTransition } from './components/PageTransition';
import { ScrollToTop } from './components/ScrollToTop';
import { PatientLayout } from './layouts/PatientLayout';

// Admin Routes (New SaaS Architecture)
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminProfilePage } from './pages/AdminProfilePage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { LoadingSpinner } from './components/LoadingSpinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><LoadingSpinner size="lg" /></div>;
  if (!isAuthenticated) return <Navigate to="/login/patient" />;
  return <PageTransition>{children}</PageTransition>;
};

const TherapistRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><LoadingSpinner size="lg" /></div>;
  if (!isAuthenticated || user?.role !== 'therapist') return <Navigate to="/login/therapist" replace />;
  return <PageTransition>{children}</PageTransition>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><LoadingSpinner size="lg" /></div>;
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/admin/login" replace />;
  return <PageTransition>{children}</PageTransition>;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/onboarding" element={<PageTransition><OnboardingPage /></PageTransition>} />

        <Route path="/login/patient" element={<PageTransition><PatientLoginPage /></PageTransition>} />
        <Route path="/login/therapist" element={<PageTransition><TherapistLoginPage /></PageTransition>} />
        <Route path="/admin/login" element={<PageTransition><AdminLoginPage /></PageTransition>} />
        <Route path="/login/admin" element={<Navigate to="/admin/login" />} />

        <Route path="/signup/patient" element={<PageTransition><PatientSignupPage /></PageTransition>} />
        <Route path="/signup/therapist" element={<PageTransition><TherapistSignupPage /></PageTransition>} />

        <Route path="/login" element={<Navigate to="/login/patient" />} />
        <Route path="/register" element={<Navigate to="/signup/patient" />} />

        {/* Patient Routes */}
        <Route element={<PatientLayout />}>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/breathing" element={<ProtectedRoute><BreathingExercisesPage /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><PatientResourcesPage /></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><PatientAppointmentsPage /></ProtectedRoute>} />
          <Route path="/therapist-profile/:therapistId" element={<ProtectedRoute><TherapistBookingPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><PatientMessagesPage /></ProtectedRoute>} />
        </Route>

        <Route path="/session/:sessionId" element={<ProtectedRoute><VideoSessionPage /></ProtectedRoute>} />

        {/* Therapist Routes */}
        <Route path="/therapist" element={<TherapistRoute><TherapistLayout /></TherapistRoute>}>
          <Route index element={<Navigate to="/therapist/dashboard" replace />} />
          <Route path="dashboard" element={<TherapistDashboardPage />} />
          <Route path="patients" element={<MyPatientsPage />} />
          <Route path="patients/:id" element={<PatientProfilePage />} />
          <Route path="appointments" element={<TherapistAppointmentsPage />} />
          <Route path="session/:appointmentId" element={<SessionPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="chat" element={<Navigate to="/therapist/messages" replace />} />
          <Route path="profile" element={<TherapistProfilePage />} />
          <Route path="earnings" element={<EarningsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="settings" element={<AdminSettingsPage />} />

          <Route path="patients" element={<AdminDashboardPage />} />
          <Route path="therapists" element={<AdminDashboardPage />} />
        </Route>

        {/* 404 Catch-All Route */}
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <ScrollToTop />
            <AnimatedRoutes />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
