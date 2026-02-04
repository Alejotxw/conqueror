import express from 'express'
import cors from 'cors'  // ← NUEVO
import { obtenerDatosRuc } from './ScrapingSRI.js'

const app = express()
const port = 3001

app.use(cors())  // ← NUEVO: Habilitar CORS

// Evitar cierres silenciosos: loguear errores no capturados
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && (err.stack || err.message || String(err)));
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.get('/consultar', async (req, res) => {
    const ruc = req.query.ruc
    const data = await obtenerDatosRuc(ruc)
    console.log(data)
    res.send(data)

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

http://localhost:3001/consultar/ruc: