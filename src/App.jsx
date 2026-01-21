import React, { useState } from 'react';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import './index.css';
import './App.css';
import { Loader2 } from 'lucide-react';

function App() {
  const [view, setView] = useState('search'); // search | loading | results
  const [results, setResults] = useState(null);

  const handleSearch = async (identifier, sources) => {
    setView('loading');

    try {
      const resultsData = { identifier, sri: null, ant: null, property: null };

      // Consulta SRI
      if (sources.sri) {
        try {
          const sriResponse = await fetch(`http://localhost:3001/consultar-sri?ruc=${identifier}`);
          const sriData = await sriResponse.json();
          if (sriData.estado === 'exitoso') {
            resultsData.sri = {
              razonSocial: sriData.datosContribuyente.razonSocial,
              ruc: sriData.ruc,
              estado: sriData.datosContribuyente.estado,
              actividad: sriData.datosContribuyente.actividadEconomicaPrincipal
            };
          }
        } catch (err) {
          console.error("Error consultando SRI:", err);
        }
      }

      // Consulta Registro de la Propiedad (RP)
      if (sources.property) {
        try {
          // Usamos la cédula (10 dígitos) o los primeros 10 del RUC
          const ci = identifier.length > 10 ? identifier.substring(0, 10) : identifier;
          const rpResponse = await fetch(`http://localhost:3001/consultar-rp?ci=${ci}`);
          const rpData = await rpResponse.json();
          if (rpData.success) {
            resultsData.property = {
              items: rpData.registros.map(reg => ({
                tipo: reg.tipo_estado,
                ubicacion: reg.detalle || "Loja (Referencia)"
              }))
            };
          }
        } catch (err) {
          console.error("Error consultando RP:", err);
        }
      }

      // ANT - Pendiente (Simulado por ahora)
      if (sources.ant) {
        resultsData.ant = {
          placa: identifier.length <= 7 ? identifier : "ABC-1234",
          propietario: "USUARIO CONSULTADO",
          multas: "0.00"
        };
      }

      setResults({ ...resultsData, selectedSources: sources });
      setView('results');
    } catch (error) {
      console.error("Error general en la búsqueda:", error);
      alert("Ocurrió un error al conectar con los servicios de scraping.");
      setView('search');
    }
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
