# language: pt

Funcionalidade: Gerenciamento de Livros (CRUD)
  Como um colecionador de livros
  Desejo cadastrar, editar e excluir livros
  Para manter minha coleção sempre atualizada

  Contexto:
    Dado que eu acessei a página principal do Book Collection App

  Cenário: Validar campos do formulário de cadastro
    Quando eu clicar no botão de abrir formulário "btn-open-form"
    Então o formulário "book-form" deve ser exibido
    E os campos "input-sinopse" e "input-review" devem estar visíveis
    E as opções de avaliação por estrelas "form-stars" devem estar visíveis

  Cenário: Cadastrar um novo livro com sucesso
    Quando eu clicar no botão de abrir formulário "btn-open-form"
    E eu preencher o título com "O Cortiço"
    E eu preencher o autor com "Aluísio Azevedo"
    E eu preencher o gênero com "Naturalismo"
    E eu preencher o ano com "1890"
    E eu preencher a sinopse com "Um clássico do naturalismo brasileiro."
    E eu selecionar 5 estrelas na avaliação "form-star-5"
    E eu clicar no botão salvar "btn-submit"
    Então devo ver uma notificação "toast" de sucesso
    E o livro "O Cortiço" deve aparecer na lista

  Cenário: Editar um livro existente
    Quando eu clicar no botão de editar "btn-edit-1" do livro com ID 1
    E eu alterar o título para "Dom Casmurro - Edição Especial"
    E eu clicar no botão salvar "btn-submit"
    Então devo ver uma notificação "toast" de sucesso
    E o título do livro deve ser atualizado para "Dom Casmurro - Edição Especial" na lista

  Cenário: Excluir um livro da coleção
    Quando eu clicar no botão de deletar "btn-delete-1" do livro com ID 1
    E eu confirmar a exclusão no botão "btn-confirm-delete"
    Então devo ver uma notificação "toast" de sucesso
    E o livro não deve mais aparecer na lista
