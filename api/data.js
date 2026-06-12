const fs = require('fs');
const CSV_PATH = '/tmp/dataset_sct013.csv';
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (!fs.existsSync(CSV_PATH)) return res.status(200).json({ registros: 0, datos: [], clases: {} });
  const contenido = fs.readFileSync(CSV_PATH, 'utf8');
  const lineas = contenido.trim().split('\n').filter(Boolean);
  if (lineas.length <= 1) return res.status(200).json({ registros: 0, datos: [], clases: {} });
  const cabecera = lineas[0].split(',');
  const datos = lineas.slice(1).map(linea => {
    const vals = linea.split(','); const obj = {};
    cabecera.forEach((k, i) => obj[k.trim()] = (vals[i]||'').trim()); return obj;
  });
  const clases = {};
  datos.forEach(d => { const k = d.label_nombre||d.label; clases[k] = (clases[k]||0)+1; });
  return res.status(200).json({ registros: datos.length, datos, clases });
};
