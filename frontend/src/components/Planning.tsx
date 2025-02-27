import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

interface PlanningItem {
  id: number; // Chaque planning doit posséder un identifiant unique
  date: string;
  disponibilite: string;
}

const Planning = () => {
  const { token } = useAuth();
  const [planningData, setPlanningData] = useState<PlanningItem[]>([]);
  const [editedData, setEditedData] = useState<PlanningItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // On recup admin par la backend
  useEffect(() => {
    if (token) {
      axios
        .get<{ isAdmin: boolean }>('http://localhost:5000/api/adm', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
            setIsAdmin(Boolean(response.data.isAdmin)); // Conversion => boolean
          })          
        .catch((err: unknown) =>
          console.error("Erreur de récupération du statut admin", err)
        );
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      axios
        .get<PlanningItem[]>('http://localhost:5000/api/planning', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setPlanningData(response.data);
          setEditedData(response.data);
        })
        .catch((err: unknown) =>
          console.error('Erreur de récupération du planning', err)
        );
    }
  }, [token]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (
    index: number,
    field: keyof PlanningItem,
    value: string
  ) => {
    const newData = [...editedData];
    newData[index] = { ...newData[index], [field]: value };
    setEditedData(newData);
  };

  const handleSave = () => {
    axios
      .put('http://localhost:5000/api/planning', editedData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setPlanningData(editedData);
        setIsEditing(false);
      })
      .catch((err: unknown) =>
        console.error('Erreur de mise à jour du planning', err)
      );
  };

  return (
    <div className="planning-container">
      <h1>Planning des Disponibilités</h1>

      {/* Bouton visible pour les admin */}
      {isAdmin && !isEditing && (
        <button onClick={handleEditToggle}>Modifier le planning</button>
      )}

      {isEditing && (
        <div>
          <button onClick={handleSave}>Enregistrer</button>
          <button onClick={handleEditToggle}>Annuler</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Disponibilité</th>
          </tr>
        </thead>
        <tbody>
          {(isEditing ? editedData : planningData).map((item, index) => (
            <tr key={item.id}>
              <td>
                {isEditing ? (
                  <input
                    type="date"
                    value={item.date}
                    onChange={(e) =>
                      handleChange(index, 'date', e.target.value)
                    }
                  />
                ) : (
                  item.date
                )}
              </td>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    value={item.disponibilite}
                    onChange={(e) =>
                      handleChange(index, 'disponibilite', e.target.value)
                    }
                  />
                ) : (
                  item.disponibilite
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Planning;
