const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'db.json');

function readDB() {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validateBook(body) {
  const { titulo, autor, genero, ano, imagem } = body;
  const errors = [];

  if (!titulo || titulo.trim() === '') errors.push('Campo "titulo" é obrigatório.');
  if (!autor || autor.trim() === '') errors.push('Campo "autor" é obrigatório.');
  if (!genero || genero.trim() === '') errors.push('Campo "genero" é obrigatório.');
  if (ano === undefined || ano === null || ano === '') {
    errors.push('Campo "ano" é obrigatório.');
  } else if (isNaN(Number(ano)) || !Number.isInteger(Number(ano))) {
    errors.push('Campo "ano" deve ser um número inteiro válido.');
  }
  if (!imagem || imagem.trim() === '') {
    errors.push('Campo "imagem" (URL) é obrigatório.');
  } else if (!isValidUrl(imagem)) {
    errors.push('Campo "imagem" deve ser uma URL válida.');
  }

  return errors;
}

// GET /books
function getAllBooks(req, res) {
  try {
    const db = readDB();
    res.status(200).json(db.books);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao ler os dados.', details: err.message });
  }
}

// GET /books/:id
function getBookById(req, res) {
  try {
    const db = readDB();
    const id = parseInt(req.params.id);
    const book = db.books.find((b) => b.id === id);

    if (!book) {
      return res.status(404).json({ error: `Livro com id ${id} não encontrado.` });
    }

    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao ler os dados.', details: err.message });
  }
}

// POST /books
function createBook(req, res) {
  try {
    const errors = validateBook(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Dados inválidos.', details: errors });
    }

    const db = readDB();
    const { titulo, autor, genero, ano, imagem, lido, sinopse, review, score } = req.body;

    const newBook = {
      id: db.nextId,
      titulo: titulo.trim(),
      autor: autor.trim(),
      genero: genero.trim(),
      ano: parseInt(ano),
      imagem: imagem.trim(),
      lido: lido === true || lido === 'true',
      sinopse: sinopse ? sinopse.trim() : '',
      review:  review  ? review.trim()  : '',
      score:   score !== undefined ? parseInt(score) || 0 : 0,
    };

    db.books.push(newBook);
    db.nextId += 1;
    writeDB(db);

    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar os dados.', details: err.message });
  }
}

// PUT /books/:id
function updateBook(req, res) {
  try {
    const id = parseInt(req.params.id);
    const db = readDB();
    const index = db.books.findIndex((b) => b.id === id);

    if (index === -1) {
      return res.status(404).json({ error: `Livro com id ${id} não encontrado.` });
    }

    const errors = validateBook(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Dados inválidos.', details: errors });
    }

    const { titulo, autor, genero, ano, imagem, lido, sinopse, review, score } = req.body;

    const updatedBook = {
      ...db.books[index],
      titulo: titulo.trim(),
      autor: autor.trim(),
      genero: genero.trim(),
      ano: parseInt(ano),
      imagem: imagem.trim(),
      lido: lido === true || lido === 'true',
      sinopse: sinopse !== undefined ? sinopse.trim() : (db.books[index].sinopse || ''),
      review:  review  !== undefined ? review.trim()  : (db.books[index].review  || ''),
      score:   score   !== undefined ? parseInt(score) || 0 : (db.books[index].score || 0),
    };

    db.books[index] = updatedBook;
    writeDB(db);

    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar os dados.', details: err.message });
  }
}

// DELETE /books/:id
function deleteBook(req, res) {
  try {
    const id = parseInt(req.params.id);
    const db = readDB();
    const index = db.books.findIndex((b) => b.id === id);

    if (index === -1) {
      return res.status(404).json({ error: `Livro com id ${id} não encontrado.` });
    }

    db.books.splice(index, 1);
    writeDB(db);

    res.status(200).json({ message: `Livro com id ${id} deletado com sucesso.` });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar os dados.', details: err.message });
  }
}

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
