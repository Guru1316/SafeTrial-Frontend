// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import TouristRegistration from './pages/TouristRegistration';
import Login from './pages/Login';
import TouristDashboard from './pages/TouristDashboard';
import DigitalIDViewer from './pages/DigitalIDViewer';
import TripPlanner from './pages/TripPlanner';
import LiveMap from './pages/LiveMap';
import SafetyScoreAnalytics from './pages/SafetyScoreAnalytics';
import AlertCenter from './pages/AlertCenter';
import EmergencyPanel from './pages/EmergencyPanel';
import EmergencyContactsManager from './pages/EmergencyContactsManager';
import AuthorityDashboard from './pages/AuthorityDashboard';
import IncidentReports from './pages/IncidentReports';
import RiskZonesViewer from './pages/RiskZonesViewer';
import SystemSettings from './pages/SystemSettings';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { isAuthenticated } = React.useContext(AuthContext);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="main-layout">
        {isAuthenticated && <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />}
        <main className={`main-content ${!isAuthenticated ? 'full-width' : ''}`}>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute requireAuth={false}>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={
              <ProtectedRoute requireAuth={false}>
                <TouristRegistration />
              </ProtectedRoute>
            } />
            <Route path="/login" element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute requireAuth={true}>
                <TouristDashboard />
              </ProtectedRoute>
            } />
            <Route path="/digital-id" element={
              <ProtectedRoute requireAuth={true}>
                <DigitalIDViewer />
              </ProtectedRoute>
            } />
            <Route path="/trip-planner" element={
              <ProtectedRoute requireAuth={true}>
                <TripPlanner />
              </ProtectedRoute>
            } />
            <Route path="/live-map" element={
              <ProtectedRoute requireAuth={true}>
                <LiveMap />
              </ProtectedRoute>
            } />
            <Route path="/safety-analytics" element={
              <ProtectedRoute requireAuth={true}>
                <SafetyScoreAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/alert-center" element={
              <ProtectedRoute requireAuth={true}>
                <AlertCenter />
              </ProtectedRoute>
            } />
            <Route path="/emergency" element={
              <ProtectedRoute requireAuth={true}>
                <EmergencyPanel />
              </ProtectedRoute>
            } />
            <Route path="/emergency-contacts" element={
              <ProtectedRoute requireAuth={true}>
                <EmergencyContactsManager />
              </ProtectedRoute>
            } />
            <Route path="/authority-dashboard" element={
              <ProtectedRoute requireAuth={true}>
                <AuthorityDashboard />
              </ProtectedRoute>
            } />
            <Route path="/incident-reports" element={
              <ProtectedRoute requireAuth={true}>
                <IncidentReports />
              </ProtectedRoute>
            } />
            <Route path="/risk-zones" element={
              <ProtectedRoute requireAuth={true}>
                <RiskZonesViewer />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute requireAuth={true}>
                <SystemSettings />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;