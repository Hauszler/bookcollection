/* ====================================================
   Book Collection App — Frontend Script
   Consumes the REST API at http://localhost:3001
==================================================== */

const API_URL = 'http://localhost:3001/books';

// ── DOM References ──────────────────────────────────
const booksGrid     = document.getElementById('books-grid');
const modalOverlay  = document.getElementById('modal-overlay');
const confirmOverlay= document.getElementById('confirm-overlay');
const bookForm      = document.getElementById('book-form');
const bookIdInput   = document.getElementById('book-id');
const modalTitle    = document.getElementById('modal-title');
const btnOpenForm   = document.getElementById('btn-open-form');
const btnCloseForm  = document.getElementById('btn-close-form');
const btnCancel     = document.getElementById('btn-cancel');
const btnSubmit     = document.getElementById('btn-submit');
const btnConfirmCancel = document.getElementById('btn-confirm-cancel');
const btnConfirmDelete = document.getElementById('btn-confirm-delete');
const searchInput   = document.getElementById('search-input');
const booksCount    = document.getElementById('books-count');
const loadingEl     = document.getElementById('loading');
const emptyStateEl  = document.getElementById('empty-state');
const toast         = document.getElementById('toast');

// Detail modal (somente leitura)
const detailOverlay     = document.getElementById('detail-overlay');
const detailBookId      = document.getElementById('detail-book-id');
const detailCover       = document.getElementById('detail-cover');
const detailCoverPh     = document.getElementById('detail-cover-placeholder');
const detailTitleEl     = document.getElementById('detail-title');
const detailAuthorEl    = document.getElementById('detail-author');
const detailGenreEl     = document.getElementById('detail-genre');
const detailYearEl      = document.getElementById('detail-year');
const detailLidoBadge   = document.getElementById('detail-lido-badge');
const detailSinopse     = document.getElementById('detail-sinopse');
const detailReview      = document.getElementById('detail-review');
const detailStars       = document.getElementById('detail-stars');
const starHint          = document.getElementById('star-hint');
const btnCloseDetail    = document.getElementById('btn-close-detail');
const btnDetailCloseBottom = document.getElementById('btn-detail-close-bottom');

// Form stars
const formStarsEl   = document.getElementById('form-stars');
const formStarHint  = document.getElementById('form-star-hint');

// ── State ───────────────────────────────────────────
let allBooks = [];
let pendingDeleteId = null;
let toastTimer = null;
let formScore = 0; // score selecionado no formulário

// Labels das estrelas
const starLabels = ['', '1 — Péssimo', '2 — Ruim', '3 — Regular', '4 — Bom', '5 — Excelente'];

// ── Form Stars ──────────────────────────────────────
function setFormStarUI(score) {
  formScore = score;
  formStarsEl.querySelectorAll('.star').forEach((btn) => {
    btn.classList.toggle('active', parseInt(btn.getAttribute('data-value')) <= score);
  });
  formStarHint.textContent = score > 0 ? starLabels[score] : 'Sem avaliação';
}

formStarsEl.querySelectorAll('.star').forEach((btn) => {
  const v = parseInt(btn.getAttribute('data-value'));
  btn.addEventListener('mouseenter', () => {
    formStarsEl.querySelectorAll('.star').forEach((s) =>
      s.classList.toggle('active', parseInt(s.getAttribute('data-value')) <= v)
    );
    formStarHint.textContent = starLabels[v];
  });
  btn.addEventListener('mouseleave', () => setFormStarUI(formScore));
  btn.addEventListener('click', () => setFormStarUI(formScore === v ? 0 : v));
});

// ── Toast ────────────────────────────────────────────
/**
 * Show a temporary notification toast.
 * @param {string} message
 * @param {'success'|'error'} type
 */
