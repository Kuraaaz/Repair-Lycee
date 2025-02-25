import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/signup.css'; // Import du fichier CSS

const Signup = () => {
  const [emailSignup, setEmailSignup] = useState('');
  const [passwordSignup, setPasswordSignup] = useState('');
  const [rememberMeSignup, setRememberMeSignup] = useState(false);

  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [rememberMeLogin, setRememberMeLogin] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { token, setToken } = useAuth();

  useEffect(() => {
    // Si le token est présent, on redirige automatiquement vers /account
    if (token) {
      console.log('Token présent via contexte:', token);
      navigate('/account');
    }
  }, [token, navigate]);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: emailSignup, password: passwordSignup, rememberMe: rememberMeSignup }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Erreur lors de l\'inscription.');
      } else {
        setMessage('Inscription réussie ! Redirection...');
        setToken(data.token); // Met à jour le contexte et localStorage
        navigate('/account');
      }
    } catch (err) {
      setError('Erreur lors de la communication avec le serveur.');
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: emailLogin, password: passwordLogin, rememberMe: rememberMeLogin }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Erreur lors de la connexion.');
      } else {
        setMessage('Connexion réussie ! Redirection...');
        setToken(data.token); // Met à jour le contexte et localStorage
        navigate('/account');
      }
    } catch (err) {
      setError('Erreur lors de la communication avec le serveur.');
    }
  };

  return (
    <div className="signup-container">
      <h1>Inscription</h1>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      
      <form onSubmit={handleSignup} className="auth-form">
        <div className="input-group">
          <label htmlFor="emailSignup">Email :</label>
          <input
            type="email"
            id="emailSignup"
            value={emailSignup}
            onChange={(e) => setEmailSignup(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="passwordSignup">Mot de passe :</label>
          <input
            type="password"
            id="passwordSignup"
            value={passwordSignup}
            onChange={(e) => setPasswordSignup(e.target.value)}
            required
          />
        </div>
        <div className="checkbox-group">
          <label htmlFor="rememberMeSignup">Se souvenir de moi :</label>
          <input
            type="checkbox"
            id="rememberMeSignup"
            checked={rememberMeSignup}
            onChange={(e) => setRememberMeSignup(e.target.checked)}
          />
        </div>
        <button type="submit" className="auth-button">S'inscrire</button>
      </form>

      <hr className="separator" />

      <h1>Connexion</h1>
      <form onSubmit={handleLogin} className="auth-form">
        <div className="input-group">
          <label htmlFor="emailLogin">Email :</label>
          <input
            type="email"
            id="emailLogin"
            value={emailLogin}
            onChange={(e) => setEmailLogin(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="passwordLogin">Mot de passe :</label>
          <input
            type="password"
            id="passwordLogin"
            value={passwordLogin}
            onChange={(e) => setPasswordLogin(e.target.value)}
            required
          />
        </div>
        <div className="checkbox-group">
          <label htmlFor="rememberMeLogin">Se souvenir de moi :</label>
          <input
            type="checkbox"
            id="rememberMeLogin"
            checked={rememberMeLogin}
            onChange={(e) => setRememberMeLogin(e.target.checked)}
          />
        </div>
        <button type="submit" className="auth-button">Se connecter</button>
      </form>
    </div>
  );
};

export default Signup;
