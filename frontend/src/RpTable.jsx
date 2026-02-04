
import React from 'react';

const RpTable = ({ registros }) => {
    if (!registros || registros.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '30px', color: '#718096', fontWeight: '500' }}>
                No se encontraron registros en el Registro de la Propiedad.
            </div>
        );
    }

    return (
        <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#003366', fontSize: '1.3rem', marginBottom: '15px' }}>Registros de Propiedad</h3>
            <div style={{ overflowX: 'auto', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                            <th style={tHead}>Estado</th>
                            <th style={tHead}>Nros</th>
                            <th style={tHead}>Fecha</th>
                            <th style={tHead}>Nombre / Propietario</th>
                            <th style={tHead}>Rol</th>
                            <th style={tHead}>Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registros.map((reg, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #edf2f7' }}>
                                <td style={tCell}>
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold',
                                        background: '#E2E8F0', color: '#4A5568'
                                    }}>
                                        {reg.tipo_estado}
                                    </span>
                                </td>
                                <td style={{ ...tCell, fontSize: '12px' }}>
                                    {reg.numero1}<br />{reg.numero2}
                                </td>
                                <td style={tCell}>{reg.fecha}</td>
                                <td style={{ ...tCell, color: '#003366', fontWeight: '700' }}>{reg.nombre}</td>
                                <td style={tCell}>{reg.rol}</td>
                                <td style={{ ...tCell, fontSize: '11px', color: '#718096' }}>{reg.detalle}</td>
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

export default RpTable;
