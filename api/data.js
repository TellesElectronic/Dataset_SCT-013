// api/data.js
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const total = await redis.llen('dataset:sct013');
  if (total === 0) {
    return res.status(200).json({ registros: 0, datos: [], clases: {} });
  }

  const raw = await redis.lrange('dataset:sct013', 0, -1);
  const datos = raw.map(r => (typeof r === 'string' ? JSON.parse(r) : r));

  const clases = {};
  datos.forEach(d => {
    const k = d.label_nombre || String(d.label);
    clases[k] = (clases[k] || 0) + 1;
  });

  return res.status(200).json({ registros: datos.length, datos, clases });
};
