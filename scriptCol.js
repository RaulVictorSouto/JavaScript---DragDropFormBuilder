//Script para adição de colunas

function addNewCol(button) {
    // Encontre a div form_row mais próxima do botão clicado
    var formRow = button.closest('.form_row');

    // Crie uma nova div components-container
    var newComponentsContainer = document.createElement('div');
    newComponentsContainer.classList.add('components-container', 'col');

    // Insira a nova components-container dentro da form_row
    formRow.appendChild(newComponentsContainer);

    // Exibir um aviso no console
    console.log("Nova coluna adicionada dentro da form_row.");
}
