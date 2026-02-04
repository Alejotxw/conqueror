import express from 'express';
import { scrapeANTcitations } from './ScrapingANT.js';
import { obtenerDatosci } from './ScrapingRP.js';
import { obtenerDatosRuc } from './ScrapingSRI.js';

const app = express();
app.use(express.json());

const PORT = 3001;

// Endpoint para ANT
// server.js
// En server.js (Node.js)
app.get('/api/ant/:cedula', async (req, res) => {
  try {
    const data = await scrapeANTcitations(req.params.cedula);
    // Si data devuelve un error de los archivos originales
    if (data.error) {
      return res.status(500).json(data);
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Endpoint para Registro de la Propiedad
app.get('/api/rp/:cedula', async (req, res) => {
    const data = await obtenerDatosci(req.params.cedula);
    res.json(data);
});

// Endpoint para SRI
app.get('/api/sri/:ruc', async (req, res) => {
    const data = await obtenerDatosRuc(req.params.ruc);
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`🚀 Scraping Service running on http://localhost:${PORT}`);
});