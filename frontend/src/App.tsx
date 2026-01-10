import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OnboardingPage } from './pages/OnboardingPage';
import { PatientLoginPage } from './pages/PatientLoginPage';
import { TherapistLoginPage } from './pages/TherapistLoginPage';
import { PatientSignupPage } from './pages/PatientSignupPage';
import { TherapistSignupPage } from './pages/TherapistSignupPage';
import { Dashboard } from './pages/Dashboard';
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

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Allow mock token access for demo
  const token = localStorage.getItem('token');
  if (!isAuthenticated && !token) {
    return <Navigate to="/login/patient" />;
  }

  return <PageTransition>{children}</PageTransition>;
};

const TherapistRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  // Strict check for therapist role (or demo token)
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const cachedUser = userStr ? JSON.parse(userStr) : null;

  if ((!isAuthenticated && !token) || (cachedUser?.role !== 'therapist' && user?.role !== 'therapist')) {
    return <Navigate to="/login/therapist" replace />;
  }

  return <PageTransition>{children}</PageTransition>;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/onboarding" element={<PageTransition><OnboardingPage /></PageTransition>} />

        {/* Auth Routes */}
        <Route path="/login/patient" element={<PageTransition><PatientLoginPage /></PageTransition>} />
        <Route path="/login/therapist" element={<PageTransition><TherapistLoginPage /></PageTransition>} />
        <Route path="/signup/patient" element={<PageTransition><PatientSignupPage /></PageTransition>} />
        <Route path="/signup/therapist" element={<PageTransition><TherapistSignupPage /></PageTransition>} />

        {/* Redirect old routes */}
        <Route path="/login" element={<Navigate to="/login/patient" />} />
        <Route path="/register" element={<Navigate to="/signup/patient" />} />

        {/* Patient Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/breathing" element={<ProtectedRoute><BreathingExercisesPage /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><PatientResourcesPage /></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><PatientAppointmentsPage /></ProtectedRoute>} />
        <Route path="/therapist-profile/:therapistId" element={<ProtectedRoute><TherapistBookingPage /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><PatientMessagesPage /></ProtectedRoute>} />
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
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AnimatedRoutes />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