function showToast(message, type = 'success') {
  if (toastTimer) clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// ── Loading / Empty State ────────────────────────────
function setLoading(visible) {
  loadingEl.hidden = !visible;
  booksGrid.hidden = visible;
}

function updateEmptyState(books) {
  emptyStateEl.hidden = books.length > 0;
}

// ── API Helpers ──────────────────────────────────────
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.details
      ? (Array.isArray(data.details) ? data.details.join(' ') : data.details)
      : data?.error || 'Erro desconhecido.';
    throw new Error(msg);
  }
  return data;
}

// ── Fetch & Render Books ─────────────────────────────
async function fetchBooks() {
  setLoading(true);
  try {
    allBooks = await apiFetch(API_URL);
    renderBooks(allBooks);
  } catch (err) {
    showToast('Erro ao carregar livros: ' + err.message, 'error');
  } finally {
    setLoading(false);
  }
}

/**
 * Render a list of book objects into the grid.
 * @param {Array} books
 */
function renderBooks(books) {
  booksGrid.innerHTML = '';
  updateEmptyState(books);
  booksCount.textContent = books.length === 1
    ? '1 livro encontrado'
    : `${books.length} livros encontrados`;

  books.forEach((book) => {
    const card = createBookCard(book);
    booksGrid.appendChild(card);
  });
}

/**
 * Build a book card DOM element.
 * @param {Object} book
 * @returns {HTMLElement}
 */
function createBookCard(book) {
  const card = document.createElement('article');
  card.className = 'book-card';
  card.setAttribute('data-testid', `book-card-${book.id}`);
  card.setAttribute('data-id', book.id);

  const coverHtml = book.imagem
    ? `<img
        class="book-cover"
        src="${escapeHtml(book.imagem)}"
        alt="Capa do livro ${escapeHtml(book.titulo)}"
        data-testid="book-cover-${book.id}"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
       />
       <div class="book-cover-placeholder" style="display:none">📚</div>`
    : `<div class="book-cover-placeholder">📚</div>`;

  card.innerHTML = `
    ${coverHtml}
    <div class="book-info">
      <p class="book-title" data-testid="book-title-${book.id}">${escapeHtml(book.titulo)}</p>
      <p class="book-author" data-testid="book-author-${book.id}">${escapeHtml(book.autor)}</p>
      <div class="book-meta">
        <span class="badge badge-genre" data-testid="book-genre-${book.id}">${escapeHtml(book.genero)}</span>
        <span class="badge badge-year"  data-testid="book-year-${book.id}">${book.ano}</span>
        <span class="badge ${book.lido ? 'badge-read' : 'badge-unread'}" data-testid="book-lido-${book.id}">${book.lido ? '✅ Lido' : '📖 Não lido'}</span>
        ${book.score ? `<span class="badge badge-score" data-testid="book-score-${book.id}">⭐ ${book.score}/5</span>` : ''}
      </div>
    </div>
    <div class="book-actions">
      <button class="btn btn-secondary" data-testid="btn-edit-${book.id}" onclick="event.stopPropagation(); openEditForm(${book.id})">
        ✏️ Editar
      </button>
      <button class="btn btn-danger" data-testid="btn-delete-${book.id}" onclick="event.stopPropagation(); confirmDelete(${book.id}, '${escapeHtml(book.titulo)}')"> 
        🗑️ Deletar
      </button>
    </div>
  `;

  card.addEventListener('click', () => openDetailModal(book.id));

  return card;
}

// ── Search / Filter ──────────────────────────────────
function filterBooks(query) {
  const q = query.toLowerCase().trim();
  if (!q) return allBooks;
  return allBooks.filter(
    (b) =>
      b.titulo.toLowerCase().includes(q) ||
      b.autor.toLowerCase().includes(q) ||
      b.genero.toLowerCase().includes(q)
  );
}

searchInput.addEventListener('input', () => {
  const filtered = filterBooks(searchInput.value);
  renderBooks(filtered);
});

