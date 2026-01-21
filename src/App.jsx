import React, { useState } from 'react';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import './index.css';
import './App.css';
import { Loader2 } from 'lucide-react';

function App() {
  const [view, setView] = useState('search'); // search | loading | results
  const [results, setResults] = useState(null);

  const handleSearch = (identifier, sources) => {
    setView('loading');

    // Simular el proceso de scraping (incluyendo el rate limit ético de 12s)
    setTimeout(() => {
      const mockResults = {
        identifier,
        sri: sources.sri ? {
          razonSocial: "EMPRESA DE PRUEBA S.A.",
          ruc: identifier.length === 13 ? identifier : identifier + "001",
          estado: "ACTIVO",
          actividad: "VENTA DE PRODUCTOS TECNOLÓGICOS"
        } : null,
        ant: sources.ant ? {
          placa: identifier.length <= 7 ? identifier : "ABC-1234",
          propietario: "JUAN PEREZ",
          multas: "45.50"
        } : null,
        property: sources.property ? {
          items: [
            { tipo: "Departamento", ubicacion: "Quito, Sector Carolina" },
            { tipo: "Terreno", ubicacion: "Valle de los Chillos" }
          ]
        } : null
      };

      setResults(mockResults);
      setView('results');
    }, 3000);
  };

  return (
    <div className="app-container">
      {view === 'search' && (
        <SearchPage onSearch={handleSearch} />
      )}

      {view === 'loading' && (
        <div className="loading-screen animate-fade-in">
          <Loader2 className="spinner text-primary" size={64} />
          <h2 className="gradient-text">Consultando Fuentes...</h2>
          <p>Respetando Rate Limiting ético (12 segundos)</p>
          <div className="progress-bar-container">
            <div className="progress-bar-fill"></div>
          </div>
        </div>
      )}

      {view === 'results' && results && (
        <ResultsPage
          results={results}
          onBack={() => setView('search')}
          onExport={() => alert('Exportando datos...')}
        />
      )}
    </div>
  );
}

export default App;
