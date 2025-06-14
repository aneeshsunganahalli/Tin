export default function errorHandler(err, req, res, next) {
  console.error('Server Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
}
