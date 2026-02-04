
import React from 'react';

const EstablecimientosTable = ({ establecimientos }) => {
  if (!establecimientos || establecimientos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '30px', color: '#718096', fontWeight: '500' }}>
        No se encontraron establecimientos registrados.
      </div>
    );
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ color: '#003366', fontSize: '1.3rem', marginBottom: '15px' }}>Lista de Establecimientos</h3>
      <div style={{ overflowX: 'auto', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={tHead}>ID</th>
              <th style={tHead}>Nombre Comercial</th>
              <th style={tHead}>Ubicación</th>
              <th style={tHead}>Estado</th>
              <th style={tHead}>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {establecimientos.map((est, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #edf2f7' }}>
                <td style={tCell}><strong>{est.numEstablecimiento}</strong></td>
                <td style={{ ...tCell, color: '#003366', fontWeight: '600' }}>{est.nombre || 'Sin Nombre'}</td>
                <td style={{ ...tCell, fontSize: '12px' }}>{est.ubicacion}</td>
                <td style={tCell}>
                  <span style={{
                    padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 'bold',
                    background: est.estado === 'ABIERTO' ? '#C6F6D5' : '#FED7D7',
                    color: est.estado === 'ABIERTO' ? '#22543D' : '#822727'
                  }}>
                    {est.estado}
                  </span>
                </td>
                <td style={tCell}>{est.tipoEstablecimiento}</td>
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

export default EstablecimientosTable;
