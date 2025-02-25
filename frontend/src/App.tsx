// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JSX } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Assurez-vous du chemin correct
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

          {/* Redirection par défaut */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const ProtectedRouteWrapper = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  const isAuthenticated = Boolean(token);
  return <ProtectedRoute isAuthenticated={isAuthenticated}>{children}</ProtectedRoute>;
};

export default App;
