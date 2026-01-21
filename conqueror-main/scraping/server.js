import express from 'express'
import cors from 'cors'
import { obtenerDatosRuc } from './ScrapingSRI.js'
import { obtenerDatosci } from './ScrapingRP.js'

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

// Manejo global de errores
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && (err.stack || err.message || String(err)));
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.get('/consultar-sri', async (req, res) => {
  try {
    const ruc = req.query.ruc
    const data = await obtenerDatosRuc(ruc)
    res.send(data)
  } catch (err) {
    res.status(500).send({ success: false, error: 'internal_error', message: String(err) });
  }
})

app.get('/consultar-rp', async (req, res) => {
  try {
    const ci = req.query.ci
    const data = await obtenerDatosci(ci)
    res.send(data)
  } catch (err) {
    res.status(500).send({ success: false, error: 'internal_error', message: String(err) });
  }
})

app.listen(port, () => {
  console.log(`Backend CONQUEROR corriendo en http://localhost:${port}`)
})
