function addNewCol(button) {
    // Encontre a div form_row mais próxima do botão clicado
    var formRow = button.closest('.form_row');

    // Verifique se existem divs com a classe 'components-container col'
    var colContainers = formRow.querySelectorAll('.components-container.col');

    if (colContainers.length === 0) {
        // Se não houver 'components-container col', encontrar a div 'components-container' existente
        var regularContainer = formRow.querySelector('.components-container');

        if (regularContainer) {
            // Criar duas novas divs 'components-container col'
            for (let i = 0; i < 2; i++) {
                var newComponentsContainer = document.createElement('div');
                newComponentsContainer.classList.add('components-container', 'col');

                // Chamar função para criar os botões e adicionar ao container
                createButtons(newComponentsContainer, formRow);

                // Mover os elementos internos da regularContainer para a nova coluna
                while (regularContainer.firstChild) {
                    newComponentsContainer.appendChild(regularContainer.firstChild);
                }

                // Insira a nova 'components-container col' dentro da form_row
                formRow.appendChild(newComponentsContainer);
            }

            // Remova a 'components-container' existente
            regularContainer.remove();
            console.log("Div 'components-container' removida e duas colunas 'components-container col' adicionadas dentro da form_row.");
        }
    } else {
        // Se já existirem colunas, simplesmente cria uma nova coluna
        var newComponentsContainer = document.createElement('div');
        newComponentsContainer.classList.add('components-container', 'col');

        // Chamar função para criar os botões e adicionar ao container
        createButtons(newComponentsContainer, formRow);

        // Insira a nova 'components-container col' dentro da form_row
        formRow.appendChild(newComponentsContainer);

        console.log("Nova coluna adicionada dentro da form_row.");
  
        initializeDragAndDropCol();
    }
}

// Função para criar os botões de mover e remover
function createButtons(container, formRow) {
    // Criar div para agrupar os botões
    var buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container-col'); // Adicione uma classe para estilização

    // Crie o botão de remover
    var removeColButton = document.createElement('button');
    removeColButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'btn-remove');
    removeColButton.innerHTML = '<i class="bi bi-x"></i>'; // Use innerHTML para adicionar o ícone
    removeColButton.onclick = function() {
        removeCol(container, formRow); // Chama a função para remover
    };

    //Botão de movimentação arrasta e solta
    var moveColButton = document.createElement('button');
    moveColButton.classList.add('btn', 'btn-info', 'btn-sm', 'btn-move');
    moveColButton.innerHTML = '<i class="bi bi-arrows-move"></i>'; // Use innerHTML para adicionar o ícone
    moveColButton.onmousedown = function() {
        container.setAttribute('draggable', 'true');
        container.style.opacity = "0.5";
        window.currentMovingElement = container;
    };
    moveColButton.onmouseup = function() {
        container.setAttribute('draggable', 'false');
        container.style.opacity = "1";
    };

    // Mover para esquerda
    var moveLeftColButton = document.createElement('button');
    moveLeftColButton.classList.add('btn', 'btn-info', 'btn-sm', 'btn-left');
    moveLeftColButton.innerHTML = '<i class="bi bi-arrow-left"></i>'; // Use innerHTML para adicionar o ícone
    moveLeftColButton.onclick = function() {
        const colDiv = moveLeftColButton.closest('.components-container.col');
        const previousCol = colDiv.previousElementSibling;

        if (previousCol && previousCol.classList.contains('col')) {
            colDiv.parentNode.insertBefore(colDiv, previousCol);
        }
    };

    // Mover para direita
    var moveRightColButton = document.createElement('button');
    moveRightColButton.classList.add('btn', 'btn-info', 'btn-sm', 'btn-right');
    moveRightColButton.innerHTML = '<i class="bi bi-arrow-right"></i>'; // Use innerHTML para adicionar o ícone
    moveRightColButton.onclick = function() {
        const colDiv = moveRightColButton.closest('.components-container.col');
        const nextCol = colDiv.nextElementSibling;

        if (nextCol && nextCol.classList.contains('col')) {
            colDiv.parentNode.insertBefore(nextCol, colDiv);
        }
    };

    // Adicionar botões à div de botões
    buttonContainer.appendChild(removeColButton);
    buttonContainer.appendChild(moveColButton);
    buttonContainer.appendChild(moveLeftColButton);
    buttonContainer.appendChild(moveRightColButton);

    // Adicionar div de botões ao novo container de colunas
    container.appendChild(buttonContainer);

     // Adicionar eventos para mostrar e esconder os botões
     container.addEventListener('mouseenter', function() {
       buttonContainer.style.display = 'flex'; // Exibe os botões ao passar o mouse
   });

     container.addEventListener('mouseleave', function() {
       buttonContainer.style.display = 'none'; // Esconde os botões ao sair o mouse
    });
}

