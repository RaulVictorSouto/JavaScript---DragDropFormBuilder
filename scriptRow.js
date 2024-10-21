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
    row.ondrop = dropRowInRow;

    var componentsContainer = document.createElement('div');
    componentsContainer.classList.add('components-container');
    componentsContainer.id = "components-container-" + Date.now();
    componentsContainer.ondragstart = drag;
    componentsContainer.ondrop = dropComponentInRow;

    var buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');
    buttonsContainer.ondrop = function() {
        handleDropInButtonsContainer(event);
    }

    var removeRowButton = document.createElement('button');
    removeRowButton.classList.add('btn', 'btn-form', 'btn-secondary', 'btn-sm', 'btn-remove');
    removeRowButton.innerHTML = '<i class="bi bi-x"></i>';
    removeRowButton.onclick = function() {
        row.remove(); // Remove a linha
    };

    var moveRowButton = document.createElement('button');
    moveRowButton.classList.add('btn', 'btn-form', 'btn-info', 'btn-sm', 'move-button');
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
    upMoveRowButton.classList.add('btn', 'btn-form', 'btn-info', 'btn-sm', 'move-button', 'up-button');
    upMoveRowButton.innerHTML = '<i class="bi bi-arrow-up"></i>';
    upMoveRowButton.onclick = function() {
        const div = upMoveRowButton.closest('.form_row');
        const previousDiv = div.previousElementSibling;

        if (previousDiv) {
            div.parentNode.insertBefore(div, previousDiv);
        }
    };

    var downMoveRowButton = document.createElement('button');
    downMoveRowButton.classList.add('btn', 'btn-form', 'btn-info', 'btn-sm', 'move-button', 'down-button');
    downMoveRowButton.innerHTML = '<i class="bi bi-arrow-down"></i>';
    downMoveRowButton.onclick = function() {
        const div = downMoveRowButton.closest('.form_row');
        const nextDiv = div.nextElementSibling;

        if (nextDiv) {
            div.parentNode.insertBefore(nextDiv, div);
        }
    };

    var adicionarColButton = document.createElement('button');
    adicionarColButton.classList.add('btn', 'btn-form', 'btn-info', 'btn-sm', 'addCol-button');
    adicionarColButton.innerHTML = '<i class="bi bi-plus-square"> Adicionar Coluna</i>';
    adicionarColButton.onclick = function() {
        addNewCol(this); // Passa o botão clicado para a função
    };

    buttonsContainer.appendChild(removeRowButton);
    buttonsContainer.appendChild(moveRowButton);
    buttonsContainer.appendChild(upMoveRowButton);
    buttonsContainer.appendChild(downMoveRowButton);
    buttonsContainer.appendChild(adicionarColButton);

    row.appendChild(buttonsContainer);
    row.appendChild(componentsContainer);
    
    row.ondragover = allowDrop;
    row.ondrop = dropRowInRow;

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


function dropRowInRow(event) {
    event.preventDefault();

    var draggedRow = window.currentMovingElement;
    var targetRow = event.target.closest('.form_row');
    var targetContainer = event.target.closest('.components-container');

    // Verifica se o alvo é válido
    if (!targetRow || draggedRow === targetRow || !draggedRow.classList.contains('form_row') || (targetContainer && targetContainer.classList.contains('col'))) {
        return;
    }

    const container = targetRow.parentElement;
    const afterElement = getDragAfterElement(container, event.clientY);

    // Remove as classes de destaque
    clearHoverEffect();

    // Adiciona a linha no local correto
    if (afterElement === null) {
        container.appendChild(draggedRow);
    } else {
        container.insertBefore(draggedRow, afterElement);
    }

    // Restaura a opacidade original da linha arrastada
    draggedRow.style.opacity = '1';
    draggedRow.classList.remove('dragging');
    window.currentMovingElement = null;
}

// Adiciona o estilo de arrastando
document.addEventListener('dragstart', function(e) {
    if (e.target.classList.contains('form_row')) {
        e.target.classList.add('dragging');
        e.target.style.opacity = '0.5'; // Reduz a opacidade durante o arrasto
        window.currentMovingElement = e.target;
    }
});

// Remove o estilo de arrastando e o efeito ao terminar
document.addEventListener('dragend', function(e) {
    if (e.target.classList.contains('dragging')) {
        e.target.classList.remove('dragging');
        e.target.style.opacity = '1'; // Restaura a opacidade original ao terminar o arrasto
    }
    clearHoverEffect();
});

// Função para limpar o efeito de hover
function clearHoverEffect() {
    document.querySelectorAll('.form_row.hovered').forEach(el => el.classList.remove('hovered'));
}

// Função para determinar onde a linha arrastada deve ser posicionada
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.form_row:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 4;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Função para adicionar o efeito de borda quando o usuário arrasta a linha sobre outra linha
document.addEventListener('dragover', function(e) {
    e.preventDefault();

    const targetRow = e.target.closest('.form_row');

    if (!targetRow) {
        return;
    }

    // Limpa o efeito de hover anterior
    clearHoverEffect();

    // Adiciona a classe .hovered à linha alvo para mudar a borda
    targetRow.classList.add('hovered');
});

