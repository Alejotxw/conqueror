import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [type, setType] = useState('cedula');
  const [value, setValue] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/search', { type, value });
      setResults(response.data);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>CONQUEROR - Buscador de Datos</h1>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="cedula">Cédula</option>
        <option value="ruc">RUC</option>
      </select>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ingresa cédula o RUC"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
      {results && (
        <div>
          <h2>Resultados:</h2>
          <pre>{JSON.stringify(results, null, 2)}</pre> {/* Visualiza JSON; mejora con tablas/componentes */}
        </div>
      )}
    </div>
  );
}

export default App;