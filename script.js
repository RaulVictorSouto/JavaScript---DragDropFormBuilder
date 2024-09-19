window.onload = function() {
    // Adiciona a primeira linha ao carregar a página
    addRow();
};

function back() {
    document.getElementById("box1").style.background = "none";
    document.getElementById("box1").style.border = "none";
}

function allowDrop(event) {
    event.preventDefault();
    event.target.classList.add('dragover');
}

function drag(event) {
    event.dataTransfer.setData("a", event.target.id);
}

function drop(event) {
    event.preventDefault();
    event.target.classList.remove('dragover');
    var data = event.dataTransfer.getData("a");
    var getinput = document.getElementById(data).getAttribute('data-input');

    // Identifica a linha onde o componente foi solto
    var dropArea = document.getElementById("box1");
    var targetRow = event.target.closest('.form_row');

    if (!targetRow) {
        alert('Adicione uma linha primeiro!');
        return;
    }

    // Adiciona o componente na linha correta
    var newElement = document.createElement('div');
    newElement.classList.add('conteudo_inserido');
    newElement.innerHTML = getinput + getRemoveButton();
    targetRow.querySelector('.components-container').appendChild(newElement);
}

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
    removeRowButton.classList.add('btn', 'btn-danger', 'btn-sm', 'btn-remove', 'remove-row-button');
    removeRowButton.innerHTML = 'X';
    removeRowButton.onclick = function() {
        removeRow(row);
    };

    // Adiciona o botão de remoção à esquerda do contêiner de componentes
    row.appendChild(removeRowButton);
    row.appendChild(componentsContainer);
    
    dropArea.appendChild(row);
}

function getRemoveButton() {
    return '<button class="btn btn-danger btn-sm btn-remove" onclick="removeComponent(this)">Remover</button>';
}

function removeComponent(button) {
    var element = button.parentElement;
    element.remove();
}

function removeRow(row) {
    row.remove();
}
