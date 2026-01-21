import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

export async function scrapeSancionesPorCedula(cedula) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
    defaultViewport: { width: 1400, height: 1000 }
  });
  const page = await browser.newPage();

  try {
    const link = `https://consultaweb.ant.gob.ec/PortalWEB/paginas/clientes/clp_grid_citaciones.jsp?ps_tipo_identificacion=CED&ps_identificacion=${cedula}&ps_placa=`;

    await page.goto(link, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Espera adicional para que cargue la página
    await new Promise(resolve => setTimeout(resolve, 3000));

    // ========== MULTAS PENDIENTES ==========
    const multasPendientes = await page.evaluate(() => {
      const filas = Array.from(document.querySelectorAll('tr[role="row"]'));
      return filas.map(fila => {
        const cells = fila.querySelectorAll('td[role="gridcell"]');
        let placa = '', totalPagar = 0, delito = '';
        let fechaEmision = '', fechaNotificacion = '';

        cells.forEach(cell => {
          const desc = cell.getAttribute('aria-describedby');
          
          // Buscar placa en múltiples posibles columnas
          if (desc === "list10_secuencia_4" || desc === "list10_placa") {
            const texto = cell.textContent.trim();
            // Solo asignar si no es "-" o vacío
            if (texto && texto !== '-') {
              placa = texto;
            }
          }
          
          if (desc === "list10_total"){
            const valorTexto = cell.textContent.replace(/[$\s]/g, '').replace(',', '.');
            totalPagar = parseFloat(valorTexto) || 0;
          }
          
          if (desc === "list10_rubro") {
            delito = cell.textContent.trim();
          }
          
          if (desc === "list10_fecha_emision") {
            fechaEmision = cell.textContent.trim();
          }
          
          if (desc === "list10_fecha_factura") {
            fechaNotificacion = cell.textContent.trim();
          }
        });

        // Buscar placa en el número de infracción si no se encontró
        if (!placa || placa === '-') {
          cells.forEach(cell => {
            const desc = cell.getAttribute('aria-describedby');
            if (desc && desc.includes('infraccion')) {
              const texto = cell.textContent.trim();
              // Buscar patrón de placa (ej: PRW0727)
              const match = texto.match(/[A-Z]{3}\d{4}/);
              if (match) {
                placa = match[0];
              }
            }
          });
        }

        return { 
          placa: placa || 'Sin placa',
          totalPagar: totalPagar,
          delito: delito,
          fechaEmision: fechaEmision,
          fechaNotificacion: fechaNotificacion,
        };
      }).filter(row => row.delito !== '');
    });

    // ========== MULTAS PAGADAS ==========
    // Buscar y hacer click en el radio button de "Pagadas"
    const radioPagadasClicked = await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label'));
      const pagadasLabel = labels.find(label => 
        label.textContent.includes('Pagadas')
      );
      
      if (pagadasLabel) {
        const radioButton = pagadasLabel.querySelector('input[type="radio"]') || 
                           document.querySelector('input[type="radio"][value*="pagada"]') ||
                           document.querySelector('input[type="radio"]#pagadas');
        
        if (radioButton) {
          radioButton.click();
          return true;
        }
      }
      
      const radios = Array.from(document.querySelectorAll('input[type="radio"]'));
      const pagadasRadio = radios.find(radio => {
        const parent = radio.closest('td') || radio.parentElement;
        return parent && parent.textContent.includes('Pagadas');
      });
      
      if (pagadasRadio) {
        pagadasRadio.click();
        return true;
      }
      
      return false;
    });

    let multasPagadas = [];
    
    if (radioPagadasClicked) {
      // Esperar a que la tabla se actualice
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Extraer datos de multas pagadas con valores de Sanción, Multa y Remisión
      multasPagadas = await page.evaluate(() => {
        const filas = Array.from(document.querySelectorAll('tr[role="row"]'));
        return filas.map(fila => {
          const cells = fila.querySelectorAll('td[role="gridcell"]');
          let placa = '', totalPagado = 0, delito = '';
          let fechaEmision = '', fechaNotificacion = '';
          let sancion = 0, multa = 0, remision = 0;

          cells.forEach(cell => {
            const desc = cell.getAttribute('aria-describedby');
            
            // Placa
            if (desc === "list10_secuencia_4" || desc === "list10_placa") {
              placa = cell.textContent.trim();
            }
            
            // Total a Pagar
            if (desc === "list10_total" || desc === "list10_total_pagar"){
              const valorTexto = cell.textContent.replace(/[$\s]/g, '').replace(',', '.');
              totalPagado = parseFloat(valorTexto) || 0;
            }
            
            // Artículo/Delito
            if (desc === "list10_rubro" || desc === "list10_articulo") {
              delito = cell.textContent.trim();
            }
            
            // Fechas
            if (desc === "list10_fecha_emision") fechaEmision = cell.textContent.trim();
            if (desc === "list10_fecha_factura") fechaNotificacion = cell.textContent.trim();
            
            // Valores monetarios: Sanción, Multa, Remisión
            if (desc === "list10_capital_factura") { 
              const valorTexto = cell.textContent.replace(/[$\s]/g, '').replace(',', '.');
              sancion = parseFloat(valorTexto) || 0;
            }
            if (desc === "list10_multa") {
              const valorTexto = cell.textContent.replace(/[$\s]/g, '').replace(',', '.');
              multa = parseFloat(valorTexto) || 0;
            }
            if (desc === "list10_remision") {
              const valorTexto = cell.textContent.replace(/[$\s]/g, '').replace(',', '.');
              remision = parseFloat(valorTexto) || 0;
            }
          });

          return { 
            placa: placa || 'Sin placa',
            totalPagado: totalPagado,
            delito: delito,
            fechaEmision: fechaEmision,
            fechaNotificacion: fechaNotificacion,
            sancion: sancion,
            multa: multa,
            remision: remision
          };
        }).filter(row => row.delito !== '');
      });
    }

    await browser.close();
    
    return {
      pendientes: multasPendientes,
      pagadas: multasPagadas
    };
    
  } catch (error) {
    console.error('Error en scraping:', error);
    await browser.close();
    return { error: true, message: error.message };
  }
}