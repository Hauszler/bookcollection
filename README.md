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

> **Dica:** Use a extensão **Live Server** (VSCode) ou execute o comando abaixo para servir os arquivos na porta 4000:
> ```bash
> npx serve frontend -l 4000
> ```

---

## 🥒 Documentação Gherkin (BDD)

A aplicação conta com documentação estruturada em Gherkin dentro do diretório `features/`. Estes arquivos descrevem o comportamento esperado do sistema:

- **[visualizacao.feature](./features/visualizacao.feature):** Cenários de listagem, busca e detalhes.
- **[gerenciamento.feature](./features/gerenciamento.feature):** Cenários de CRUD (cadastro, edição e exclusão).

Para visualizar os cenários, basta abrir os arquivos `.feature`.

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
├── features/                   # Documentação Gherkin (Cenários BDD)
│   ├── visualizacao.feature
│   └── gerenciamento.feature
├── cypress/                    # Testes automatizados E2E
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
