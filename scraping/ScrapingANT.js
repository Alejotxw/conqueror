import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

puppeteer.use(StealthPlugin());

export async function scrapeANTcitations(cedula) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1400, height: 1000 }
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('[ANT PAGE]', msg.text()));

  try {
    console.log(`[ANT] Consultando CI: ${cedula}`);
    const link = `https://consultaweb.ant.gob.ec/PortalWEB/paginas/clientes/clp_grid_citaciones.jsp?ps_tipo_identificacion=CED&ps_identificacion=${cedula}&ps_placa=`;

    await page.goto(link, { waitUntil: 'load', timeout: 90000 });
    await new Promise(resolve => setTimeout(resolve, 8000));

    // Intentar cambiar a pestaña "Pagadas" si tiene citaciones
    const clickResult = await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('font.radio_button'));
      const pagLabel = labels.find(l => l.innerText.includes('Pagadas') && l.innerText.match(/\([1-9]\d*\)/));
      if (pagLabel) {
        // Encontrar el radio button anterior
        const radio = pagLabel.parentElement.querySelector('input[type="radio"]');
        if (radio) {
          console.log("Cambiando a pestaña Pagadas...");
          radio.click();
          return "PAGADAS";
        }
      }
      return "PENDIENTES";
    });

    if (clickResult === "PAGADAS") {
      await new Promise(resolve => setTimeout(resolve, 6000));
    }

    // Extracción de datos refinada para jqGrid
    const data = await page.evaluate((tabStatus) => {
      const results = [];
      const rows = Array.from(document.querySelectorAll('tr.jqgrow'));

      rows.forEach(row => {
        const rowData = { estado: tabStatus };
        const cells = row.querySelectorAll('td[role="gridcell"]');

        cells.forEach(cell => {
          const desc = cell.getAttribute('aria-describedby') || '';
          const text = cell.textContent.trim();

          if (desc.includes("_secuencia_4")) rowData.placa = text;
          if (desc.includes("_capital_factura")) {
            const val = text.replace(/[$\s]/g, '').replace(',', '.');
            rowData.valorSancion = parseFloat(val) || 0;
          }
          if (desc.includes("_total")) {
            const val = text.replace(/[$\s]/g, '').replace(',', '.');
            rowData.totalPagar = parseFloat(val) || 0;
          }
          if (desc.includes("_rubro")) rowData.delito = text;
          if (desc.includes("_fecha_emision")) rowData.fechaEmision = text;
          if (desc.includes("_fecha_factura")) rowData.fechaNotificacion = text;
        });

        if (rowData.delito) {
          results.push({
            placa: rowData.placa && rowData.placa !== '-' ? rowData.placa : 'N/A',
            valorSancion: rowData.valorSancion || 0,
            totalPagar: rowData.totalPagar || 0,
            delito: rowData.delito,
            fechaEmision: rowData.fechaEmision || 'N/A',
            fechaNotificacion: rowData.fechaNotificacion || 'N/A',
            estado: rowData.estado
          });
        }
      });
      return results;
    }, clickResult);

    console.log(`[ANT] Consulta finalizada. Total: ${data.length}`);
    await browser.close();
    return data;

  } catch (error) {
    console.error('[ANT] Error:', error.message);
    if (browser) await browser.close();
    return { error: true, message: error.message };
  }
}