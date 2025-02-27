import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
}

const useTokenCleanup = () => {
  const { token, setToken } = useAuth();

  useEffect(() => {
    // Si le token est null y'a r
    if (!token) {
      return;
    }

    const checkTokenExpiration = () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) return;

      let decoded: DecodedToken;
      try {
        decoded = jwtDecode<DecodedToken>(storedToken);
      } catch (error) {
        console.error("Erreur de décodage du token :", error);
        localStorage.removeItem('token');
        setToken(null);
        return;
      }

      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.log("Token expiré, suppression...");
        localStorage.removeItem('token');
        setToken(null);
      }
    };

    // Vérifie qd on charge la page
    checkTokenExpiration();

    // Interval de 5 sec
    const interval = setInterval(checkTokenExpiration, 5000);

    return () => clearInterval(interval);
  }, [token, setToken]); // Vérifie à chaque changement du token

};

export default useTokenCleanup;
