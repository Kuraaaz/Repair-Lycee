// src/components/Account.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/account.css';

interface UserProfile {
  email: string;
  nom?: string;
  prenom?: string;
  classe?: string;
}

const Account = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>('');
  const [updateError, setUpdateError] = useState<string>('');
  const [updateMessage, setUpdateMessage] = useState<string>('');
  
  // Champs du formulaire pour compléter le profil
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [classe, setClasse] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/signup');
      return;
    }
  
    fetch('http://localhost:5000/api/auth/profile', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text || `Erreur HTTP: ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data.email) {
          setProfile(data);
          setNom(data.nom || '');
          setPrenom(data.prenom || '');
          setClasse(data.classe || '');
        } else {
          navigate('/signup');
        }
      })
      .catch((err) => {
        console.error('Erreur lors du chargement du profil:', err);
        setError('Erreur lors du chargement du profil. Veuillez réessayer.');
      });
  }, [token, navigate]);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT', // Route pour mettre à jour le profil
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nom, prenom, classe }),
      });
      const data = await response.json();
      if (!response.ok) {
        setUpdateError(data.error || 'Erreur lors de la mise à jour du profil.');
      } else {
        setUpdateMessage('Profil mis à jour avec succès !');
        // Mise à jour du profil dans le state
        setProfile(prev => prev ? { ...prev, nom, prenom, classe } : null);
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour du profil:", err);
      setUpdateError('Erreur lors de la communication avec le serveur.');
    }
  };

  return (
    <div className="account-container">
      <h1>Bienvenue sur votre compte</h1>
      {error && <p className="error-message">{error}</p>}
      {profile ? (
        <>
          <p>Votre adresse email : {profile.email}</p>
          {(!profile.nom || !profile.prenom || !profile.classe) ? (
            <div className="update-form-container">
              <h2>Complétez votre profil</h2>
              <form onSubmit={handleProfileUpdate}>
                <div className="input-group">
                  <label htmlFor="nom">Nom :</label>
                  <input
                    type="text"
                    id="nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="prenom">Prénom :</label>
                  <input
                    type="text"
                    id="prenom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="classe">Classe :</label>
                  <input
                    type="text"
                    id="classe"
                    value={classe}
                    onChange={(e) => setClasse(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="update-button">Mettre à jour</button>
                {updateError && <p className="error-message">{updateError}</p>}
                {updateMessage && <p className="success-message">{updateMessage}</p>}
              </form>
            </div>
          ) : (
            <div className="profile-details">
              <h2>Votre profil</h2>
              <p><strong>Nom :</strong> {profile.nom}</p>
              <p><strong>Prénom :</strong> {profile.prenom}</p>
              <p><strong>Classe :</strong> {profile.classe}</p>
            </div>
          )}
        </>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default Account;
