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

    var buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');

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

    buttonsContainer.appendChild(removeRowButton);
    buttonsContainer.appendChild(moveRowButton);
    buttonsContainer.appendChild(upMoveRowButton); // Adiciona o botão de subir
    buttonsContainer.appendChild(downMoveRowButton); // Adiciona o botão de descer

    row.appendChild(buttonsContainer);
    row.appendChild(componentsContainer);
    
    row.ondragover = allowDrop;
    row.ondrop = dropComponentInRow;

    row.onmouseover = function() {
        buttonsContainer.style.display = 'block';
    };
    row.onmouseout = function() {
        buttonsContainer.style.display = 'none';
    };

    dropArea.appendChild(row);
}

function allowDrop(event) {
    event.preventDefault();
}

function dropComponentInRow(event) {
    event.preventDefault();
    var draggedRow = window.currentMovingElement;
    var dropArea = document.getElementById("box1");
    var afterElement = getDragAfterElement(dropArea, event.clientY);

    if (afterElement == null) {
        dropArea.appendChild(draggedRow); // Se não houver próximo elemento, coloca no final
    } else {
        dropArea.insertBefore(draggedRow, afterElement); // Insere antes do próximo elemento
    }

    draggedRow.style.opacity = "1";
}

function getDragAfterElement(container, y) {
    var draggableElements = [...container.querySelectorAll('.form_row:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        var box = child.getBoundingClientRect();
        var offset = y - box.top - box.height / 2;

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
    }
});

// Detectar quando o item deixa de ser arrastado
document.addEventListener('dragend', function(e) {
    if (e.target.classList.contains('dragging')) {
        e.target.classList.remove('dragging');
        e.target.style.opacity = "1";
    }
});
