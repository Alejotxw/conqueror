import React, { useState } from 'react';
import { Search, Shield, Car, Building, Database } from 'lucide-react';
import './SearchPage.css';

const SearchPage = ({ onSearch }) => {
    const [identifier, setIdentifier] = useState('');
    const [sources, setSources] = useState({
        sri: true,
        ant: true,
        property: true,
    });

    const handleSourceChange = (source) => {
        setSources(prev => ({ ...prev, [source]: !prev[source] }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!identifier.trim()) return;
        onSearch(identifier, sources);
    };

    return (
        <div className="search-container animate-fade-in">
            <header className="hero-section">
                <div className="logo-badge">
                    <Database size={32} className="text-primary" />
                </div>
                <h1 className="main-title">
                    <span className="gradient-text">CONQUEROR</span>
                </h1>
                <p className="subtitle">
                    Consolidated Open-Source Network for Querying and Extraction of Relevant Operational Intelligence
                </p>
            </header>

            <form onSubmit={handleSearch} className="search-form glass-card">
                <div className="input-group">
                    <Search className="input-icon" />
                    <input
                        type="text"
                        placeholder="Ingrese Cédula, RUC o Placa..."
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="sources-grid">
                    <label className={`source-item ${sources.sri ? 'active' : ''}`}>
                        <input
                            type="checkbox"
                            checked={sources.sri}
                            onChange={() => handleSourceChange('sri')}
                        />
                        <Shield size={20} />
                        <span>SRI</span>
                    </label>

                    <label className={`source-item ${sources.ant ? 'active' : ''}`}>
                        <input
                            type="checkbox"
                            checked={sources.ant}
                            onChange={() => handleSourceChange('ant')}
                        />
                        <Car size={20} />
                        <span>ANT</span>
                    </label>

                    <label className={`source-item ${sources.property ? 'active' : ''}`}>
                        <input
                            type="checkbox"
                            checked={sources.property}
                            onChange={() => handleSourceChange('property')}
                        />
                        <Building size={20} />
                        <span>Registro Propiedad</span>
                    </label>
                </div>

                <button type="submit" className="btn-primary w-full">
                    Buscar Información
                </button>
            </form>

            <footer className="search-footer">
                <p>Búsqueda segura y auditada bajo normativas OSINT</p>
            </footer>
        </div>
    );
};

export default SearchPage;
