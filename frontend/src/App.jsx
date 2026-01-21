import React, { useState } from 'react';
import ConsultaCI from './components/ConsultaCI';
import ConsultaRUC from './components/ConsultaRUC';
import './App.css';

function App() {
  // Estado para controlar qué pestaña está activa
  const [activeTab, setActiveTab] = useState('ci');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Consultas</h1>
        <p>Consulta de Registro de la Propiedad y SRI</p>
      </header>

      <main className="App-main">
        <div className="tab-container">
          <div className="tab-buttons">
            <button
              className={activeTab === 'ci' ? 'active' : ''}
              onClick={() => setActiveTab('ci')}
            >
              Consulta por Cédula (Registro de la Propiedad)
            </button>
            <button
              className={activeTab === 'ruc' ? 'active' : ''}
              onClick={() => setActiveTab('ruc')}
            >
              Consulta por RUC (SRI)
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'ci' && <ConsultaCI />}
            {activeTab === 'ruc' && <ConsultaRUC />}
          </div>
        </div>
      </main>

      <footer className="App-footer">
        <p>Sistema de Consultas - Registro de la Propiedad y SRI</p>
      </footer>
    </div>
  );
}

export default App;