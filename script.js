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
    var elementType = document.getElementById(data).getAttribute('data-type');
    var getinput = document.getElementById(data).getAttribute('data-input');
    var dropArea = document.getElementById("box1");

    // Verifica se há uma form_row onde adicionar o componente
    var lastRow = dropArea.querySelector(".form_row:last-child");

    if (!lastRow) {
        alert('Adicione uma linha primeiro!');
        return;
    }

    // Adiciona o componente na última linha
    var newElement = document.createElement('div');
    newElement.classList.add('conteudo_inserido');
    newElement.innerHTML = getinput + getRemoveButton();
    lastRow.appendChild(newElement);
}

function addRow() {
    var dropArea = document.getElementById("box1");
    var row = document.createElement('div');
    row.classList.add('form_row');

    // Cria o botão de remoção de linha
    var removeRowButton = document.createElement('button');
    removeRowButton.classList.add('btn', 'btn-danger', 'btn-sm', 'btn-remove');
    removeRowButton.innerHTML = 'Remover Linha';
    removeRowButton.onclick = function() {
        removeRow(row);
    };

    // Adiciona o botão de remoção à linha
    row.appendChild(removeRowButton);
    
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
