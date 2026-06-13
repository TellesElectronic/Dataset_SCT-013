// api/download.js
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // cuántos registros hay en la lista
  const total = await redis.llen('dataset:sct013');
  if (total === 0) {
    return res.status(404).send('No hay datos todavía.');
  }

  // leemos todos los elementos de la lista
  const raw   = await redis.lrange('dataset:sct013', 0, -1);
  const datos = raw.map(r => (typeof r === 'string' ? JSON.parse(r) : r));

  const cabecera = 'timestamp,label,label_nombre,rms,media,pico,crest,varianza,comentario\n';
  const filas = datos.map(d =>
    [
      d.timestamp,
      d.label,
      d.label_nombre,
      d.rms,
      d.media,
      d.pico,
      d.crest,
      d.varianza,
      d.comentario || ''
    ].join(',')
  ).join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="dataset_sct013.csv"');
  res.send(cabecera + filas);
};
