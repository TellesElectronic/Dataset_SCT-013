const fs = require('fs');
const CSV_PATH = '/tmp/dataset_sct013.csv';
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (!fs.existsSync(CSV_PATH)) return res.status(404).send('No hay datos todavía.');
  const csv = fs.readFileSync(CSV_PATH);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="dataset_sct013.csv"');
  res.send(csv);
};
