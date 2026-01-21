import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

// Función para verificar si la sesión está activada
async function checkSession(page) {
  console.log('🔍 Verificando estado de la sesión...');
  await page.goto('https://www.rplojavirtual.gob.ec/public/bienInmueble.xhtml', { waitUntil: 'networkidle2', timeout: 30000 });

  const isLoginPage = await page.$('input[id="mainForm:username"]') !== null;

  if (isLoginPage) {
    console.log('⚠️ Sesión expirada detectada. Reiniciando login...');
    return false;
  }

  console.log('✅ Sesión activa.');
  return true;
}

// Función para realizar el login (reutilizable)
async function performLogin(page) {
  console.log('🔐 Iniciando proceso de login...');
  await page.goto('https://www.rplojavirtual.gob.ec/login.xhtml', { waitUntil: 'networkidle2', timeout: 30000 });

  await page.type('input[id="mainForm:username"]', "1105550964");
  await page.type('input[id="mainForm:password"]', "1105550964");
  await page.click('button[id="mainForm:j_idt16"]');

  // Esperar para CAPTCHA manual (ajusta el tiempo según necesites)
  await delay(3000);

  console.log('✅ Login completado. Verificando acceso...');
}

const obtenerDatosci = async (ci) => {
  console.log(`🔍 Iniciando consulta Registro de la Propiedad para ci: ${ci}`);

  // Iniciar Puppeteer en Windows
  const browser = await puppeteer.launch({
    headless: false, // Cambia a true si no necesitas ver el navegador
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  try {
    console.log(`🌐 Configurando navegador para simular usuario real...`);

    // Configurar user agent y headers para evitar detección
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Referer': 'https://rploja.gob.ec/',
      'Origin': 'https://rploja.gob.ec/',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
    });

    // Verificar sesión inicial
    let sessionValid = await checkSession(page);

    if (!sessionValid) {
      await performLogin(page);
      sessionValid = await checkSession(page);
    }

    let registros = [];

    if (sessionValid) {
      console.log('🚀 Procediendo con el scraping...');
      await page.type('input[id="mainForm:j_idt51"]', ci);
      await page.click('button[id="mainForm:j_idt78"]');
      await delay(5000); // Esperar carga

      // Extraer tabla por ID y mapear filas a objetos
      try {
        // Esperar a que la tabla cargue (buscando texto clave o estructura de tabla)
        // Usamos un selector más genérico para PrimeFaces/JSF ya que los IDs (j_idt80) cambian
        await page.waitForSelector('.ui-datatable tbody tr', { timeout: 15000 });

        const rows = await page.$$eval('.ui-datatable tbody tr', trs => {
          return trs.map(tr => {
            // Si la fila dice "No se encontraron registros", ignorarla
            if (tr.innerText.includes('No se encontraron registros')) return null;

            return Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim());
          }).filter(row => row !== null && row.length > 2); // Filtrar filas vacías o mensajes
        });

        if (rows.length > 0) {
          registros = rows.map(cols => ({
            tipo_estado: cols[0] || "Propiedad/Acto", // Ajustar índices según las columnas reales
            numero1: cols[1] || "",
            numero2: cols[2] || "",
            fecha: cols[3] || "",
            ci: cols[4] || "",
            nombre: cols[5] || "",
            rol: cols[6] || "",
            detalle: cols[7] || "Detalle disponible"
          }));
          console.log(`✅ Datos extraídos: ${registros.length} registros encontrados.`);
        } else {
          console.log('⚠️ La tabla está vacía o no contiene datos válidos.');
        }

      } catch (e) {
        console.warn('⚠️ Error extrayendo tabla:', e.message);
      }

      console.log('📊 Scraping completado de: ' + ci);
    } else {
      throw new Error('No se pudo establecer una sesión válida. Revisa credenciales o CAPTCHA.');
    }

    // Listener para respuestas (mantenido de tu código original)

    // Retornar los datos extraídos
    const resultado = {
      success: true,
      ci,
      registros: registros
    };
    // Cerrar navegador antes de devolver resultado
    try {
      await browser.close();
    } catch (e) {
      console.warn('⚠️ Error cerrando el navegador:', e.message || e);
    }
    return resultado;

    console.log('⏳ Proceso pausado. El navegador permanece abierto. Presiona Ctrl+C para terminar el script.');
    await new Promise(() => { });

  } catch (error) {
    console.error('\n❌ Error en obtenerDatosci:', error.message);

    await browser.close();
    return {
      success: false,
      error: 'error_general',
      message: `Error al consultar RP: ${error.message}`,
    };
  }
};

export { obtenerDatosci };