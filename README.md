# 📚 Book Collection App

Aplicação fullstack para gerenciamento de coleção de livros, desenvolvida com **Node.js + Express** no backend e **HTML/CSS/JavaScript** puro no frontend. Criada para estudo e prática de automação de testes.

---

## 🚀 Como instalar e rodar

### Pré-requisitos
- [Node.js](https://nodejs.org/) v18+

### 1. Acesse a pasta do projeto
```bash
cd book-collection-app
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Inicie o servidor

**Modo produção:**
```bash
npm start
```

**Modo desenvolvimento (com hot-reload):**
```bash
npm run dev
```

O servidor estará disponível em: `http://localhost:3001`

### 4. Abra o frontend

Abra o arquivo `frontend/index.html` diretamente no navegador.

> **Dica:** Use a extensão **Live Server** (VSCode) ou execute `npx serve frontend` para servir os arquivos estáticos.

---

## 📁 Estrutura do projeto

```
book-collection-app/
├── backend/
│   ├── server.js               # Servidor Express (entry point)
│   ├── db.json                 # Banco de dados em arquivo JSON
│   ├── controllers/
│   │   └── booksController.js  # Lógica de negócio (CRUD)
│   └── routes/
│       └── books.js            # Definição das rotas REST
├── frontend/
│   ├── index.html              # Interface principal (data-testid em todos os elementos)
│   ├── style.css               # Estilos
│   └── script.js               # Lógica de UI e consumo da API
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

| Método | Rota          | Descrição              | Status de sucesso |
|--------|---------------|------------------------|-------------------|
| GET    | /books        | Listar todos os livros | 200               |
| GET    | /books/:id    | Buscar livro por ID    | 200               |
| POST   | /books        | Criar livro            | 201               |
| PUT    | /books/:id    | Atualizar livro        | 200               |
| DELETE | /books/:id    | Deletar livro          | 200               |

### Campos de um livro

```json
{
  "id": 1,
  "titulo": "Dom Casmurro",
  "autor": "Machado de Assis",
  "genero": "Romance",
  "ano": 1899,
  "imagem": "https://exemplo.com/capa.jpg",
  "lido": true,
  "sinopse": "...",
  "review": "...",
  "score": 5
}
```

### Respostas de erro

- `400` — Dados inválidos (campos obrigatórios ausentes ou URL inválida)
- `404` — Livro não encontrado
- `500` — Erro interno do servidor

---

## 🧪 Sugestões de testes automatizados

### Cypress (E2E)

```bash
npm install --save-dev cypress
npx cypress open
```

Exemplos de testes:

```js
describe('Book Collection App', () => {
  beforeEach(() => cy.visit('http://localhost:5500')); // ajuste a porta do Live Server

  it('deve exibir os livros iniciais', () => {
    cy.get('[data-testid="books-grid"]').should('be.visible');
    cy.get('[data-testid^="book-card-"]').should('have.length.greaterThan', 0);
  });

  it('deve adicionar um novo livro', () => {
    cy.get('[data-testid="btn-open-form"]').click();
    cy.get('[data-testid="input-titulo"]').type('Novo Livro');
    cy.get('[data-testid="input-autor"]').type('Autor Teste');
    cy.get('[data-testid="input-genero"]').type('Ficção');
    cy.get('[data-testid="input-ano"]').type('2024');
    cy.get('[data-testid="input-imagem"]').type('https://example.com/cover.jpg');
    cy.get('[data-testid="btn-submit"]').click();
    cy.get('[data-testid="toast"]').should('contain', 'adicionado');
  });

  it('deve deletar um livro', () => {
    cy.get('[data-testid^="btn-delete-"]').first().click();
    cy.get('[data-testid="btn-confirm-delete"]').click();
    cy.get('[data-testid="toast"]').should('contain', 'deletado');
  });

  it('deve validar campos obrigatórios', () => {
    cy.get('[data-testid="btn-open-form"]').click();
    cy.get('[data-testid="btn-submit"]').click();
    cy.get('[data-testid="error-titulo"]').should('not.be.empty');
  });
});
```

### Playwright

```bash
npm install --save-dev @playwright/test
npx playwright test
```

### Testes de API com Supertest

```bash
npm install --save-dev supertest jest
```

```js
const request = require('supertest');
const app = require('./backend/server');

describe('GET /books', () => {
  it('deve retornar 200 e um array', async () => {
    const res = await request(app).get('/books');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /books', () => {
  it('deve retornar 400 para campos inválidos', async () => {
    const res = await request(app).post('/books').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
```

---

## 🎯 data-testid disponíveis

| Elemento                  | data-testid                     |
|---------------------------|---------------------------------|
| Botão abrir formulário    | `btn-open-form`                 |
| Formulário de livro       | `book-form`                     |
| Input título              | `input-titulo`                  |
| Input autor               | `input-autor`                   |
| Input gênero              | `input-genero`                  |
| Input ano                 | `input-ano`                     |
| Input URL imagem          | `input-imagem`                  |
| Input Lido (checkbox)     | `input-lido`                    |
| Input Sinopse             | `input-sinopse`                 |
| Input Review              | `input-review`                  |
| Estrelas do form (1-5)    | `form-star-{n}`                 |
| Botão salvar              | `btn-submit`                    |
| Botão cancelar            | `btn-cancel`                    |
| Campo de busca            | `search-input`                  |
| Grid de livros            | `books-grid`                    |
| Card de livro (por id)    | `book-card-{id}`                |
| Botão editar (por id)     | `btn-edit-{id}`                 |
| Botão deletar (por id)    | `btn-delete-{id}`               |
| Confirmação deletar       | `btn-confirm-delete`            |
| Toast de notificação      | `toast`                         |
| Estado vazio              | `empty-state`                   |
| Modal de detalhes         | `detail-overlay`                |
| Título no detalhe         | `detail-title`                  |
| Sinopse no detalhe        | `detail-sinopse`                |
| Review no detalhe         | `detail-review`                 |
| Estrelas no detalhe (1-5) | `detail-star-{n}`               |

---

## 📦 Dependências

| Pacote    | Uso                  |
|-----------|----------------------|
| express   | Servidor HTTP        |
| cors      | Cross-Origin headers |
| nodemon   | Hot-reload (dev)     |
