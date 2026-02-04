# CONQUEROR (Actualizado el 04/02/2026)

Este es un proyecto enfocado en crear un sistema de consulta de datos públicos basado en cédula o RUC. El frontend actúa como un buscador intuitivo, el backend procesa las solicitudes y maneja el scraping, y los scrapers extraen datos de sitios web específicos de manera ética y eficiente.

## Descripción

CONQUEROR es una aplicación web que permite a los usuarios buscar información relacionada con cédulas o RUCs mediante un interfaz simple. El sistema:
- Envía consultas desde el frontend al backend.
- Ejecuta scraping en tiempo real (o cacheado) en tres páginas web clave.
- Procesa y devuelve los datos en formato JSON para su visualización en el frontend.

El scraping se realiza en carpetas separadas para modularidad, y todo está conectado vía APIs REST. Este proyecto es ideal para fines educativos, de investigación o automatización de consultas públicas, siempre respetando las leyes y términos de servicio de los sitios scraped.

**Nota importante**: El scraping debe usarse de forma responsable. No abuses de los sitios web públicos; implementa rate-limiting y respeta robots.txt. Este proyecto no promueve actividades ilegales.

## Características

- **Frontend como Buscador**: Interfaz React con un formulario para ingresar cédula/RUC y mostrar resultados en tiempo real.
- **Backend Robusto**: API Node.js con Express para manejar requests, procesar datos y conectar con scrapers.
- **Scraping Modular**: Scripts independientes para tres páginas (ej: SRI, Registro Civil, Supercias), usando Puppeteer y Cheerio para manejo de contenido dinámico y estático.
- **Conexiones Integradas**: Frontend → Backend vía Axios; Backend → Scrapers vía imports de módulos.
- **Manejo de Errores**: Soporte básico para errores en scraping y requests.
- **Escalabilidad**: Fácil de agregar caching (ej: Redis) o más scrapers.

## Tecnologías Utilizadas

- **Frontend**: React + Vite (para desarrollo rápido y hot-reloading).
- **Backend**: Node.js + Express (para APIs RESTful).
- **Scraping**: Puppeteer (navegación headless), Cheerio (parsing HTML), Axios (requests HTTP).
- **Otras Herramientas**: CORS (para conexiones cross-origin), Dotenv (variables de entorno), Nodemon (desarrollo).
- **Entorno**: Desarrollado en Visual Studio Code; compatible con Git para control de versiones.

## Instalación

**1. Clona el repositorio:**
  git clone https://tu-repositorio/conqueror.git
  cd conqueror
**2. Instala dependencias en cada carpeta:**
  - Frontend:
    cd frontend
    npm install
    cd ..
    text- Backend:
    cd backend
    npm install
    cd ..
    text- Scraping:
    cd scraping
    npm install
    cd ..

**3. Configura variables de entorno en `backend/.env` (ej: `PORT=5000`).**

**4. Asegúrate de tener Node.js (v18+) y npm instalados.**

## Uso

**1. Inicia el backend:**
  cd backend
  npm run dev
  text(Corre en `http://localhost:5000`).

**2. Inicia el frontend:**
  cd frontend
  npm run dev
  text(Corre en `http://localhost:5173`).

**3. Abre el navegador en `http://localhost:5173`:**
  - Selecciona "Cédula" o "RUC".
  - Ingresa el valor.
  - Haz clic en "Buscar".
  - Visualiza los resultados scraped y procesados.

Para pruebas de scraping independientes, ejecuta scripts en `scraping/` manualmente (ej: node un-script-de-prueba.js).

## Detalles de Scraping

- **Páginas Scraped**:
  1. SRI (para RUC): Extrae nombre, estado, etc.
  2. Registro Civil (para Cédula): Extrae datos personales básicos.
  3. Supercias (para RUC/empresas): Extrae info corporativa.

- **Implementación**: Funciones exportadas en `scraping/scrapers.js`. Usa Puppeteer para sitios con JS; Cheerio para HTML estático. Adapta selectores inspeccionando las páginas con DevTools.

- **Mejoras Recomendadas**:
  - Implementa proxies o CAPTCHA solvers si es necesario.
  - Agrega caching para evitar requests repetidos.
  - Monitorea cambios en los sitios (scraping es frágil ante updates).

## Contribuciones

¡Contribuciones bienvenidas! Abre un issue o pull request para mejoras, como agregar más scrapers o optimizaciones.

- **Desarrollador**: Sebastián Chocho.
- **Desarrollador**: Jhandry David.

## Licencia

MIT License. Usa este proyecto bajo tu responsabilidad. No se garantiza la precisión de los datos scraped.

**¡Avancemos con CONQUEROR! Si necesitas expansiones, contáctame. 🚀**
