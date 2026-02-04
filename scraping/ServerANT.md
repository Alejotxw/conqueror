import express from 'express';
import cors from 'cors';
import { scrapeSancionesPorCedula } from './ScrapingANTCitacionesFiltrado.js';
import { obtenerDatosRuc } from "./ScrapingSRI.js";

const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/consulta', (req, res) => {
  res.send(`
    <h2>Consultar placas registradas ANT</h2>
    <form method="post" action="/consulta">
      <label for="cedula">Cédula a consultar:</label>
      <input type="text" name="cedula" id="cedula" required>
      <button type="submit">Consultar</button>
      
    </form>
  `);
});

app.post('/consulta', async (req, res) => {
  const cedula = req.body.cedula;
  if (!cedula) {
    return res.send('<p>Debes ingresar una cédula</p>');
  }
  res.write('<h2>Sanciones registradas para la cédula:</h2>');
  try {
    const resultados = await scrapeSancionesPorCedula(cedula);
    
    if (resultados.error) {
      console.error('Error en scraping:', resultados.message);
      res.write(`<p>Error: ${resultados.message}</p>`);
      return res.end();
    }

    const sancionesPendientes = resultados.pendientes || [];
    const sancionesPagadas = resultados.pagadas || [];

    console.log('--- Sanciones asociadas ANT ---');
    
    // ========== MULTAS PENDIENTES ==========
console.log('\n=== MULTAS PENDIENTES ===');
if (sancionesPendientes.length === 0) {
  console.log('No tiene multas pendientes');
  res.write('<h3>Multas Pendientes</h3><p>No tiene multas pendientes.</p>');
} else {
  sancionesPendientes.forEach((s, i) => {
    console.log(`\n--- Multa Pendiente ${i + 1} ---`);
    console.log(`Placa: ${s.placa || 'No disponible'}`);
    console.log(`Total a pagar: $${s.totalPagar ? s.totalPagar.toFixed(2) : '0.00'}`);
    console.log(`Delito: ${s.delito || 'No disponible'}`);
    console.log(`Fecha Emisión: ${s.fechaEmision || 'No disponible'}`);
    console.log(`Fecha Notificación: ${s.fechaNotificacion || 'No disponible'}`);
  });

  res.write(`
    <h3>Multas Pendientes (${sancionesPendientes.length})</h3>
    <table border="1" cellpadding="8" style="border-collapse: collapse; margin-bottom: 20px; width: 100%; text-align: left;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th>Placa</th>
          <th>Total a Pagar</th>
          <th>Delito</th>
          <th>Fecha Emisión</th>
          <th>Fecha Notificación</th>
        </tr>
      </thead>
      <tbody>
  `);

  sancionesPendientes.forEach(s => {
    res.write(`
      <tr>
        <td>${s.placa || 'No disponible'}</td>
        <td>$${s.totalPagar ? s.totalPagar.toFixed(2) : '0.00'}</td>
        <td>${s.delito || 'No disponible'}</td>
        <td>${s.fechaEmision || 'No disponible'}</td>
        <td>${s.fechaNotificacion || 'No disponible'}</td>
      </tr>
    `);
  });

  res.write('</tbody></table>');
}

    // ========== MULTAS PAGADAS ==========
    console.log('\n=== MULTAS PAGADAS ===');
    if (sancionesPagadas.length === 0) {
      console.log('No tiene multas pagadas registradas');
      res.write('<h3>Multas Pagadas</h3><p>No tiene multas pagadas registradas.</p>');
    } else {
      sancionesPagadas.forEach((s, i) => {
        console.log(`\n--- Multa Pagada ${i + 1} ---`);
        console.log(`Placa: ${s.placa}`);
        console.log(`Total pagado: $${s.totalPagado.toFixed(2)}`);
        console.log(`Delito: ${s.delito}`);
        console.log(`Fecha Emisión: ${s.fechaEmision}`);
        console.log(`Fecha Notificación: ${s.fechaNotificacion}`);
        console.log(`Sanción: $${s.sancion.toFixed(2)}`);
        console.log(`Multa: $${s.multa.toFixed(2)}`);
        console.log(`Remisión: $${s.remision.toFixed(2)}`);
      });

      res.write(`
        <h3>Multas Pagadas (${sancionesPagadas.length})</h3>
        <table border="1" cellpadding="8" style="border-collapse: collapse;">
          <tr>
            <th>Placa</th>
            <th>Sanción</th>
            <th>Multa</th>
            <th>Remisión</th>
            <th>Total Pagado</th>
            <th>Delito</th>
            <th>Fecha Emisión</th>
            <th>Fecha Factura</th>
            <th>Fecha Notificación</th>
          </tr>
      `);
      sancionesPagadas.forEach(s => {
        res.write(`
          <tr>
            <td>${s.placa}</td>
            <td>$${s.sancion.toFixed(2)}</td>
            <td>$${s.multa.toFixed(2)}</td>
            <td>$${s.remision.toFixed(2)}</td>
            <td>$${s.totalPagado.toFixed(2)}</td>
            <td>${s.delito}</td>
            <td>${s.fechaEmision}</td>
            <td>${s.fechaNotificacion}</td>
          </tr>
        `);
      });
      res.write('</table>');
    }

    res.end();
  } catch (err) {
    console.error('Error scraping:', err);
    res.write(`<p>Error scraping: ${err.message}</p>`);
    res.end();
  }
});

