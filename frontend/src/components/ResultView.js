import React, { useState } from 'react';

const ResultView = ({ data }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!data) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/consultar/analizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      
      const blob = new Blob([result.analisis], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = "reporte_ia.txt";
      link.click();
    } catch (error) {
      alert("Error al conectar con el servidor de IA");
    } finally {
      setLoading(false);
    }
  };

  // IMPORTANTE: Si data es null, el componente no dibuja nada. 
  // Quita esta validación temporalmente para ver si el botón aparece.
  return (
    
    <div className="results-container" style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px' }}>
      <h3>Panel de Análisis IA</h3>
      {data ? (
        <pre style={{ background: '#f4f4f4', padding: '10px' }}>
          Datos listos para analizar...
        </pre>
      ) : (
        <p>Esperando datos de búsqueda...</p>
      )}

      <button 
        onClick={handleDownload} 
        disabled={loading}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          cursor: 'pointer',
          borderRadius: '5px'
        }}
      >
        {loading ? "Analizando..." : "Generar Informe con DeepSeek"}
      </button>
    </div>
  );
};

export default ResultView;