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
    newElement.innerHTML = getinput + getEditButton() + getRemoveButton() + getMoveButton();
    targetRow.querySelector('.components-container').appendChild(newElement);
}

function dropRow(e) {
    e.preventDefault();
    if (draggedRow) {
        const allRows = [...document.querySelectorAll('.form_row')];
        const afterElement = getDragAfterElement(allRows, e.clientY);
        if (afterElement) {
            afterElement.parentNode.insertBefore(draggedRow, afterElement);
        } else {
            e.target.appendChild(draggedRow);
        }
    }
    draggedRow = null; // Limpa a variável após o drop
}
// Função para identificar o elemento após o qual a linha arrastada deve ser colocada
function getDragAfterElement(rows, y) {
    return rows.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2; // Calcula a posição do mouse em relação ao meio do elemento
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }; // Se o offset é menor que o atual, atualiza
        } else {
            return closest; // Caso contrário, mantém o mais próximo encontrado
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element; // Inicializa com um valor baixo
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

function getMoveButton() {
    return '<button class="btn btn-info btn-sm btn-move bi bi-arrows-move" onmousedown="moveComponent(this)" onmouseup="stopMove()"></button>';
}

function moveComponent(button) {
    var element = button.parentElement;

    // Definir o elemento como "arrastável"
    element.setAttribute('draggable', 'true');
    element.addEventListener('dragstart', dragComponent);

    // Reduzir a opacidade do componente para indicar que ele está sendo movido
    element.style.opacity = "0.5";

    // Armazenar referência ao elemento sendo movido
    window.currentMovingElement = element;
}

function stopMove() {
    // Interromper o arrasto
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

    // Checar se o elemento está sendo movido
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
        targetRow.querySelector('.components-container').appendChild(newElement);

        // Remover o componente da linha anterior
        window.currentMovingElement.remove();
        window.currentMovingElement = null;
    }
}