// Função para remover coluna
function removeCol(container, formRow) {
    // Remove a coluna
    container.remove();

    // Verifica se ainda há colunas
    var colContainers = formRow.querySelectorAll('.components-container.col');

    if (colContainers.length === 1) {
        // Se restar apenas uma coluna, troque a classe para 'components-container'
        colContainers[0].classList.remove('col');
        console.log("A última coluna se tornou 'components-container'.");

        // Remover os botões (se houver)
        var removeButton = colContainers[0].querySelector('.btn-remove');
        var moveButton = colContainers[0].querySelector('.btn-move');
        var lButton = colContainers[0].querySelector('.btn-left');
        var rButton = colContainers[0].querySelector('.btn-right');
        if (removeButton && moveButton && lButton && rButton) {
            removeButton.remove(); // Remove o botão de remoção
            moveButton.remove();
            lButton.remove();
            rButton.remove();
            console.log("Botões removidos.");
        }
    } else if (colContainers.length === 0) {
        // Se não houver colunas, exiba uma mensagem
        console.log("Não há mais colunas 'components-container col'.");
    } else {
        console.log("Uma coluna foi removida.");
    }
}




//Sistema arrasta e solta

function initializeDragAndDropCol() {
    document.querySelectorAll('.components-container.col').forEach(col => {
        col.setAttribute('draggable', 'true');
        col.addEventListener('dragstart', handleColDragStart);
        col.addEventListener('dragend', handleColDragEnd);
    });
}

function handleColDragStart(event) {
    const draggedElement = event.target;
    draggedElement.classList.add('dragging');
    window.currentMovingCol = draggedElement;

    // Permite o drop em todas as colunas e linhas
    document.querySelectorAll('.form_row, .components-container.col').forEach(target => {
        target.addEventListener('dragover', handleColDragOver);
        target.addEventListener('drop', handleColDrop);
    });
}

function handleColDragEnd(event) {
    const draggedElement = event.target;
    draggedElement.classList.remove('dragging');

    // Remove os eventos de dragover e drop
    document.querySelectorAll('.form_row, .components-container.col').forEach(target => {
        target.removeEventListener('dragover', handleColDragOver);
        target.removeEventListener('drop', handleColDrop);
    });
}

function handleColDragOver(event) {
    event.preventDefault(); // Necessário para permitir o drop
    const container = event.currentTarget;

    if (container.classList.contains('form_row')) {
        // Se estiver sobre uma linha, adiciona no final da linha
        container.appendChild(window.currentMovingCol);
    } else if (container.classList.contains('col')) {
        // Se estiver sobre outra coluna, ajusta a posição
        const afterElement = getDragAfterContainerCol(container, event.clientY);
        const dragging = document.querySelector('.dragging');

        if (afterElement == null) {
            container.parentElement.appendChild(dragging); // Adiciona no final
        } else {
            container.parentElement.insertBefore(dragging, afterElement);
        }
    }
}

function handleColDrop(event) {
    event.preventDefault();
    const container = event.currentTarget;
    const draggedElement = document.querySelector('.dragging');
    
    draggedElement.classList.remove('dragging');
    draggedElement.style.opacity = "1";

    if (window.currentMovingCol && window.currentMovingCol !== container) {
        container.appendChild(window.currentMovingCol);
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
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

document.addEventListener('DOMContentLoaded', function() {
    initializeDragAndDropCol();
});

