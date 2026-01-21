import React from 'react';
import { ChevronLeft, Download, Shield, Car, Building, ExternalLink } from 'lucide-react';
import './ResultsPage.css';

const ResultsPage = ({ results, onBack }) => {
    const selectedSources = results.selectedSources || { sri: true, ant: true, property: true };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `conqueror_results_${results.identifier}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

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
                <button onClick={handleExport} className="btn-primary flex-center gap-2">
                    <Download size={18} />
                    Exportar JSON
                </button>
            </header>

            <div className="results-grid">
                {/* SRI Card */}
                {selectedSources.sri && (
                    <div className="result-card glass-card">
                        <div className="card-header">
                            <Shield size={20} className="text-primary" />
                            <h3>Información SRI</h3>
                        </div>
                        <div className="card-body">
                            {results.sri ? (
                                <table className="results-table">
                                    <tbody>
                                        <tr>
                                            <th>Razón Social</th>
                                            <td>{results.sri.razonSocial}</td>
                                        </tr>
                                        <tr>
                                            <th>RUC</th>
                                            <td>{results.sri.ruc}</td>
                                        </tr>
                                        <tr>
                                            <th>Estado</th>
                                            <td><span className="status-badge">{results.sri.estado}</span></td>
                                        </tr>
                                        <tr>
                                            <th>Actividad</th>
                                            <td>{results.sri.actividad}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            ) : (
                                <p className="no-data">No se encontraron registros en SRI</p>
                            )}
                        </div>
                    </div>
                )}

                {/* ANT Card */}
                {selectedSources.ant && (
                    <div className="result-card glass-card">
                        <div className="card-header">
                            <Car size={20} className="text-primary" />
                            <h3>Información ANT</h3>
                        </div>
                        <div className="card-body">
                            {results.ant ? (
                                <table className="results-table">
                                    <tbody>
                                        <tr>
                                            <th>Placa</th>
                                            <td>{results.ant.placa}</td>
                                        </tr>
                                        <tr>
                                            <th>Propietario</th>
                                            <td>{results.ant.propietario}</td>
                                        </tr>
                                        <tr>
                                            <th>Multas</th>
                                            <td className="text-warning">${results.ant.multas}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            ) : (
                                <p className="no-data">No se encontraron registros en ANT</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Registro Propiedad Card */}
                {selectedSources.property && (
                    <div className="result-card glass-card">
                        <div className="card-header">
                            <Building size={20} className="text-primary" />
                            <h3>Registro Propiedad</h3>
                        </div>
                        <div className="card-body">
                            {results.property && results.property.items.length > 0 ? (
                                <table className="results-table">
                                    <thead>
                                        <tr>
                                            <th>Tipo/Estado</th>
                                            <th>Ubicación/Detalle</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.property.items.map((item, id) => (
                                            <tr key={id}>
                                                <td>{item.tipo}</td>
                                                <td>{item.ubicacion}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="no-data">No hay propiedades registradas</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsPage;