// API para llamadas desde el frontend
app.get('/api', async (req, res) => {
  const cedula = req.query.cedula;
  if (!cedula) return res.json({ error: "Falta parámetro cedula" });
  
  try {
    const resultados = await scrapeSancionesPorCedula(String(cedula));
    
    if (resultados.error) {
      console.error('Error en scraping:', resultados.message);
      return res.status(500).json({ error: true, message: resultados.message });
    }

    const sancionesPendientes = resultados.pendientes || [];
    const sancionesPagadas = resultados.pagadas || [];

    // Log en consola
    console.log('\n=== MULTAS PENDIENTES ===');
    if (sancionesPendientes.length === 0) {
      console.log('No tiene multas pendientes (API)');
    } else {
      sancionesPendientes.forEach((s, i) => {
        console.log(`\n--- Multa Pendiente ${i + 1} ---`);
        console.log(`Placa: ${s.placa}`);
        console.log(`Total a pagar: $${s.totalPagar.toFixed(2)}`);
        console.log(`Delito: ${s.delito}`);
        console.log(`Fecha Emisión: ${s.fechaEmision}`);
        console.log(`Fecha Notificacion: ${s.fechaNotificacion}`);
      });
    }

    console.log('\n=== MULTAS PAGADAS ===');
    if (sancionesPagadas.length === 0) {
      console.log('No tiene multas pagadas (API)');
    } else {
      sancionesPagadas.forEach((s, i) => {
        console.log(`\n--- Multa Pagada ${i + 1} ---`);
        console.log(`Placa: ${s.placa}`);
        console.log(`Total pagado: $${s.totalPagado.toFixed(2)}`);
        console.log(`Delito: ${s.delito}`);
        console.log(`Fecha Emisión: ${s.fechaEmision}`);
        console.log(`Fecha Notificación: ${s.fechaNotificacion}`);
        console.log(`Sanción: $${s.sancion.toFixed(2)}`);
        console.log(`Multa: $${s.multa.toFixed(2)}`);
        console.log(`Remisión: $${s.remision.toFixed(2)}`);
      });
    }

    return res.json({
      pendientes: sancionesPendientes,
      pagadas: sancionesPagadas,
      totalPendientes: sancionesPendientes.length,
      totalPagadas: sancionesPagadas.length
    });
    
  } catch (err) {
    console.error('Error en /api:', err);
    return res.status(500).json({ 
      error: true, 
      message: String(err.message || err) 
    });
  }
});

app.listen(port, () =>
  console.log(`✅ Server scraping ANT en http://localhost:${port}/consulta`)
);
app.use(cors());

app.get("/consultar/SRI", async (req, res) => {
  try {
    const ruc = req.query.ruc;
    const data = await obtenerDatosRuc(ruc);

    console.log(data);
    res.json(data);

  } catch (error) {
    console.error("Error en /consultar/SRI:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
