import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import DashboardLayout from './pages/layout/screenLayout';
import DashboardOverview from './pages/Dashboard';
import Clients from './pages/Clients';
import AddClientForm from './pages/AddClientForm';
import ClientDetail from './pages/ClientDetail';
import LoanCalculationsPage from './pages/LoanCalculationsPage';
import { useAuth } from './pages/auth/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="clients" element={<Clients />} />
        <Route path="clients/new" element={<AddClientForm />} />
        <Route path="clients/:clientId" element={<ClientDetail />} />
        <Route path="clients/:clientId/edit" element={<AddClientForm />} />
        <Route path="loans" element={<LoanCalculationsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
