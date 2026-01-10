import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LandingPage } from './pages/LandingPage';
import { BreathingExercisesPage } from './pages/BreathingExercisesPage';
import { ProgressPage } from './pages/ProgressPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { TherapistLayout } from './layouts/TherapistLayout';
import { TherapistDashboard } from './pages/therapist/TherapistDashboard';
import { MyPatientsPage } from './pages/therapist/MyPatientsPage';
import { TherapistAppointmentsPage } from './pages/therapist/TherapistAppointmentsPage';
import { TherapistProfilePage } from './pages/therapist/TherapistProfilePage';
import { EarningsPage } from './pages/therapist/EarningsPage';
import { SettingsPage } from './pages/therapist/SettingsPage';
import { PatientProfilePage } from './pages/therapist/PatientProfilePage';
import { SessionPage } from './pages/therapist/SessionPage';
import { MessagesPage } from './pages/therapist/MessagesPage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const TherapistRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  // Strict check for therapist role
  if (!isAuthenticated || user?.role !== 'therapist') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Patient Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/breathing"
              element={
                <ProtectedRoute>
                  <BreathingExercisesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <ProgressPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <ResourcesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <ChatbotPage />
                </ProtectedRoute>
              }
            />

            {/* Therapist Routes */}
            <Route path="/therapist" element={<TherapistRoute><TherapistLayout /></TherapistRoute>}>
              <Route index element={<Navigate to="/therapist/dashboard" replace />} />
              <Route path="dashboard" element={<TherapistDashboard />} />
              <Route path="patients" element={<MyPatientsPage />} />
              <Route path="patients/:id" element={<PatientProfilePage />} />
              <Route path="appointments" element={<TherapistAppointmentsPage />} />
              <Route path="session/:appointmentId" element={<SessionPage />} />
              <Route path="session/:appointmentId" element={<SessionPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="chat" element={<Navigate to="/therapist/messages" replace />} />
              <Route path="profile" element={<TherapistProfilePage />} />
              <Route path="earnings" element={<EarningsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
