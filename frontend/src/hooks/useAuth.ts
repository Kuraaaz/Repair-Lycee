import { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const { token, setToken } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
    } else {
      const localStorageToken = localStorage.getItem('token');
      if (localStorageToken) {
        setToken(localStorageToken);
      }
    }
  }, [token, setToken]);

  return { token, setToken };
};
