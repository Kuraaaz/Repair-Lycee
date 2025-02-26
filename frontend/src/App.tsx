import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './components/Signup';
import Account from './components/Account';
import Home from './components/Home';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Page d'accueil principale */}
          <Route path="/" element={<Home />} />

          {/* Page d'inscription */}
          <Route path="/signup" element={<Signup />} />

          {/* Page de compte protégée */}
          <Route
            path="/account"
            element={
              <ProtectedRouteWrapper>
                <Account />
              </ProtectedRouteWrapper>
            }
          />
          {/* Vous pouvez ajouter d'autres routes ou redirections par défaut */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

import { useAuth } from './hooks/useAuth';

const ProtectedRouteWrapper = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const isAuthenticated = Boolean(token);
  return <ProtectedRoute isAuthenticated={isAuthenticated}>{children}</ProtectedRoute>;
};


export default App;
