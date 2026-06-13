// api/clear.js
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  await redis.del('dataset:sct013');

  res.status(200).json({ ok: true, mensaje: 'Dataset borrado correctamente' });
};
