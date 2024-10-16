function addNewCol(button) {
    console.log('AAAAAAAAAA');
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
    //newComponentsContainer.ondrop = handleColDrop;

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
function createButtons(colContainer, formRow) {
    var buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container-col');

    // Criação dos botões
    createButton(buttonContainer, 'btn-remove-col', '<i class="bi bi-x"></i>', () => removeCol(colContainer, formRow), 'btn-secondary');
    createButton(buttonContainer, 'btn-move-col', '<i class="bi bi-arrows-move"></i>', () => turnColDrag(buttonContainer, colContainer), 'btn-info');
    createButton(buttonContainer, 'btn-left-col', '<i class="bi bi-arrow-left"></i>', moveColLeft, 'btn-info'); // Mantém a classe primary
    createButton(buttonContainer, 'btn-right-col', '<i class="bi bi-arrow-right"></i>', moveColRight, 'btn-info'); // Mantém a classe primary

    // Adicionar div de botões ao novo container de colunas
    colContainer.appendChild(buttonContainer);

    // Adicionar eventos para mostrar e esconder os botões
    toggleButtonVisibility(colContainer, buttonContainer);
}

function createButton(colContainer, className, innerHTML, onClick, additionalClass) {
    var button = document.createElement('button'); // Cria um novo elemento de botão
    button.classList.add('btn', 'btn-sm', 'btn-form', className); // Adiciona classes padrão, btn-form e a classe fornecida
    if (additionalClass) {
        button.classList.add(additionalClass); // Adiciona a classe adicional, se fornecida
    }
    button.innerHTML = innerHTML; // Define o conteúdo interno do botão
    button.onclick = onClick; // Define a função de clique
    colContainer.appendChild(button); // Adiciona o botão ao contêiner
}





// Funções para mover colunas para esquerda e direita
function moveColLeft() {
    moveColumn(this, -1); // Passa -1 para mover para a esquerda
}

function moveColRight() {
    moveColumn(this, 1); // Passa 1 para mover para a direita
}

function moveColumn(button, direction) {
    const colDiv = button.closest('.components-container.col');
    const siblingCol = direction === -1 ? colDiv.previousElementSibling : colDiv.nextElementSibling;

    if (siblingCol && siblingCol.classList.contains('col')) {
        if (direction === -1) {
            // Mover para a esquerda
            colDiv.parentNode.insertBefore(colDiv, siblingCol);
        } else {
            // Mover para a direita
            colDiv.parentNode.insertBefore(siblingCol, colDiv);
        }
    }
}


// Função para mostrar e esconder os botões
function toggleButtonVisibility(colContainer, buttonContainer) {
    colContainer.addEventListener('mouseenter', () => {
        buttonContainer.style.display = 'flex'; // Exibe os botões ao passar o mouse
    });

    colContainer.addEventListener('mouseleave', () => {
        buttonContainer.style.display = 'none'; // Esconde os botões ao sair o mouse
    });
}

// Função para remover coluna
function removeCol(colContainer, formRow) {
    colContainer.remove();
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
function removeButtons(colContainer) {
    var buttons = colContainer.querySelectorAll('.btn-remove-col, .btn-move-col, .btn-left-col, .btn-right-col');
    buttons.forEach(button => button.remove());
}



// Sistema arrasta e solta

function turnColDrag(buttonContainer, colContainer){
    // Seleciona o botão que foi criado para adicionar os eventos
    const moveButton = buttonContainer.querySelector('.btn-move-col');

    // Adiciona o evento onmousedown para iniciar o arrasto
    moveButton.onmousedown = () => {
        initializeDragAndDropCol();
        console.log('Iniciar arrasto');
        colContainer.setAttribute('draggable', 'true');
        colContainer.style.opacity = "0.5";
        window.currentMovingElement = colContainer;
    };

    // Adiciona o evento onmouseup para finalizar o arrasto
    moveButton.onmouseup = () => {
        console.log('Terminar arrasto');
        colContainer.setAttribute('draggable', 'false');
        colContainer.style.opacity = "1";
        window.currentMovingElement = null;
    };
}



// Função que é chamada quando uma coluna começa a ser arrastada
function handleColDragStart(event) {
    const draggedElement = event.target; // O elemento que está sendo arrastado
    draggedElement.classList.add('dragging-col'); // Adiciona uma classe visual para indicar que está sendo arrastado
    window.currentMovingCol = draggedElement; // Armazena a coluna atualmente arrastada

    // Adiciona eventos para permitir arrastar sobre outras colunas
    document.querySelectorAll('.form_row .components-container.col').forEach(target => {
        target.addEventListener('dragover', handleColDragOver); // Evento ao passar o mouse sobre a coluna
        target.addEventListener('drop', handleColDrop); // Evento ao soltar a coluna
    });
}

// Função chamada quando o arrasto termina
function handleColDragEnd(event) {
    const draggedElement = event.target; // O elemento que foi arrastado
    draggedElement.classList.remove('dragging-col'); // Remove a classe visual de arraste
    draggedElement.style.opacity = "1"; // Restaura a opacidade original do elemento

    // Remove os eventos de arrastar e soltar das colunas
    document.querySelectorAll('.form_row .components-container.col').forEach(target => {
        target.removeEventListener('dragover', handleColDragOver); // Remove o evento de arrastar
        target.removeEventListener('drop', handleColDrop); // Remove o evento de soltar
    });

    window.currentMovingCol = null; // Limpa a referência do elemento arrastado
}

// Função que lida com o evento de arrastar sobre uma coluna
function handleColDragOver(event) {
    console.log('1'); // Log para depuração, indicando que o evento está ativo
    event.preventDefault(); // Impede o comportamento padrão para permitir que o elemento seja solto

    const dragging = document.querySelector('.dragging-col'); // Seleciona o elemento que está sendo arrastado

    // Verifica se há um elemento sendo arrastado e se o alvo é uma coluna
    if (!dragging || !event.currentTarget.classList.contains('col')) return;

    const formRow = dragging.closest('.form_row'); // Obtém a linha do formulário onde a coluna está
    const afterElement = getDragAfterContainerCol(formRow, event.clientX); // Encontra a posição de inserção com base na posição do mouse

    // Se não houver um elemento após o que está sendo arrastado, adiciona ao final
    if (afterElement == null) {
        formRow.appendChild(dragging); // Anexa o elemento arrastado ao final da linha
    } else {
        // Insere o elemento arrastado antes do elemento encontrado
        formRow.insertBefore(dragging, afterElement);
    }
}

// Função chamada quando um elemento é solto em uma coluna
function handleColDrop(event) {
    event.preventDefault(); // Impede o comportamento padrão do evento
    const draggedElement = document.querySelector('.dragging-col'); // Seleciona o elemento que foi arrastado
    if (draggedElement) {
        draggedElement.classList.remove('dragging-col'); // Remove a classe de arraste
        draggedElement.style.opacity = "1"; // Restaura a opacidade original
    }

    // Remove os eventos de arrastar e soltar das colunas
    document.querySelectorAll('.form_row .components-container.col').forEach(target => {
        target.removeEventListener('dragover', handleColDragOver);
        target.removeEventListener('drop', handleColDrop);
    });

    window.currentMovingCol = null; // Limpa a referência do elemento arrastado
}

// Função para encontrar a coluna mais próxima para inserção com base na posição horizontal
function getDragAfterContainerCol(formRow, x) {
    // Seleciona todas as colunas que não estão sendo arrastadas
    const elements = [...formRow.querySelectorAll('.components-container.col:not(.dragging)')];

    // Usa reduce para determinar qual elemento está mais próximo da posição x do mouse
    return elements.reduce((closest, child) => {
        const box = child.getBoundingClientRect(); // Obtém a posição e tamanho da coluna
        const offset = x - (box.left + box.width / 2); // Calcula a distância do mouse ao centro da coluna

        // Verifica se a coluna atual é mais próxima do mouse que a anterior
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }; // Atualiza o mais próximo
        } else {
            return closest; // Mantém o mais próximo encontrado
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element; // Retorna o elemento mais próximo
}

// Função para inicializar o sistema de arrastar e soltar para as colunas
function initializeDragAndDropCol() {
    document.querySelectorAll('.form_row .components-container.col').forEach(col => {
        col.setAttribute('draggable', 'true'); // Define a coluna como arrastável
        col.addEventListener('dragstart', handleColDragStart); // Adiciona o evento para iniciar o arrasto
        col.addEventListener('dragend', handleColDragEnd); // Adiciona o evento para o fim do arrasto
    });
}



