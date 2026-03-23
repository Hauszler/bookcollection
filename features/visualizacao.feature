# language: pt

Funcionalidade: Visualização e Busca de Livros
  Como um colecionador de livros
  Desejo visualizar minha coleção e buscar títulos específicos
  Para que eu possa gerenciar minhas leituras de forma eficiente

  Contexto:
    Dado que eu acessei a página principal do Book Collection App

  Cenário: Visualizar a lista de livros após o carregamento
    Então devo ver o grid de livros "books-grid" visível
    E devo ver pelo menos 3 cards de livros na coleção

  Cenário: Buscar um livro pelo título
    Quando eu digitar "Dom Casmurro" no campo de busca "search-input"
    Então devo ver apenas o card do livro "Dom Casmurro" no grid

  Cenário: Visualizar detalhes de um livro (Modo Leitura)
    Quando eu clicar no card do livro "Dom Casmurro"
    Então o modal de detalhes "detail-overlay" deve ser exibido
    E o título no detalhe deve ser "Dom Casmurro"
    E a sinopse deve conter informações sobre "Bentinho"
    E o review deve ser exibido como somente leitura
    E as estrelas de avaliação "detail-stars" devem estar visíveis
    Quando eu clicar no botão de fechar do modal
    Então o modal de detalhes deve ser fechado

  Cenário: Buscar um termo inexistente
    Quando eu digitar "Livro que Não Existe" no campo de busca "search-input"
    Então devo ver o estado vazio "empty-state" na tela
