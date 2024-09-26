window.onload = function() {
    // Adiciona a primeira linha ao carregar a página
    addRow();
};

function addRow() {
    var dropArea = document.getElementById("box1");
    var row = document.createElement('div');
    row.classList.add('form_row');

    // Cria um contêiner para os componentes
    var componentsContainer = document.createElement('div');
    componentsContainer.classList.add('components-container');

    // Adiciona o contêiner de componentes à linha
    row.appendChild(componentsContainer);

    // Cria o botão de remoção de linha
    var removeRowButton = document.createElement('button');
    removeRowButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'btn-remove', 'remove-row-button');
    removeRowButton.innerHTML = '<i class="bi bi-x"></i>';
    removeRowButton.onclick = function() {
        removeRow(row);
    };

    // Cria o botão de movimentação de linha
    var moveRowButton = document.createElement('button');
    moveRowButton.classList.add('btn', 'btn-info', 'btn-sm', 'btn-remove', 'remove-row-button');
    moveRowButton.innerHTML = '<i class="bi bi-arrows-move"></i>';
    moveRowButton.ondragstart = function(e) {
        startDragRow(e, row);
    };
    // Adiciona o botão de remoção à esquerda do contêiner de componentes
    row.appendChild(removeRowButton);
    row.appendChild(moveRowButton);
    row.appendChild(componentsContainer);

    // Definir eventos de "drop" na linha para que componentes possam ser movidos
    row.ondrop = dropComponentInRow;
    row.ondragover = allowDrop;

    dropArea.appendChild(row);
}

function removeRow(row) {
    row.remove();
    row.parentNode.removeChild(row);
}