// ── Modal / Form ─────────────────────────────────────
function openAddForm() {
  modalTitle.textContent = 'Adicionar Livro';
  bookForm.reset();
  bookIdInput.value = '';
  btnSubmit.textContent = 'Salvar';
  setFormStarUI(0);
  clearFormErrors();
  showModal(modalOverlay);
}

function openEditForm(id) {
  const book = allBooks.find((b) => b.id === id);
  if (!book) return;

  modalTitle.textContent = 'Editar Livro';
  bookIdInput.value = book.id;
  document.getElementById('titulo').value      = book.titulo;
  document.getElementById('autor').value       = book.autor;
  document.getElementById('genero').value      = book.genero;
  document.getElementById('ano').value         = book.ano;
  document.getElementById('imagem').value      = book.imagem;
  document.getElementById('lido').checked      = !!book.lido;
  document.getElementById('form-sinopse').value = book.sinopse || '';
  document.getElementById('form-review').value  = book.review  || '';
  setFormStarUI(book.score || 0);
  btnSubmit.textContent = 'Atualizar';
  clearFormErrors();
  showModal(modalOverlay);
}

function closeForm() {
  hideModal(modalOverlay);
  bookForm.reset();
  clearFormErrors();
}

function showModal(overlay) {
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function hideModal(overlay) {
  overlay.hidden = true;
  document.body.style.overflow = '';
}

function setStarUI(score) {
  const starBtns = detailStars.querySelectorAll('.star');
  starBtns.forEach((btn) => {
    const v = parseInt(btn.getAttribute('data-value'));
    btn.classList.toggle('active', v <= score);
  });
  starHint.textContent = score > 0 ? starLabels[score] : 'Sem avaliação';
}

function openDetailModal(id) {
  const book = allBooks.find((b) => b.id === id);
  if (!book) return;

  // Populate
  detailTitleEl.textContent  = book.titulo;
  detailAuthorEl.textContent = book.autor;
  detailGenreEl.textContent  = book.genero;
  detailYearEl.textContent   = book.ano;

  // Lido badge
  detailLidoBadge.textContent  = book.lido ? '✅ Lido' : '📖 Não lido';
  detailLidoBadge.className    = `badge ${book.lido ? 'badge-read' : 'badge-unread'}`;

  // Cover
  if (book.imagem) {
    detailCover.src      = book.imagem;
    detailCover.alt      = `Capa do livro ${book.titulo}`;
    detailCover.hidden   = false;
    detailCoverPh.hidden = true;
    detailCover.onerror  = () => {
      detailCover.hidden   = true;
      detailCoverPh.hidden = false;
    };
  } else {
    detailCover.hidden   = true;
    detailCoverPh.hidden = false;
  }

  // Texts
  detailSinopse.textContent = book.sinopse || 'Nenhuma sinopse disponível.';
  detailReview.textContent  = book.review  || 'Nenhuma review disponível.';

  // Stars
  setStarUI(book.score || 0);

  showModal(detailOverlay);
}

function closeDetailModal() {
  hideModal(detailOverlay);
}

// Detail modal close
if (btnCloseDetail) btnCloseDetail.addEventListener('click', closeDetailModal);
if (btnDetailCloseBottom) btnDetailCloseBottom.addEventListener('click', closeDetailModal);
if (detailOverlay) {
  detailOverlay.addEventListener('click', (e) => {
    if (e.target === detailOverlay) closeDetailModal();
  });
}


function clearFormErrors() {
  document.querySelectorAll('.field-error').forEach((el) => (el.textContent = ''));
  document.querySelectorAll('input').forEach((el) => el.classList.remove('is-invalid'));
}

function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(`error-${fieldId}`);
  if (input) input.classList.add('is-invalid');
  if (errorEl) errorEl.textContent = message;
}

function isValidUrl(url) {
  try { new URL(url); return true; } catch { return false; }
}

/**
 * Client-side validation. Returns true if valid.
 * @param {Object} data
 * @returns {boolean}
 */
