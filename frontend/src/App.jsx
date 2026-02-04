
import { useState } from 'react'
import EstablecimientosTable from './EstablecimientosTable';
import AntTable from './AntTable';
import RpTable from './RpTable';

// Elegant SVG Icons
const IconSRI = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
  </svg>
);

const IconANT = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.5C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" />
  </svg>
);

const IconRP = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" /><path d="M3 7v1a3 3 0 0 0 6 0V7m6 1v1a3 3 0 0 0 6 0V8M9 8h6" /><path d="M9 7c0-1.7 1.3-3 3-3s3 1.3 3 3v1H9V7Z" /><path d="M5 21V10.8c0-.8.6-1.5 1.4-1.5h11.2c.8 0 1.4.7 1.4 1.5V21" /><path d="M9 15h6" /><path d="M9 18h6" />
  </svg>
);

function App() {
  const [id, setId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [showTable, setShowTable] = useState(false); // State for collapsible table

  const fetchData = async (tipo) => {
    if (!id) return alert("Por favor ingresa un número de identificación");
    setLoading(true);
    setActiveTab(tipo);
    setData(null);
    setShowTable(false); // Reset toggle on new search
    try {
      const res = await fetch(`http://localhost:8000/consultar/${tipo}/${id}`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      alert("Error al consultar el servicio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>

      {/* Side Neon Glows */}
      <div className="side-light-orange"></div>
      <div className="side-light-blue"></div>

      {/* Background Image */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, width: '100%', height: '100%',
        backgroundImage: 'url("/bg-hero.png")',
        backgroundSize: 'cover', backgroundPosition: 'center',
        zIndex: -2
      }}></div>

      {/* Light Gradient Overlay */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, width: '100%', height: '100%',
        background: 'linear-gradient(rgba(255, 255, 255, 0.3), rgba(240, 244, 248, 0.6))',
        backdropFilter: 'blur(3px)',
        zIndex: -1
      }}></div>

      {/* Main Content */}
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>

        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex', padding: '12px 24px',
            background: 'white', borderRadius: '50px',
            boxShadow: '0 4px 15px rgba(255, 140, 0, 0.3)',
            marginBottom: '30px', fontSize: '14px', fontWeight: '800',
            color: '#FF8C00', border: '1px solid #FF8C00'
          }}>
            SISTEMA SCRAPING WEB
          </div>

          <h1 className="neon-title" style={{ fontSize: '5rem', margin: '0 0 20px', textTransform: 'uppercase' }}>CONQUEROR</h1>
          <p style={{ color: '#003366', fontWeight: '700', fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto 40px', letterSpacing: '1px' }}>
            Inteligencia Operativa y Extracción de Datos
          </p>

          <div className="glass-card" style={{ maxWidth: '750px', margin: '0 auto', padding: '40px' }}>
            <div style={{ position: 'relative', marginBottom: '30px' }}>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Ingrese Cédula o RUC para consultar..."
                className="glass-input-light"
                style={{ width: '100%', boxSizing: 'border-box', textAlign: 'center' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <button
                onClick={() => fetchData('sri')}
                className={`uide-btn ${activeTab === 'sri' ? 'active' : ''}`}
              >
                <div style={{ marginBottom: '10px' }}>
                  <IconSRI />
                </div>
                <strong>SRI</strong>
              </button>
              <button
                onClick={() => fetchData('ant')}
                className={`uide-btn ${activeTab === 'ant' ? 'active' : ''}`}
              >
                <div style={{ marginBottom: '10px' }}>
                  <IconANT />
                </div>
                <strong>ANT</strong>
              </button>
              <button
                onClick={() => fetchData('rp')}
                className={`uide-btn ${activeTab === 'rp' ? 'active' : ''}`}
              >
                <div style={{ marginBottom: '10px' }}>
                  <IconRP />
                </div>
                <strong>REG. PROP</strong>
              </button>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{
              display: 'inline-block', width: '40px', height: '40px',
              border: '4px solid #FF8C00', borderTopColor: 'transparent',
              borderRadius: '50%', animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '15px', fontWeight: '800', color: '#003366', textShadow: '0 0 10px rgba(255,255,255,0.8)' }}>Sincronizando con Entidades Públicas...</p>
          </div>
        )}

        {/* Results Area */}
        {data && (
          <div className="glass-card" style={{ padding: '40px', marginTop: '30px', animation: 'fadeIn 0.4s ease-out' }}>

            {/* SRI Result View */}
            {activeTab === 'sri' && data.ruc ? (
              <div>
                <div style={{
                  background: 'rgba(255, 140, 0, 0.05)', padding: '30px',
                  borderRadius: '20px', borderLeft: '8px solid #FF8C00',
                  marginBottom: '30px'
                }}>
                  <h2 style={{ color: '#003366', fontSize: '1.8rem', margin: '0 0 20px' }}>{data.datosContribuyente?.razonSocial}</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px' }}>
                    <DataBox label="Numero de RUC" value={data.ruc} />
                    <DataBox label="Estado Tributario" value={data.datosContribuyente?.estado} />
                    <DataBox label="Tipo Contribuyente" value={data.datosContribuyente?.tipoContribuyente} />
                    <DataBox label="Actividad Económica" value={data.datosContribuyente?.actividadEconomicaPrincipal} />
                  </div>
                </div>

                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                  <button onClick={() => setShowTable(!showTable)} className="uide-btn-secondary">
                    {showTable ? 'Ocultar Establecimientos ↑' : `Mostrar Establecimientos (${data.establecimientos?.length || 0}) ↓`}
                  </button>
                </div>
                {showTable && <EstablecimientosTable establecimientos={data.establecimientos} />}
              </div>
            )

              /* ANT Result View */
              : activeTab === 'ant' && Array.isArray(data) ? (
                <AntTable citations={data} />
              )

                /* Registro Propiedad Result View */
                : activeTab === 'rp' && (data.registros || Array.isArray(data)) ? (
                  <RpTable registros={data.registros || data} />
                )

                  /* Generic / Error View */
                  : (
                    <pre style={{
                      background: '#f8fafc', padding: '25px', borderRadius: '15px',
                      border: '1px solid #e2e8f0', color: '#334155', fontSize: '13px', overflow: 'auto'
                    }}>
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .uide-btn-secondary {
          background: var(--uide-orange);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 800;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
          box-shadow: 0 4px 15px rgba(255, 140, 0, 0.2);
        }
        .uide-btn-secondary:hover { transform: scale(1.05); }
      `}</style>
    </div>
  )
}

const DataBox = ({ label, value }) => (
  <div>
    <div style={{ fontSize: '11px', fontWeight: '800', color: '#718096', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: '15px', fontWeight: '600', color: '#003366' }}>{value || 'No registra'}</div>
  </div>
);

export default App