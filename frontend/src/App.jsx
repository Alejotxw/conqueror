import { useState } from 'react'
import EstablecimientosTable from './EstablecimientosTable';
import AntTable from './AntTable';
import RpTable from './RpTable';
import { jsPDF } from "jspdf";

// Elegant SVG Icons
const IconSRI = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
  </svg>
);

const IconANT = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.5C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" />
  </svg>
);

const IconRP = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" /><path d="M3 7v1a3 3 0 0 0 6 0V7m6 1v1a3 3 0 0 0 6 0V8M9 8h6" /><path d="M9 7c0-1.7 1.3-3 3-3s3 1.3 3 3v1H9V7Z" /><path d="M5 21V10.8c0-.8.6-1.5 1.4-1.5h11.2c.8 0 1.4.7 1.4 1.5V21" /><path d="M9 15h6" /><path d="M9 18h6" />
  </svg>
);

function App() {
  const [id, setId] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // State for concurrent results
  const [results, setResults] = useState({ sri: null, ant: null, rp: null });
  const [loading, setLoading] = useState({ sri: false, ant: false, rp: false });
  const [searched, setSearched] = useState(false); // To show "No results" or initial state
  const [showTableSRI, setShowTableSRI] = useState(false);
  const [globalError, setGlobalError] = useState(null); // Nuevo estado para error global

  const [aiLoading, setAiLoading] = useState(false);

  const handleAiAnalysis = async () => {
    setAiLoading(true);
    try {
      const response = await fetch('http://localhost:8000/consultar/analizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(results)
      });

      if (response.status === 429) {
        setGlobalError("Limite de consultas de IA excedido. Espere 2 minutos.");
        return;
      }

      const data = await response.json();
      // Limpiamos los asteriscos que a veces envía la IA por error
      const textoLimpio = data.analisis.replace(/\*\*/g, '');

      const doc = new jsPDF({
        orientation: 'p',
        unit: 'cm',
        format: 'letter'
      });

      const margin = 2.54; // Margen APA 7
      const pageWidth = 21.59;
      const contentWidth = pageWidth - (margin * 2);
      let cursorY = margin + 1;

      // 1. Numeración de página (Superior derecha)
      doc.setFont("times", "normal");
      doc.setFontSize(12);
      doc.text("1", 19, 1.5);

      // 2. Título del reporte (Negrita Real)
      doc.setFont("times", "bold");
      const tituloPrincipal = "Reporte de Análisis de Inteligencia de Datos";
      const titleWidth = doc.getTextWidth(tituloPrincipal);
      doc.text(tituloPrincipal, (pageWidth - titleWidth) / 2, cursorY);

      cursorY += 1.5; // Espaciado doble APA

      // 3. Procesamiento del cuerpo del texto
      doc.setFont("times", "normal");
      const parrafos = textoLimpio.split('\n');

      parrafos.forEach(parrafo => {
        if (parrafo.trim() === "") return;

        // Detectar si el párrafo parece un subtítulo (líneas cortas o mayúsculas)
        if (parrafo.length < 60 && !parrafo.endsWith('.')) {
          doc.setFont("times", "bold");
        } else {
          doc.setFont("times", "normal");
        }

        const lineas = doc.splitTextToSize(parrafo, contentWidth);

        lineas.forEach(linea => {
          if (cursorY > 25) {
            doc.addPage();
            cursorY = margin;
            // Numerar nuevas páginas
            doc.setFont("times", "normal");
            doc.text(`${doc.internal.getNumberOfPages()}`, 19, 1.5);
          }
          doc.text(linea, margin, cursorY);
          cursorY += 0.7; // Interlineado APA 7
        });
        cursorY += 0.3; // Espacio entre párrafos
      });

      doc.save(`Reporte_APA_${id}.pdf`);

    } catch (error) {
      console.error(error);
      alert("Error al generar el PDF");
    } finally {
      setAiLoading(false);
    }
  };

  const fetchData = async (url, key) => {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        // En lugar de guardar el error en results, activamos el error global
        setGlobalError("Limite de seguridad alcanzado (3 intentos). Por favor espere 2 minutos.");
        return;
      }
      if (!res.ok) throw new Error("Error en la petición");
      const data = await res.json();
      setResults(prev => ({ ...prev, [key]: data }));
    } catch (err) {
      setResults(prev => ({ ...prev, [key]: { error: true, message: "Error consultando servicio" } }));
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleSearch = () => {
    if (!id) return alert("Por favor ingresa un número de identificación");

    setSearched(true);
    setGlobalError(null); // Reset global error
    // Reset previous results and set loading
    setResults({ sri: null, ant: null, rp: null });
    setLoading({ sri: true, ant: true, rp: true });
    setShowTableSRI(false);

    // Fetch All Concurrent
    fetchData(`http://localhost:8000/consultar/sri/${id}`, 'sri');
    fetchData(`http://localhost:8000/consultar/ant/${id}`, 'ant');
    fetchData(`http://localhost:8000/consultar/rp/${id}`, 'rp');
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>

      {/* Legal Disclaimer Modal */}
      {showDisclaimer && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div className="glass-card" style={{
            maxWidth: '600px', width: '100%', padding: '40px', textAlign: 'center',
            border: '2px solid rgba(255, 140, 0, 0.4)',
            boxShadow: '0 0 30px rgba(255, 140, 0, 0.2)'
          }}>
            <h2 style={{ color: '#FF8C00', fontSize: '2rem', marginBottom: '20px', fontWeight: '900' }}>TÉRMINOS Y CONDICIONES</h2>
            <div style={{
              color: '#003366', fontSize: '1.1rem', lineHeight: '1.6',
              marginBottom: '30px', textAlign: 'justify', fontWeight: '600'
            }}>
              <p>Este sistema es para fines estrictamente informativos y de investigación estratégica. Al utilizar esta herramienta, usted acepta que:</p>
              <ul style={{ paddingLeft: '20px' }}>
                <li>Los desarrolladores <strong>no se responsabilizan</strong> por el uso ilegal o inapropiado de la información obtenida.</li>
                <li>Usted es el único responsable de las acciones realizadas con los datos consultados.</li>
                <li>Este software se proporciona "tal cual", sin garantías sobre la exactitud de los datos externos (SRI, ANT, RP).</li>
              </ul>
            </div>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="uide-btn active"
              style={{ width: '100%', padding: '15px', fontSize: '1.2rem', height: 'auto' }}
            >
              ACEPTO Y ENTIENDO LOS RIESGOS
            </button>
          </div>
        </div>
      )}

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
      <div style={{ width: '100%', maxWidth: '1600px', margin: '0 auto', padding: '40px 30px' }}>

        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            display: 'inline-flex', padding: '10px 20px',
            background: 'white', borderRadius: '50px',
            boxShadow: '0 4px 15px rgba(255, 140, 0, 0.3)',
            marginBottom: '20px', fontSize: '15px', fontWeight: '800',
            color: '#FF8C00', border: '1px solid #FF8C00'
          }}>
            O S I N T
          </div>

          <h1 className="neon-title" style={{ fontSize: '4.5rem', margin: '0 0 10px', textTransform: 'uppercase' }}>CONQUEROR</h1>
          <p style={{
            color: '#000000', fontSize: '1.5rem', fontWeight: '900',
            letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 40px',
            textShadow: '2px 2px 0px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.8)'
          }}>
            Soberanía informativa para la defensa estratégica
          </p>

          <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px', display: 'flex', gap: '20px' }}>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Ingrese Cédula o RUC..."
              className="glass-input-light"
              style={{ flex: 1, textAlign: 'center', fontSize: '1.2rem' }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="uide-btn active"
              style={{ padding: '0 30px', fontSize: '1.1rem', whiteSpace: 'nowrap' }}
            >
              CONSULTAR
            </button>
          </div>
        </div>

        {/* Global Error Message */}
        {globalError && (
          <div style={{
            maxWidth: '800px', margin: '0 auto 40px', padding: '20px',
            background: 'rgba(255, 245, 245, 0.9)', border: '2px solid #FC8181',
            borderRadius: '15px', textAlign: 'center',
            boxShadow: '0 5px 15px rgba(197, 48, 48, 0.2)',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            <h3 style={{ color: '#C53030', margin: '0 0 10px', fontSize: '1.5rem' }}>ACCESO DENEGADO TEMPORALMENTE</h3>
            <p style={{ color: '#2D3748', fontSize: '1.1rem', fontWeight: '600' }}>
              {globalError}
            </p>
          </div>
        )}

        {searched && !globalError && !loading.sri && !loading.ant && !loading.rp && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', animation: 'fadeIn 0.8s ease-out' }}>
            <button
              onClick={handleAiAnalysis}
              disabled={aiLoading}
              className="uide-btn"
              style={{
                background: 'linear-gradient(135deg, #003366 0%, #001a33 100%)',
                color: 'white',
                padding: '15px 40px',
                borderRadius: '15px',
                fontSize: '1.2rem',
                fontWeight: '800',
                boxShadow: '0 10px 20px rgba(0, 51, 102, 0.3)',
                border: 'none',
                cursor: aiLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}
            >
              {aiLoading ? (
                <div style={{ width: '20px', height: '20px', border: '3px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              ) : '🤖'}
              {aiLoading ? 'ANALIZANDO PERFIL...' : 'GENERAR REPORTE DE INTELIGENCIA (IA)'}
            </button>
          </div>
        )}

        {/* Services Preview (Initial State) */}
        {!searched && (
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '60px', marginTop: '60px',
            animation: 'fadeIn 1s ease-out'
          }}>
            <ServicePreview icon={<IconSRI />} label="SRI" sub="Rentas Internas" />
            <ServicePreview icon={<IconANT />} label="ANT" sub="Tránsito y Multas" />
            <ServicePreview icon={<IconRP />} label="REG. PROPIEDAD" sub="Bienes Inmuebles" />
          </div>
        )}

        {/* Results Dashboard Grid */}
        {searched && !globalError && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
            gap: '40px',
            animation: 'fadeIn 0.5s ease-out'
          }}>

            {/* SRI Card */}
            <ResultCard title="SRI - Servicios de Rentas Internas" icon={<IconSRI />} loading={loading.sri}>
              {results.sri && results.sri.ruc ? (
                <>
                  <div style={{ marginBottom: '15px' }}>
                    <h3 style={{ color: '#003366', fontSize: '1.2rem', margin: '0 0 10px' }}>{results.sri.datosContribuyente?.razonSocial}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <DataBox label="RUC" value={results.sri.ruc} />
                      <DataBox label="Estado" value={results.sri.datosContribuyente?.estado} />
                      <DataBox label="Tipo" value={results.sri.datosContribuyente?.tipoContribuyente} />
                      <DataBox label="Clase" value={results.sri.datosContribuyente?.claseRegistrada} />
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTableSRI(!showTableSRI)}
                    className="uide-btn-secondary"
                    style={{ width: '100%', fontSize: '0.9rem', padding: '8px' }}
                  >
                    {showTableSRI ? 'Ocultar Establecimientos' : `Ver Establecimientos (${results.sri.establecimientos?.length || 0})`}
                  </button>
                  {showTableSRI && <div style={{ marginTop: '15px' }}><EstablecimientosTable establecimientos={results.sri.establecimientos} /></div>}
                </>
              ) : results.sri?.error ? (
                <ErrorMessage msg={results.sri.message || "Error consultando SRI"} />
              ) : (loading.sri ? null : <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No se encontraron datos en el SRI</div>)}
            </ResultCard>

            {/* ANT Card */}
            <ResultCard title="ANT - Agencia Nacional de Tránsito" icon={<IconANT />} loading={loading.ant}>
              {results.ant && Array.isArray(results.ant) && results.ant.length > 0 ? (
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  <AntTable citations={results.ant} />
                </div>
              ) : results.ant?.error ? (
                <ErrorMessage msg={results.ant.message || "Error consultando ANT"} />
              ) : (loading.ant ? null : <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No registra citaciones o datos en ANT</div>)}
            </ResultCard>

            {/* Registro Propiedad Card */}
            <ResultCard title="Registro de la Propiedad" icon={<IconRP />} loading={loading.rp}>
              {results.rp && (results.rp.registros?.length > 0 || Array.isArray(results.rp) && results.rp.length > 0) ? (
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  <RpTable registros={results.rp.registros || results.rp} />
                </div>
              ) : results.rp?.error ? (
                <ErrorMessage msg={results.rp.message || "Error consultando Registro de la Propiedad"} />
              ) : (loading.rp ? null : <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No registra propiedades</div>)}
            </ResultCard>

          </div>
        )}

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .uide-btn-secondary {
          background: #fff;
          color: var(--uide-orange);
          border: 1px solid var(--uide-orange);
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .uide-btn-secondary:hover { background: var(--uide-orange); color: white; }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 140, 0, 0.5);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 140, 0, 0.8);
        }

        .result-card {
           background: rgba(255, 255, 255, 0.75);
           backdrop-filter: blur(10px);
           border-radius: 20px;
           border: 1px solid rgba(255, 255, 255, 0.8);
           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
           display: flex;
           flex-direction: column;
           overflow: hidden;
           transition: transform 0.3s ease;
        }
        .result-card:hover { transform: translateY(-5px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
        
        .card-header {
           background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,244,248,0.9));
           padding: 15px 20px;
           border-bottom: 1px solid rgba(0,0,0,0.05);
           display: flex;
           align-items: center;
           gap: 12px;
        }
        .card-body { padding: 20px; flex: 1; }

        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(15px);
          border-radius: 25px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 15px 35px rgba(0, 51, 102, 0.1);
        }
      `}</style>
    </div>
  )
}

const ResultCard = ({ title, icon, loading, children }) => (
  <div className="result-card">
    <div className="card-header">
      <div style={{ color: '#FF8C00' }}>{icon}</div>
      <h3 style={{ margin: 0, fontSize: '1rem', color: '#003366', fontWeight: '800' }}>{title}</h3>
    </div>
    <div className="card-body" style={{ position: 'relative' }}>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div style={{
            width: '30px', height: '30px',
            border: '3px solid #ccc', borderTopColor: '#FF8C00',
            borderRadius: '50%', animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{ marginTop: '10px', fontSize: '0.85rem', color: '#666' }}>Consultando...</span>
        </div>
      ) : children}
    </div>
  </div>
);

const DataBox = ({ label, value }) => (
  <div style={{ background: 'rgba(255,255,255,0.5)', padding: '8px', borderRadius: '8px' }}>
    <div style={{ fontSize: '10px', fontWeight: '800', color: '#718096', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</div>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#003366', wordBreak: 'break-word' }}>{value || '-'}</div>
  </div>
);

const ErrorMessage = ({ msg }) => (
  <div style={{
    padding: '15px', background: '#FFF5F5', border: '1px solid #FC8181',
    borderRadius: '8px', color: '#C53030', fontSize: '0.9rem', textAlign: 'center'
  }}>
    ⚠️ {msg}
  </div>
);

const ServicePreview = ({ icon, label, sub }) => (
  <div style={{ textAlign: 'center', transition: 'transform 0.3s' }}>
    <div style={{
      background: 'white',
      width: '90px', height: '90px', borderRadius: '24px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 15px', border: 'none',
      boxShadow: '0 10px 25px rgba(0, 51, 102, 0.15)'
    }}>
      <div style={{ color: '#FF8C00' }}>{icon}</div>
    </div>
    <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#FF8C00', letterSpacing: '0.5px', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{label}</div>
    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#003366', marginTop: '4px' }}>{sub}</div>
  </div>
);

export default App