function validateForm(data) {
  clearFormErrors();
  let valid = true;

  if (!data.titulo.trim()) {
    showFieldError('titulo', 'Título é obrigatório.');
    valid = false;
  }
  if (!data.autor.trim()) {
    showFieldError('autor', 'Autor é obrigatório.');
    valid = false;
  }
  if (!data.genero.trim()) {
    showFieldError('genero', 'Gênero é obrigatório.');
    valid = false;
  }
  if (!data.ano || data.ano === '') {
    showFieldError('ano', 'Ano é obrigatório.');
    valid = false;
  } else if (isNaN(data.ano) || !Number.isInteger(Number(data.ano))) {
    showFieldError('ano', 'Ano deve ser um número inteiro.');
    valid = false;
  }
  if (!data.imagem.trim()) {
    showFieldError('imagem', 'URL da imagem é obrigatória.');
    valid = false;
  } else if (!isValidUrl(data.imagem)) {
    showFieldError('imagem', 'URL da imagem inválida.');
    valid = false;
  }

  return valid;
}

// ── Form Submit ──────────────────────────────────────
bookForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    titulo:  document.getElementById('titulo').value,
    autor:   document.getElementById('autor').value,
    genero:  document.getElementById('genero').value,
    ano:     document.getElementById('ano').value,
    imagem:  document.getElementById('imagem').value,
    lido:    document.getElementById('lido').checked,
    sinopse: document.getElementById('form-sinopse').value,
    review:  document.getElementById('form-review').value,
    score:   formScore,
  };

  if (!validateForm(data)) return;

  const id = bookIdInput.value;
  const isEditing = !!id;

  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Salvando...';

  try {
    if (isEditing) {
      await apiFetch(`${API_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      showToast('Livro atualizado com sucesso!', 'success');
    } else {
      await apiFetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      showToast('Livro adicionado com sucesso!', 'success');
    }
    closeForm();
    await fetchBooks();
  } catch (err) {
    showToast('Erro: ' + err.message, 'error');
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = isEditing ? 'Atualizar' : 'Salvar';
  }
});

// ── Delete ───────────────────────────────────────────
function confirmDelete(id, titulo) {
  pendingDeleteId = id;
  document.getElementById('confirm-text').textContent =
    `Tem certeza que deseja deletar "${titulo}"? Esta ação não pode ser desfeita.`;
  showModal(confirmOverlay);
}

btnConfirmDelete.addEventListener('click', async () => {
  if (!pendingDeleteId) return;
  btnConfirmDelete.disabled = true;
  btnConfirmDelete.textContent = 'Deletando...';
  try {
    await apiFetch(`${API_URL}/${pendingDeleteId}`, { method: 'DELETE' });
    showToast('Livro deletado com sucesso!', 'success');
    hideModal(confirmOverlay);
    await fetchBooks();
  } catch (err) {
    showToast('Erro ao deletar: ' + err.message, 'error');
  } finally {
    btnConfirmDelete.disabled = false;
    btnConfirmDelete.textContent = 'Deletar';
    pendingDeleteId = null;
  }
});

btnConfirmCancel.addEventListener('click', () => {
  hideModal(confirmOverlay);
  pendingDeleteId = null;
});

// ── Event Listeners ──────────────────────────────────
if (btnOpenForm) btnOpenForm.addEventListener('click', openAddForm);
if (btnCloseForm) btnCloseForm.addEventListener('click', closeForm);
if (btnCancel) btnCancel.addEventListener('click', closeForm);

// Close modal clicking outside
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeForm();
  });
}
if (confirmOverlay) {
  confirmOverlay.addEventListener('click', (e) => {
    if (e.target === confirmOverlay) {
      hideModal(confirmOverlay);
      pendingDeleteId = null;
    }
  });
}

// ── Utilities ────────────────────────────────────────
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

// ── Init ─────────────────────────────────────────────
fetchBooks();
