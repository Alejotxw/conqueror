const express = require('express')
const cors = require('cors')  // ← NUEVO
const app = express()
const port = 3001
const { obtenerDatosRuc } = require('./ScrapingSRI.js')

app.use(cors())  // ← NUEVO: Habilitar CORS

app.get('/consultar', async (req, res) => {
    const ruc = req.query.ruc
    const data = await obtenerDatosRuc(ruc)
    console.log(data)
    res.send(data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})