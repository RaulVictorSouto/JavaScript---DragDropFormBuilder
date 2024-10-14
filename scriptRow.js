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

    var adicionarColButton = document.createElement('button');
    adicionarColButton.classList.add('btn', 'btn-info', 'btn-sm', 'addCol-button');
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


function dropRowInRow(event) {
    console.log('dropRowInRow'); // Log para verificar a chamada da função
    event.preventDefault(); // Impede o comportamento padrão do navegador ao soltar o elemento

    var draggedRow = window.currentMovingElement; // Obtém o elemento que está sendo arrastado
    var targetRow = event.target.closest('.form_row'); // Verifica se o alvo do drop é um form_row
    var targetContainer = event.target.closest('.components-container'); // Verifica se o alvo do drop é um components-container
    // Verifica se o alvo do drop é um form_row, se não é um filho, e se não é um components-container
    if (!targetRow || draggedRow === targetRow || !draggedRow.classList.contains('form_row') || targetContainer) {
        return; // Evita que a linha seja solta se não for um form_row, se for o próprio, ou se estiver dentro de components-container
    }

    // Adiciona a linha no local correto, antes ou depois da linha alvo
    const container = targetRow.parentElement; // Obtém o contêiner pai da linha alvo
    const afterElement = getDragAfterElement(container, event.clientY); // Obtém o elemento após o qual a linha arrastada deve ser inserida

    if (afterElement === null) {
        container.appendChild(draggedRow); // Se não houver linha depois, coloca no final
    } else {
        container.insertBefore(draggedRow, afterElement); // Caso contrário, insere antes do elemento encontrado
    }

    console.log('Linha arrastada:', draggedRow);
    console.log('Linha alvo:', targetRow);
}





// Função para determinar onde a row arrastada deve ser posicionada
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.form_row:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2; // Calcula a posição vertical do mouse

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

