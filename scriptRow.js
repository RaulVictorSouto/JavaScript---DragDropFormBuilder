// Quando a janela é carregada, adiciona a primeira linha ao carregar a página
window.onload = function() {
    addRow();
};

// Função que adiciona uma nova linha à área de drop
function addRow() {
    var dropArea = document.getElementById("box1");
    
    var row = document.createElement('div');
    row.classList.add('form_row');
    row.id = "row-" + Date.now();

    var componentsContainer = document.createElement('div');
    componentsContainer.classList.add('components-container');
    componentsContainer.id = "components-container-" + Date.now();

    var buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');
    buttonsContainer.ondrop = function() {
        handleDropInButtonsContainer(event);
    }

    var removeRowButton = document.createElement('button');
    removeRowButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'btn-remove');
    removeRowButton.innerHTML = '<i class="bi bi-x"></i>';
    removeRowButton.onclick = function() {
        row.remove(); // Remove a linha
    };

    var moveRowButton = document.createElement('button');
    moveRowButton.classList.add('btn', 'btn-info', 'btn-sm', 'move-button');
    moveRowButton.innerHTML = '<i class="bi bi-arrows-move"></i>';
    moveRowButton.onmousedown = function() {
        row.setAttribute('draggable', 'true');
        row.style.opacity = "0.5";
        window.currentMovingElement = row;
    };
    moveRowButton.onmouseup = function() {
        row.setAttribute('draggable', 'false');
        row.style.opacity = "1";
    };

    var upMoveRowButton = document.createElement('button');
    upMoveRowButton.classList.add('btn', 'btn-info', 'btn-sm', 'move-button', 'up-button');
    upMoveRowButton.innerHTML = '<i class="bi bi-arrow-up"></i>';
    upMoveRowButton.onclick = function() {
        const div = upMoveRowButton.closest('.form_row');
        const previousDiv = div.previousElementSibling;

        if (previousDiv) {
            div.parentNode.insertBefore(div, previousDiv);
        }
    };

    var downMoveRowButton = document.createElement('button');
    downMoveRowButton.classList.add('btn', 'btn-info', 'btn-sm', 'move-button', 'down-button');
    downMoveRowButton.innerHTML = '<i class="bi bi-arrow-down"></i>';
    downMoveRowButton.onclick = function() {
        const div = downMoveRowButton.closest('.form_row');
        const nextDiv = div.nextElementSibling;

        if (nextDiv) {
            div.parentNode.insertBefore(nextDiv, div);
        }
    };

    buttonsContainer.appendChild(removeRowButton);
    buttonsContainer.appendChild(moveRowButton);
    buttonsContainer.appendChild(upMoveRowButton);
    buttonsContainer.appendChild(downMoveRowButton);

    row.appendChild(buttonsContainer);
    row.appendChild(componentsContainer);
    
    row.ondragover = allowDrop;
    row.ondrop = dropComponentInRow;

    row.onmouseover = function() {
        buttonsContainer.style.display = 'block';
        showControlsImage(this);
        showControlsOption(this);
    };
    row.onmouseout = function() {
        buttonsContainer.style.display = 'none';
        hideControlsImage(this);
        hideControlsOption(this);
    };

    dropArea.appendChild(row);
}

// Função para determinar onde a row arrastada deve ser posicionada
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.form_row:not(.dragging)')];

    // Encontra o elemento mais próximo que deve ficar após a row arrastada
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Detectar quando o item começa a ser arrastado
document.addEventListener('dragstart', function(e) {
    if (e.target.classList.contains('form_row')) {
        e.target.classList.add('dragging');
        window.currentMovingElement = e.target; // Armazena o elemento que está sendo arrastado
    }
});

// Detectar quando o item deixa de ser arrastado
document.addEventListener('dragend', function(e) {
    if (e.target.classList.contains('dragging')) {
        e.target.classList.remove('dragging');
        e.target.style.opacity = "1";
    }
});
