import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

interface PlanningItem {
  id: number;
  date: string;
  disponibilite: string;
}

const Planning = () => {
  const { token } = useAuth();
  const [planningData, setPlanningData] = useState<PlanningItem[]>([]);
  const [editedData, setEditedData] = useState<PlanningItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filterDate, setFilterDate] = useState<string>('');

  // Récupération du statut admin
  useEffect(() => {
    if (token) {
      axios
        .get<{ isAdmin: boolean }>('http://localhost:5000/api/adm', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setIsAdmin(response.data.isAdmin))
        .catch((err) => console.error("Erreur récupération statut admin", err));
    }
  }, [token]);

  // Récupération du planning
  useEffect(() => {
    if (token) {
      axios
        .get<PlanningItem[]>('http://localhost:5000/api/planning', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("📥 Planning reçu :", response.data);
          setPlanningData(response.data);
          setEditedData([...response.data]); // Cloner les données pour édition
        })
        .catch((err) => console.error('Erreur récupération planning', err));
    }
  }, [token]);

  // Active/Désactive le mode édition
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedData([...planningData]); // Reset en cas d'annulation
  };

  // Ajout d'une nouvelle ligne
  const handleAddRow = () => {
    const newRow: PlanningItem = { id: Date.now(), date: '', disponibilite: '' };
    setEditedData([...editedData, newRow]);
  };

  // Modification des données éditables
  const handleChange = (id: number, field: keyof PlanningItem, value: string) => {
    setEditedData(prevData => {
      const updatedData = prevData.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      );
      console.log("✏️ Mise à jour editedData :", updatedData);
      return updatedData;
    });
  };

  // Enregistrement des modifs
  const handleSave = () => {
    const newEntries = editedData.filter(item => 
      !planningData.some(data => data.id === item.id) && item.date !== '' && item.disponibilite !== ''
    );
    const modifiedData = editedData.filter((item) => 
      item.date !== '' && item.disponibilite !== '' && (
        item.date !== planningData.find(data => data.id === item.id)?.date ||
        item.disponibilite !== planningData.find(data => data.id === item.id)?.disponibilite
      )
    );

    const dataToSave = [...newEntries, ...modifiedData];

    console.log("État final de dataToSave :", dataToSave);

    if (dataToSave.length === 0) {
      console.warn("Aucun changement détecté !");
      return;
    }

    axios
      .put('http://localhost:5000/api/planning', dataToSave, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
      .then(() => {
        console.log("✅ Planning mis à jour !");
        setPlanningData([...editedData]); // Appliquer les changements
        setIsEditing(false);
      })
      .catch((err) => console.error('Erreur mise à jour planning', err));
  };

  // Filtrage des données par date
  const filteredData = filterDate
    ? (isEditing ? editedData : planningData).filter(item => item.date === filterDate)
    : isEditing ? editedData : planningData;

  return (
    <div className="planning-container">
      <h1>Planning des Disponibilités</h1>

      {/* Filtrage par date */}
      <div className="filter-container">
        <label htmlFor="filter-date">Filtrer par date :</label>
        <input
          type="date"
          id="filter-date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {/* Boutons pour administrateurs */}
      {isAdmin && !isEditing && <button onClick={handleEditToggle}>Modifier</button>}

      {isEditing && (
        <div>
          <button onClick={handleSave}>Enregistrer</button>
          <button onClick={handleEditToggle}>Annuler</button>
          <button onClick={handleAddRow}>Ajouter une ligne</button>
        </div>
      )}

      {filteredData.length === 0 ? (
        <p>Aucun planning trouvé.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Disponibilité</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>
                  {isEditing ? (
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) => handleChange(item.id, 'date', e.target.value)}
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
                      onChange={(e) => handleChange(item.id, 'disponibilite', e.target.value)}
                    />
                  ) : (
                    item.disponibilite
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Planning;
