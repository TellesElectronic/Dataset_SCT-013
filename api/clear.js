const fs = require('fs');
const CSV_PATH = '/tmp/dataset_sct013.csv';
const HEADERS  = 'timestamp,label,label_nombre,rms,media,pico,crest,varianza,comentario\n';
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  fs.writeFileSync(CSV_PATH, HEADERS);
  return res.status(200).json({ ok: true, mensaje: 'Dataset limpiado' });
};
