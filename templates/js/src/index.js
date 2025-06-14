import express from 'express';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', routes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`✅ Server listening at http://localhost:${port}`);
});