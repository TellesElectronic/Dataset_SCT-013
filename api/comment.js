const fs = require('fs');
const CSV_PATH = '/tmp/dataset_sct013.csv';
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { id, comentario } = req.query;
  if (!id || !comentario) return res.status(400).json({ error: 'Faltan id o comentario' });
  if (!fs.existsSync(CSV_PATH)) return res.status(404).json({ error: 'No hay datos' });
  const lineas = fs.readFileSync(CSV_PATH, 'utf8').split('\n');
  const idx = parseInt(id);
  if (idx < 1 || idx >= lineas.length - 1) return res.status(400).json({ error: 'ID fuera de rango' });
  const cols = lineas[idx].split(',');
  cols[8] = (comentario||'').replace(/,/g,';').replace(/\n/g,' ').substring(0,120);
  lineas[idx] = cols.join(',');
  fs.writeFileSync(CSV_PATH, lineas.join('\n'));
  return res.status(200).json({ ok: true, fila: idx, comentario: cols[8] });
};
