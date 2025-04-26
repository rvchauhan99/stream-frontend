import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import VideoManagement from './components/VideoManagement';
import PayoutTransactions from './components/PayoutTransactions';
import Settings from './components/Settings';
import ChannelDetails from './components/ChannelDetails';
import Auth from './components/Auth';

// Protected Route wrapper component
const ProtectedRoute = () => {
  // TODO: Implement actual auth check
  // const isAuthenticated = false;

  // return isAuthenticated ? <Layout /> : <Navigate to="/auth" replace />;
  return <Layout children={<Outlet />} />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/auth" element={<Auth />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/videos" element={<VideoManagement />} />
          <Route path="/withdrawals" element={<PayoutTransactions />} />
          <Route path="/channel-details" element={<ChannelDetails />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}
