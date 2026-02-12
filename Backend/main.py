import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import httpx
from openai import AsyncOpenAI

load_dotenv()

app = FastAPI(title="Backend de Consultas Ecuador")
client_deepseek = AsyncOpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)
# 1. Configuración de CORS
# Esto permite que tu Frontend (usualmente en el puerto 5173 con Vite) 
# pueda hacer peticiones a este Backend sin ser bloqueado.
# En main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001", # Agregado según tu error
        "http://localhost:5173",
        "http://localhost:5174", # Puerto alternativo de Vite
        "http://localhost:3000", # Puerto por defecto de Vite
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. URL del servicio de Scraping (Node.js)
# Asegúrate de que tu server.js esté corriendo en este puerto.
SCRAPER_SERVICE_URL = "http://127.0.0.1:3001/api"

@app.post("/consultar/analizar")
async def analizar_informacion(data: dict = Body(...)):
    """
    Recibe los datos obtenidos de SRI/ANT/RP y los analiza con DeepSeek
    """
    try:
        # Convertimos el diccionario de datos a un texto legible para la IA
        texto_para_analizar = str(data)
        
        response = await client_deepseek.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "Eres un analista experto en seguridad e inteligencia. Genera un perfil biográfico y profesional detallado basado en los datos proporcionados (SRI, ANT, Registros). Formatea el resultado para un reporte oficial."},
                {"role": "user", "content": f"Analiza estos datos: {texto_para_analizar}"}
            ],
            stream=False
        )
        
        return {"analisis": response.choices[0].message.content}
        
    except Exception as e:
        print(f"Error DeepSeek: {e}")
        raise HTTPException(status_code=500, detail="Error al procesar el análisis con Inteligencia Artificial")

@app.get("/")
async def root():
    return {"message": "API de enlace funcionando"}

# 3. Endpoint para SRI
@app.get("/consultar/sri/{ruc}")
async def consultar_sri(ruc: str):
    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            response = await client.get(f"{SCRAPER_SERVICE_URL}/sri/{ruc}")
            return response.json()
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Error conectando con el servicio de scraping: {e}")

# 4. Endpoint para ANT
# Modifica tus funciones en main.py así:
# Modifica tus funciones en main.py así:
@app.get("/consultar/ant/{cedula}")
async def consultar_ant(cedula: str):
    async with httpx.AsyncClient(timeout=80.0) as client: # Aumentamos timeout
        try:
            response = await client.get(f"{SCRAPER_SERVICE_URL}/ant/{cedula}")
            
            # Si el servidor de Node mandó un error (ej: 404 o 500)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Error en el servicio de Node")
            
            return response.json()
        except httpx.ReadTimeout:
            raise HTTPException(status_code=504, detail="La ANT tardó demasiado en responder")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

# 5. Endpoint para Registro de la Propiedad (RP)
@app.get("/consultar/rp/{cedula}")
async def consultar_rp(cedula: str):
    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            response = await client.get(f"{SCRAPER_SERVICE_URL}/rp/{cedula}")
            return response.json()
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail="El servicio de Registro de Propiedad no responde")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)