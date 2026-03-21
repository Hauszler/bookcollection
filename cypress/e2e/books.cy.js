describe('Sistema de Gerenciamento de Livros', () => {
  const baseUrl = 'http://localhost:5500'; // ajuste para sua URL local

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('deve exibir a lista de livros corretamente', () => {
    cy.get('[data-testid="books-grid"]').should('be.visible');
    cy.get('.book-card').should('have.length.at.least', 3); // Seed data
  });

  it('deve visualizar os detalhes de um livro (modo leitura)', () => {
    // Clica no card de Dom Casmurro
    cy.contains('Dom Casmurro').click();
    
    // Verifica se o modal abriu
    cy.get('[data-testid="detail-overlay"]').should('be.visible');
    cy.get('[data-testid="detail-title"]').should('have.text', 'Dom Casmurro');
    
    // Verifica sinopse e review (read-only)
    cy.get('[data-testid="detail-sinopse"]').should('contain', 'Bentinho');
    cy.get('[data-testid="detail-review"]').should('contain', 'maiores clássicos');
    
    // Verifica estrelas fixas
    cy.get('[data-testid="detail-stars"]').should('be.visible');
    
    // Fecha o modal
    cy.get('[data-testid="btn-detail-close-bottom"]').click();
    cy.get('[data-testid="detail-overlay"]').should('be.hidden');
  });

  it('deve validar novos campos no formulário de cadastro', () => {
    cy.get('[data-testid="btn-open-form"]').click();
    
    // Verifica novos campos
    cy.get('[data-testid="input-sinopse"]').should('be.visible');
    cy.get('[data-testid="input-review"]').should('be.visible');
    cy.get('[data-testid="form-stars"]').should('be.visible');
    
    // Testa interação de estrelas no form
    cy.get('[data-testid="form-star-5"]').click();
    cy.get('[data-testid="form-star-hint"]').should('contain', 'Excelente');
    
    cy.get('[data-testid="btn-cancel"]').click();
  });
});
