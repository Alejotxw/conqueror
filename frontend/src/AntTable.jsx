
import React from 'react';

const AntTable = ({ citations }) => {
    if (!citations || citations.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '30px', color: '#718096', fontWeight: '500' }}>
                No se encontraron citaciones pendientes.
            </div>
        );
    }

    return (
        <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#003366', fontSize: '1.3rem', marginBottom: '15px' }}>Historial de Citaciones (ANT)</h3>
            <div style={{ overflowX: 'auto', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                            <th style={tHead}>Estado</th>
                            <th style={tHead}>Placa</th>
                            <th style={tHead}>Sanción</th>
                            <th style={tHead}>Total a Pagar</th>
                            <th style={tHead}>Infracción / Concepto</th>
                            <th style={tHead}>Emisión</th>
                        </tr>
                    </thead>
                    <tbody>
                        {citations.map((item, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #edf2f7' }}>
                                <td style={tCell}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: '800',
                                        background: item.estado === 'PAGADAS' ? 'rgba(72, 187, 120, 0.1)' : 'rgba(229, 62, 62, 0.1)',
                                        color: item.estado === 'PAGADAS' ? '#2f855a' : '#c53030',
                                        border: item.estado === 'PAGADAS' ? '1px solid #48bb78' : '1px solid #e53e3e'
                                    }}>
                                        {item.estado === 'PAGADAS' ? 'PAGADA' : 'PENDIENTE'}
                                    </span>
                                </td>
                                <td style={tCell}><strong>{item.placa}</strong></td>
                                <td style={{ ...tCell, color: '#4A5568', fontWeight: '600' }}>
                                    ${item.valorSancion?.toFixed(2)}
                                </td>
                                <td style={{ ...tCell, color: item.totalPagar > 0 ? '#e53e3e' : '#718096', fontWeight: '800' }}>
                                    ${item.totalPagar?.toFixed(2)}
                                </td>
                                <td style={{ ...tCell, fontSize: '12px', maxWidth: '300px' }}>{item.delito}</td>
                                <td style={{ ...tCell, fontSize: '12px' }}>{item.fechaEmision}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const tHead = { padding: '15px', textAlign: 'left', fontSize: '12px', color: '#4A5568', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tCell = { padding: '15px', fontSize: '14px', color: '#2D3748' };

export default AntTable;
