function addNewCol(button) {
    // Encontre a div form_row mais próxima do botão clicado
    var formRow = button.closest('.form_row');
    var colContainers = formRow.querySelectorAll('.components-container.col');

    if (colContainers.length === 0) {
        // Se não houver colunas, cria duas novas colunas
        createNewColumns(formRow);
    } else {
        // Se já existirem colunas, simplesmente cria uma nova coluna
        createColumn(formRow);
    }
}

function createNewColumns(formRow) {
    var regularContainer = formRow.querySelector('.components-container');

    if (regularContainer) {
        // Criar duas novas divs 'components-container col'
        for (let i = 0; i < 2; i++) {
            createColumn(formRow, regularContainer);
        }

        // Remover o 'components-container' regular
        regularContainer.remove();
        console.log("Div 'components-container' removida e duas colunas 'components-container col' adicionadas.");
    }
}

function createColumn(formRow, regularContainer) {
    var newComponentsContainer = document.createElement('div');
    newComponentsContainer.classList.add('components-container', 'col');
    newComponentsContainer.ondrop = handleColDrop;

    // Chamar função para criar os botões e adicionar ao container
    createButtons(newComponentsContainer, formRow);

    if (regularContainer) {
        // Mover os elementos internos da regularContainer para a nova coluna
        while (regularContainer.firstChild) {
            newComponentsContainer.appendChild(regularContainer.firstChild);
        }
    }

    // Insira a nova 'components-container col' dentro da form_row
    formRow.appendChild(newComponentsContainer);
    console.log("Nova coluna adicionada dentro da form_row.");

    initializeDragAndDropCol();
}

// Função para criar os botões de mover e remover
function createButtons(container, formRow) {
    var buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container-col');

    // Criação dos botões
    createButton(buttonContainer, 'btn-remove', '<i class="bi bi-x"></i>', () => removeCol(container, formRow), 'btn-secondary');
    createButton(buttonContainer, 'btn-move', '<i class="bi bi-arrows-move"></i>', () => {
        container.setAttribute('draggable', 'true');
        container.style.opacity = "0.5";
        window.currentMovingElement = container;
    }, 'btn-info'); // Mantém a classe primary
    createButton(buttonContainer, 'btn-left', '<i class="bi bi-arrow-left"></i>', moveColLeft, 'btn-info'); // Mantém a classe primary
    createButton(buttonContainer, 'btn-right', '<i class="bi bi-arrow-right"></i>', moveColRight, 'btn-info'); // Mantém a classe primary

    // Adicionar div de botões ao novo container de colunas
    container.appendChild(buttonContainer);

    // Adicionar eventos para mostrar e esconder os botões
    toggleButtonVisibility(container, buttonContainer);
}

function createButton(container, className, innerHTML, onClick, additionalClass) {
    var button = document.createElement('button');
    button.classList.add('btn', 'btn-sm', className);
    if (additionalClass) {
        button.classList.add(additionalClass); // Adiciona a classe adicional, se fornecida
    }
    button.innerHTML = innerHTML; // Use innerHTML para adicionar o ícone
    button.onclick = onClick;
    container.appendChild(button);
}



// Funções para mover colunas para esquerda e direita
function moveColLeft() {
    moveColumn(this, -1);
}

function moveColRight() {
    moveColumn(this, 1);
}

function moveColumn(button, direction) {
    const colDiv = button.closest('.components-container.col');
    const siblingCol = direction === -1 ? colDiv.previousElementSibling : colDiv.nextElementSibling;

    if (siblingCol && siblingCol.classList.contains('col')) {
        colDiv.parentNode.insertBefore(colDiv, siblingCol);
    }
}

// Função para mostrar e esconder os botões
function toggleButtonVisibility(container, buttonContainer) {
    container.addEventListener('mouseenter', () => {
        buttonContainer.style.display = 'flex'; // Exibe os botões ao passar o mouse
    });

    container.addEventListener('mouseleave', () => {
        buttonContainer.style.display = 'none'; // Esconde os botões ao sair o mouse
    });
}

// Função para remover coluna
function removeCol(container, formRow) {
    container.remove();
    var colContainers = formRow.querySelectorAll('.components-container.col');

    if (colContainers.length === 1) {
        colContainers[0].classList.remove('col');
        removeButtons(colContainers[0]);
        console.log("A última coluna se tornou 'components-container'.");
    } else if (colContainers.length === 0) {
        console.log("Não há mais colunas 'components-container col'.");
    } else {
        console.log("Uma coluna foi removida.");
    }
}

// Função para remover botões
function removeButtons(container) {
    var buttons = container.querySelectorAll('.btn-remove, .btn-move, .btn-left, .btn-right');
    buttons.forEach(button => button.remove());
}

// Sistema arrasta e solta
function initializeDragAndDropCol() {
    document.querySelectorAll('.form_row .components-container.col').forEach(col => {
        col.setAttribute('draggable', 'true');
        col.addEventListener('dragstart', handleColDragStart);
        col.addEventListener('dragend', handleColDragEnd);
    });
}

// Funções de arrastar e soltar
function handleColDragStart(event) {
    const draggedElement = event.target;
    draggedElement.classList.add('dragging');
    window.currentMovingCol = draggedElement;

    document.querySelectorAll('.form_row, .components-container.col').forEach(target => {
        target.addEventListener('dragover', handleColDragOver);
        target.addEventListener('drop', handleColDrop);
    });
}

function handleColDragEnd(event) {
    const draggedElement = event.target;
    draggedElement.classList.remove('dragging');

    document.querySelectorAll('.form_row, .components-container.col').forEach(target => {
        target.removeEventListener('dragover', handleColDragOver);
        target.removeEventListener('drop', handleColDrop);
    });
}

function handleColDragOver(event) {
    event.preventDefault();
    const container = event.currentTarget;
    const dragging = document.querySelector('.dragging');

    if (container.classList.contains('form_row')) {
        if (dragging.classList.contains('col')) {
            container.appendChild(dragging);
        }
    } else if (container.classList.contains('col')) {
        const afterElement = getDragAfterContainerCol(container, event.clientY);
        const formRow = container.closest('.form_row');

        if (formRow) {
            if (afterElement == null) {
                formRow.appendChild(dragging);
            } else {
                formRow.insertBefore(dragging, afterElement);
            }
        }
    }
}

function handleColDrop(event) {
    event.preventDefault();
    const draggedElement = document.querySelector('.dragging');
    draggedElement.classList.remove('dragging');
    draggedElement.style.opacity = "1";

    const formRow = draggedElement.closest('.form_row');
    if (formRow) {
        formRow.appendChild(draggedElement);
    }

    window.currentMovingCol = null;

    document.querySelectorAll('.form_row, .components-container.col').forEach(target => {
        target.removeEventListener('dragover', handleColDragOver);
        target.removeEventListener('drop', handleColDrop);
    });
}

function getDragAfterContainerCol(container, y) {
    const elements = [...container.parentElement.querySelectorAll('.components-container.col:not(.dragging)')];

    return elements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - (box.top + box.height / 2);
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Inicializa o sistema de arrastar e soltar ao carregar a página
document.addEventListener('DOMContentLoaded', initializeDragAndDropCol);
