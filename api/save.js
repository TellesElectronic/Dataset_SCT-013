const { Redis } = require('@upstash/redis');
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
const LABELS = ['reposo','lampara','motor','resistencia','PC','otro'];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { label, rms, media, pico, crest, varianza, comentario } = req.query;
  if (label === undefined) return res.status(400).json({ error: 'Falta parámetro label' });

  const timestamp   = new Date().toISOString();
  const labelIdx    = parseInt(label);
  const labelNombre = LABELS[labelIdx] ?? 'desconocido';
  const comentEsc   = (comentario || '').replace(/,/g, ';').replace(/\n/g, ' ').substring(0, 120);

  const registro = {
    timestamp, label: labelIdx, label_nombre: labelNombre,
    rms: parseFloat(rms||0).toFixed(4),
    media: parseFloat(media||0).toFixed(4),
    pico: parseInt(pico||0),
    crest: parseFloat(crest||0).toFixed(4),
    varianza: parseFloat(varianza||0).toFixed(4),
    comentario: comentEsc
  };

  // Guardar en lista Redis (persistente entre instancias)
  await redis.rpush('dataset:sct013', JSON.stringify(registro));
  const total = await redis.llen('dataset:sct013');

  return res.status(200).json({ ok: true, registros: total, guardado: registro });
};
