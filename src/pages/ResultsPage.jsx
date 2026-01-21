import React from 'react';
import { ChevronLeft, Download, Shield, Car, Building, ExternalLink } from 'lucide-react';
import './ResultsPage.css';

const ResultsPage = ({ results, onBack, onExport }) => {
    return (
        <div className="results-container animate-fade-in">
            <header className="results-header">
                <button onClick={onBack} className="btn-icon">
                    <ChevronLeft size={24} />
                </button>
                <div className="header-info">
                    <h2>Resultados de Búsqueda</h2>
                    <p>Identificador: <span className="text-secondary">{results.identifier}</span></p>
                </div>
                <button onClick={onExport} className="btn-primary flex-center gap-2">
                    <Download size={18} />
                    Exportar
                </button>
            </header>

            <div className="results-grid">
                {/* SRI Card */}
                <div className="result-card glass-card">
                    <div className="card-header">
                        <Shield size={20} className="text-primary" />
                        <h3>Información SRI</h3>
                    </div>
                    <div className="card-body">
                        {results.sri ? (
                            <dl>
                                <div className="data-row">
                                    <dt>Razón Social</dt>
                                    <dd>{results.sri.razonSocial}</dd>
                                </div>
                                <div className="data-row">
                                    <dt>RUC</dt>
                                    <dd>{results.sri.ruc}</dd>
                                </div>
                                <div className="data-row">
                                    <dt>Estado</dt>
                                    <dd><span className="status-badge">{results.sri.estado}</span></dd>
                                </div>
                                <div className="data-row">
                                    <dt>Actividad</dt>
                                    <dd>{results.sri.actividad}</dd>
                                </div>
                            </dl>
                        ) : (
                            <p className="no-data">No se encontraron registros en SRI</p>
                        )}
                    </div>
                </div>

                {/* ANT Card */}
                <div className="result-card glass-card">
                    <div className="card-header">
                        <Car size={20} className="text-primary" />
                        <h3>Información ANT</h3>
                    </div>
                    <div className="card-body">
                        {results.ant ? (
                            <dl>
                                <div className="data-row">
                                    <dt>Placa</dt>
                                    <dd>{results.ant.placa}</dd>
                                </div>
                                <div className="data-row">
                                    <dt>Propietario</dt>
                                    <dd>{results.ant.propietario}</dd>
                                </div>
                                <div className="data-row">
                                    <dt>Multas Pendientes</dt>
                                    <dd className="text-warning">${results.ant.multas}</dd>
                                </div>
                            </dl>
                        ) : (
                            <p className="no-data">No se encontraron registros en ANT</p>
                        )}
                    </div>
                </div>

                {/* Registro Propiedad Card */}
                <div className="result-card glass-card">
                    <div className="card-header">
                        <Building size={20} className="text-primary" />
                        <h3>Registro Propiedad</h3>
                    </div>
                    <div className="card-body">
                        {results.property ? (
                            <div className="property-list">
                                {results.property.items.map((item, id) => (
                                    <div key={id} className="property-item">
                                        <p className="item-title">{item.tipo}</p>
                                        <p className="item-desc">{item.ubicacion}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-data">No hay propiedades registradas</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
