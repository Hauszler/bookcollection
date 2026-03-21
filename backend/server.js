const express = require('express');
const cors = require('cors');
const booksRouter = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/books', booksRouter);

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Book Collection API is running!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Rota ${req.method} ${req.originalUrl} não encontrada.` });
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor.', details: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = app;
