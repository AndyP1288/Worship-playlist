import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuth } from './hooks/useAuth';
import AddSongPage from './pages/AddSongPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SongDetailPage from './pages/SongDetailPage';
import SongLibraryPage from './pages/SongLibraryPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-6">Loading session...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="songs" element={<SongLibraryPage />} />
        <Route path="songs/:songId" element={<SongDetailPage />} />
        <Route path="add-song" element={<AddSongPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
