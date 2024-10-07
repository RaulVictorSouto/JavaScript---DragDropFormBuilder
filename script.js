let elementCount = 0; // Contador global para IDs de elementos

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
    var targetRow = event.target.closest('.form_row');
    if (!targetRow) {
        alert('Adicione uma linha primeiro!');
        return;
    }

    // Adiciona o componente na linha correta
    var newElement = document.createElement('div');
    newElement.classList.add('conteudo_inserido');
    newElement.setAttribute('onmouseover', 'showControlButtons(this)');
    newElement.setAttribute('onmouseout', 'hideControlButtons(this)');
    newElement.innerHTML = getinput + getControlButtons();

    // Atribui IDs aos elementos internos
    assignIDsToInnerElements(newElement);

    targetRow.querySelector('.components-container').appendChild(newElement);
}

// Função para atribuir IDs aos elementos internos
function assignIDsToInnerElements(conteudoInserido) {
    var innerElements = conteudoInserido.querySelectorAll('.conteudo > *'); // Seleciona todos os elementos dentro da div 'conteudo'

    for (var i = 0; i < innerElements.length; i++) {
        if (!innerElements[i].id) { // Atribui um ID apenas se não tiver um
            elementCount++; // Incrementa o contador para cada elemento que não possui ID
            innerElements[i].id = 'elemento' + elementCount; // Atribui um ID único aos elementos internos
        }
    }
}

function showControlButtons(component) {
    var controlButtons = component.querySelector('.control-buttons');
    if (controlButtons) {
        controlButtons.style.display = 'block';
    }
}

function hideControlButtons(component) {
    var controlButtons = component.querySelector('.control-buttons');
    if (controlButtons) {
        controlButtons.style.display = 'none';
    }
}

function getRemoveButton() {
    return '<button class="btn btn-secondary btn-sm btn-remove bi bi-x" onclick="removeComponent(this)"></button>';
}

function removeComponent(button) {
    var conteudoInserido = button.closest('.conteudo_inserido');
    if (conteudoInserido) {
        // Remover IDs dos elementos ao remover a div
        var innerElements = conteudoInserido.querySelectorAll('.conteudo > *');
        innerElements.forEach(function(element) {
            element.id = ''; // Limpa o ID antes de remover, se necessário
        });
        conteudoInserido.remove(); // Remove a div inteira
    }
}

function getEditButton() {
    return '<button class="btn btn-info btn-sm btn-edit bi bi-pencil-square" onclick="editComponent(this)"></button>';
}

function getMoveButton() {
    return '<button class="btn btn-info btn-sm btn-move bi bi-arrows-move" onmousedown="moveComponent(this)" onmouseup="stopMove()"></button>';
}

function getControlButtons() {
    return '<div class="control-buttons" style="display: none">' + 
               getEditButton() + 
               getRemoveButton() + 
               getMoveButton() + 
           '</div>';
}

function moveComponent(button) {
    var element = button.closest('.conteudo_inserido');
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
    event.target.classList.remove('dragover');

    if (window.currentMovingElement) {
        var targetRow = event.target.closest('.form_row');

        if (!targetRow) {
            alert('Adicione uma linha primeiro!');
            return;
        }

        // Criar um novo elemento na nova linha com os mesmos dados
        var newElement = document.createElement('div');
        newElement.classList.add('conteudo_inserido');
        newElement.innerHTML = window.currentMovingElement.innerHTML;

        // Atribuir IDs aos elementos internos apenas se eles não tiverem
        assignIDsToInnerElements(newElement); // Isso não deve adicionar novos IDs ao mover

        targetRow.querySelector('.components-container').appendChild(newElement);

        // Remover o componente da linha anterior
        window.currentMovingElement.remove();
        window.currentMovingElement = null;

        newElement.setAttribute('onmouseover', 'showControlButtons(this)');
        newElement.setAttribute('onmouseout', 'hideControlButtons(this)');
    }
}

