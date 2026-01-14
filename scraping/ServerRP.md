// Usar sintaxis 'import' para ESM (debido a "type": "module")
import express from 'express'
import cors from 'cors'
import { obtenerDatosci } from './ScrapingRP.js'; // Asegúrate que ScrapingRP.js exporta 'obtenerDatosci'

const app = express();
const port = 3031; 

// Habilita CORS (solo necesitas llamarlo una vez)
app.use(cors());
app.use(express.json());

// Manejo global de errores para evitar que el proceso termine silenciosamente
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && (err.stack || err.message || String(err)));
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.get('/consultar/:ci', async (req, res) => {
  // Accept CI either as query param (?ci=...) or path param (/consultar/:ci)
  const ci = req.query.ci || req.params.ci;
  console.log(`📥 Consulta recibida para CI: ${JSON.stringify({ params: req.params, query: req.query })}`);
  if (!ci) {
    return res.status(400).send({ success: false, error: 'missing_ci', message: 'Se requiere el parámetro ci en query o path.' });
  }

  try {
    const data = await obtenerDatosci(String(ci));
    res.send(data);
  } catch (err) {
    console.error('Error handling /consultar request:', err && (err.stack || err.message || String(err)));
    res.status(500).send({ success: false, error: 'internal_error', message: String(err) });
  }
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

http://localhost:3031/consultar/ci=1103527782