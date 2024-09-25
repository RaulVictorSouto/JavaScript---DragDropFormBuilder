// Funções relacionadas a Conteúdo
function allowDrop(event) {
    event.preventDefault();
    var targetRow = event.target.closest('.form_row');
    if (targetRow) {
        targetRow.classList.add('dragover');
    }
}

function dragLeave(event) {
    var targetRow = event.target.closest('.form_row');
    if (targetRow) {
        targetRow.classList.remove('dragover');
    }
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
    var targetRow = event.target.closest('.form_row');
    if (!targetRow) {
        alert('Adicione uma linha primeiro!');
        return;
    }

    // Adiciona o componente na linha correta
    var newElement = document.createElement('div');
    newElement.classList.add('conteudo_inserido');
    newElement.innerHTML = getinput + getEditButton() + getRemoveButton() + getMoveButton();
    targetRow.querySelector('.components-container').appendChild(newElement);
}

function getRemoveButton() {
    return '<button class="btn btn-secondary btn-sm btn-remove bi bi-x" onclick="removeComponent(this)"></button>';
}

function removeComponent(button) {
    var element = button.parentElement;
    element.remove();
}

function getEditButton() {
    return '<button class="btn btn-info btn-sm btn-edit bi bi-pencil-square" onclick="editComponent(this)"></button>';
}

function editComponent(button) {
    var element = button.parentElement;

    var targetElement;
    if (element.querySelector('input')) {
        targetElement = element.querySelector('label');
    } else if (element.querySelector('button') && button !== element.querySelector('button')) {
        targetElement = element.querySelector('button');
    } else if (element.querySelector('select')) {
        targetElement = element.querySelector('label');
    }

    if (targetElement) {
        var currentName = targetElement.innerText;
        document.getElementById('componentName').value = currentName;
        $('#editComponentModal').modal('show');
        window.currentEditingElement = targetElement;
    }
}

function saveChanges() {
    var newName = document.getElementById('componentName').value;

    if (window.currentEditingElement) {
        window.currentEditingElement.innerText = newName;
    }

    $('#editComponentModal').modal('hide');
}

function getMoveButton() {
    return '<button class="btn btn-info btn-sm btn-move bi bi-arrows-move" onmousedown="moveComponent(this)" onmouseup="stopMove()"></button>';
}

function moveComponent(button) {
    var element = button.parentElement;
    element.setAttribute('draggable', 'true');
    element.addEventListener('dragstart', dragComponent);
    element.style.opacity = "0.5";
    window.currentMovingElement = element;
}

function stopMove() {
    if (window.currentMovingElement) {
        window.currentMovingElement.setAttribute('draggable', 'false');
        window.currentMovingElement.style.opacity = "1";
        window.currentMovingElement = null;
    }
}

function dragComponent(event) {
    event.dataTransfer.setData("component", window.currentMovingElement.innerHTML);
}

function dropComponentInRow(event) {
    event.preventDefault();
    
    var targetRow = event.target.closest('.form_row');
    if (!targetRow) {
        alert('Adicione uma linha primeiro!');
        return;
    }

    // Remove a classe "dragover"
    targetRow.classList.remove('dragover');

    if (window.currentMovingElement) {
        var newElement = document.createElement('div');
        newElement.classList.add('conteudo_inserido');
        newElement.innerHTML = window.currentMovingElement.innerHTML;
        targetRow.querySelector('.components-container').appendChild(newElement);

        // Remove o elemento original da linha anterior
        window.currentMovingElement.remove();
        window.currentMovingElement = null;
    }
}

var rows = document.querySelectorAll('.form_row');
rows.forEach(row => {
    row.addEventListener('dragleave', dragLeave);
});