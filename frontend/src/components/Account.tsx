import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Account = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      // Si aucun token n'est trouvé, rediriger vers la page de connexion
      navigate('/signup');
      return;
    }
    // Si un token est trouvé, on tente de récupérer l'email de l'utilisateur
    fetch('/api/auth/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
          setUserEmail(data.email);
        } else {
          navigate('/signup');
        }
      })
      .catch(() => navigate('/signup'));
  }, [token, navigate]);

  return (
    <div className="account-container">
      <h1>Bienvenue sur votre compte</h1>
      {userEmail ? (
        <p>Votre adresse email : {userEmail}</p>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default Account;
