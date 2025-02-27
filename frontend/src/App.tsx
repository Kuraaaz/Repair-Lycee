import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './components/Signup';
import Account from './components/Account';
import Home from './components/Home';
import Planning from './components/Planning';
import useTokenCleanup from './hooks/useTokenClenup';
import { useAuth } from './hooks/useAuth';

const ProtectedRouteWrapper = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const isAuthenticated = Boolean(token);
  return <ProtectedRoute isAuthenticated={isAuthenticated}>{children}</ProtectedRoute>;
};

const AppContent = () => {
  useTokenCleanup();

  return (
    <Router>
      <Routes>
        {/* Page d'accueil principale */}
        <Route path="/" element={<Home />} />

        {/* Page d'inscription */}
        <Route path="/signup" element={<Signup />} />

        {/* Page de compte*/}
        <Route
          path="/account"
          element={
            <ProtectedRouteWrapper>
              <Account />
            </ProtectedRouteWrapper>
          }
        />

        {/* Page de planning */}
        <Route path="/planning" element={<Planning />} />
        {/* Autres routes... */}
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
