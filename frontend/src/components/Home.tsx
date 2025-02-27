import { Link } from 'react-router-dom';
import '../styles/comptes.css';

const AccountsButton = () => {
  return (
    <Link to="/signup" className="accounts-button">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 12c2.7614 0 5-2.2386 5-5s-2.2386-5-5-5-5 2.2386-5 5 2.2386 5 5 5z"
          fill="var(--bs-primary)"
        />
        <path
          d="M2 22c0-4.4183 3.5817-8 8-8h4c4.4183 0 8 3.5817 8 8v1H2v-1z"
          fill="var(--bs-primary)"
        />
      </svg>
    </Link>
  );
};

const Home = () => (
  <div style={{ padding: '20px' }}>
    <h1>Bienvenue sur Repair Lycée</h1>
    <p>Nigger</p>
    
    {/* Bouton "Compte" */}
    <AccountsButton />
  </div>
);

export default Home;
