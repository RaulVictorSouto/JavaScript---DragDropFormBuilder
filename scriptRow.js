// Quando a janela é carregada, adiciona a primeira linha ao carregar a página
window.onload = function() {
    addRow();
};

// Função que adiciona uma nova linha à área de drop
function addRow() {
    // Seleciona a área onde as linhas serão adicionadas
    var dropArea = document.getElementById("box1");
    
    // Cria um novo elemento 'div' para a linha
    var row = document.createElement('div');
    row.classList.add('form_row'); // Adiciona a classe 'form_row' à linha

    // Cria um contêiner para os componentes
    var componentsContainer = document.createElement('div');
    componentsContainer.classList.add('components-container'); // Adiciona a classe 'components-container' ao contêiner

    // Cria uma div para os botões
    var buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container'); // Adiciona uma classe para estilização dos botões

    // Cria o botão de remoção de linha
    var removeRowButton = document.createElement('button');
    removeRowButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'btn-remove', 'remove-row-button', 'move-button'); // Adiciona classes ao botão
    removeRowButton.innerHTML = '<i class="bi bi-x"></i>'; // Define o conteúdo HTML do botão como um ícone de remoção
    // Define a ação de clique para remover a linha
    removeRowButton.onclick = function() {
        removeRow(row); // Chama a função removeRow passando a linha atual
    };

    // Cria o botão de movimentação de linha (subir)
    var upMoveRowButton = document.createElement('button');
    upMoveRowButton.classList.add('btn', 'btn-info', 'btn-sm', 'move-button', 'up-button'); // Adiciona classes ao botão
    upMoveRowButton.innerHTML = '<i class="bi bi-arrow-up"></i>'; // Define o conteúdo HTML do botão como um ícone de subir
    // Define a ação de clique para mover a linha para cima
    upMoveRowButton.onclick = function() {
        const div = upMoveRowButton.closest('.form_row'); // Seleciona a linha atual
        const previousDiv = div.previousElementSibling; // Obtém a linha anterior

        // Se houver uma linha anterior, move a linha atual para cima
        if (previousDiv) {
            div.parentNode.insertBefore(div, previousDiv); // Insere a linha atual antes da linha anterior
        }
    };

    // Cria o botão de movimentação de linha (descer)
    var downMoveRowButton = document.createElement('button');
    downMoveRowButton.classList.add('btn', 'btn-info', 'btn-sm', 'move-button', 'down-button'); // Adiciona classes ao botão
    downMoveRowButton.innerHTML = '<i class="bi bi-arrow-down"></i>'; // Define o conteúdo HTML do botão como um ícone de descer
    // Define a ação de clique para mover a linha para baixo
    downMoveRowButton.onclick = function() {
        const div = downMoveRowButton.closest('.form_row'); // Seleciona a linha atual
        const nextDiv = div.nextElementSibling; // Obtém a próxima linha

        // Se houver uma próxima linha, move a linha atual para baixo
        if (nextDiv) {
            div.parentNode.insertBefore(nextDiv, div); // Insere a próxima linha antes da linha atual
        }
    };

    // Adiciona os botões ao contêiner de botões
    buttonsContainer.appendChild(removeRowButton); // Adiciona o botão de remoção
    buttonsContainer.appendChild(upMoveRowButton); // Adiciona o botão de subir
    buttonsContainer.appendChild(downMoveRowButton); // Adiciona o botão de descer

    // Adiciona o contêiner de botões à linha
    row.appendChild(buttonsContainer); // Adiciona o contêiner de botões à linha
    row.appendChild(componentsContainer); // Adiciona o contêiner de componentes à linha

    // Define eventos de "drop" na linha para que componentes possam ser movidos
    row.ondrop = dropComponentInRow; // Define a função que lida com o evento de drop
    row.ondragover = allowDrop; // Define a função que permite o drag over

    // Adiciona a nova linha à área de drop
    dropArea.appendChild(row);
}

// Função que remove uma linha
function removeRow(row) {
    row.remove(); // Remove a linha do DOM
}
