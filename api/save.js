const fs = require('fs');
const CSV_PATH = '/tmp/dataset_sct013.csv';
const HEADERS  = 'timestamp,label,label_nombre,rms,media,pico,crest,varianza,comentario\n';
const LABELS   = ['reposo','lampara','motor','resistencia','PC','otro'];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { label, rms, media, pico, crest, varianza, comentario } = req.query;
  if (label === undefined) return res.status(400).json({ error: 'Falta parámetro label' });
  if (!fs.existsSync(CSV_PATH)) fs.writeFileSync(CSV_PATH, HEADERS);
  const timestamp   = new Date().toISOString();
  const labelIdx    = parseInt(label);
  const labelNombre = LABELS[labelIdx] ?? 'desconocido';
  const comentEsc   = (comentario || '').replace(/,/g, ';').replace(/\n/g, ' ').substring(0, 120);
  const linea = [timestamp, labelIdx, labelNombre,
    parseFloat(rms||0).toFixed(4), parseFloat(media||0).toFixed(4),
    parseInt(pico||0), parseFloat(crest||0).toFixed(4),
    parseFloat(varianza||0).toFixed(4), comentEsc].join(',') + '\n';
  fs.appendFileSync(CSV_PATH, linea);
  const total = fs.readFileSync(CSV_PATH, 'utf8').trim().split('\n').length - 1;
  return res.status(200).json({ ok: true, registros: total,
    guardado: { timestamp, label: labelIdx, labelNombre, rms, crest, comentario: comentEsc } });
};
