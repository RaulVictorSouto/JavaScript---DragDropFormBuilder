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

    // Identifica o contêiner alvo onde o componente foi solto
    var targetContainer = event.target.closest('.components-container, .components-container.col');

    // Verifica se o alvo do drop é um contêiner válido
    if (!targetContainer) {
        alert('O componente deve ser adicionado em um contêiner válido.');
        return; // Impede o drop se não estiver em um contêiner permitido
    }

    // Adiciona o componente no contêiner correto
    var newElement = document.createElement('div');
    newElement.classList.add('conteudo_inserido');
    newElement.setAttribute('onmouseover', 'showControlButtons(this)');
    newElement.setAttribute('onmouseout', 'hideControlButtons(this)');
    newElement.innerHTML = getinput + getControlButtons();
    newElement.ondrop = dropComponentInRow;

    // Atribui IDs aos elementos internos
    assignIDsToInnerElements(newElement);

    // Adiciona o novo componente no contêiner alvo
    targetContainer.appendChild(newElement);
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
    element.addEventListener('dragstart', handleDragStart);
    element.style.opacity = "0.5";
    window.currentMovingElement = element;
}

function handleDragStart(event) {
    const draggedElement = event.target;
    draggedElement.classList.add('dragging');

    window.currentMovingElement = draggedElement;
    
    // Adiciona eventos ao contêiner
    document.querySelectorAll('.components-container', '.components-container col').forEach(container => {
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDrop);
    });
}

// Função para lidar com o evento de arrasto
function handleDragOver(event) {
    console.log('handleDragOver');
    event.preventDefault(); // Necessário para permitir o drop

    const container = event.currentTarget;
    const dragging = document.querySelector('.dragging'); // Certifique-se de que o elemento arrastado tem a classe .dragging

    const afterElement = getDragAfterContainer(container, event.clientY); // Posição vertical

    // Mova o componente para a esquerda ou para a direita baseado na posição do mouse
    if (afterElement === null) {
        container.appendChild(dragging); // Se não houver nada abaixo, coloca no final
    } else {
        container.insertBefore(dragging, afterElement); // Coloca antes do elemento encontrado
    }
}



/*
function handleDrop(event) {
    console.log('handleDrop');
    event.preventDefault(); // Impede o comportamento padrão do navegador

    const container = event.currentTarget;
    console.log('Container: ', container);
    const dragging = document.querySelector('.dragging');

    // Remover classe de arrastando
    dragging.classList.remove('dragging');
    dragging.style.opacity = "1";

    // Verifica se o drop ocorreu em um contêiner permitido
    const targetContainer = event.target.closest('.components-container, .components-container.col');
    console.log('targetContainer: ', targetContainer);
    if (!targetContainer) {
        alert('O componente deve ser adicionado em um contêiner válido.');
        return; // Cancela a operação se não for um contêiner permitido
    }

    // Lógica para adicionar o elemento ao novo contêiner
    const newElement = document.createElement('div');
    newElement.classList.add('conteudo_inserido');
    newElement.innerHTML = window.currentMovingElement.innerHTML;

    // Atribui IDs aos elementos internos
    assignIDsToInnerElements(newElement);

    // Adiciona o novo elemento no contêiner alvo
    targetContainer.appendChild(newElement);

    // Remove o elemento original do contêiner anterior
    window.currentMovingElement.remove();

    // Atribui eventos de controle ao novo elemento
    newElement.setAttribute('onmouseover', 'showControlButtons(this)');
    newElement.setAttribute('onmouseout', 'hideControlButtons(this)');

    // Limpa a referência do item movido
    window.currentMovingElement = null;

    // Remove listeners de dragover e drop das outras containers
    document.querySelectorAll('.components-container, .components-container.col').forEach(container => {
        container.removeEventListener('dragover', handleDragOver);
        container.removeEventListener('drop', handleDrop);
    });
}
    */

// Função para lidar com o evento de drop
function handleDrop(event) {
    console.log('handleDrop');
    const container = event.currentTarget;
    const dragging = document.querySelector('.dragging'); // O elemento que está sendo arrastado

    // Se o elemento arrastado existe, mova-o para a nova posição
    if (dragging) {
        const afterElement = getDragAfterContainer(container, event.clientY);
        if (afterElement === null) {
            container.appendChild(dragging);
        } else {
            container.insertBefore(dragging, afterElement);
        }
    }
}

// Adicione os manipuladores de eventos ao contêiner
const container = document.querySelector('.components-container');
container.addEventListener('dragover', handleDragOver);
container.addEventListener('drop', handleDrop);




// Função para determinar qual elemento está mais próximo do mouse
function getDragAfterContainer(container, mouseY) {
    const elements = [...container.querySelectorAll('.conteudo_inserido:not(.dragging)')];

    let closestElement = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    elements.forEach(child => {
        const box = child.getBoundingClientRect();
        const offset = mouseY - (box.top + box.height / 2);

        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closestElement = child;
        }
    });

    return closestElement;
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


function handleDropInButtonsContainer(event) {
    event.preventDefault(); // Impede o comportamento padrão do navegador

    // Caso o elemento tenha sido arrastado, podemos restaurar sua posição ou cancelar o drop
    if (window.currentMovingElement) {
        // Cancelar o drop: o elemento voltará à posição original
        window.currentMovingElement.style.opacity = "1";
        window.currentMovingElement.setAttribute('draggable', 'false');

        // Limpar a referência do item movido
        window.currentMovingElement = null;
    }

    // Remover listeners de dragover e drop das outras containers
    document.querySelectorAll('.components-container, .components-container.col').forEach(container => {
        container.removeEventListener('dragover', handleDragOver);
        container.removeEventListener('drop', handleDrop);
    });
}

function dropComponentInRow(event) {
    console.log('função para colocar componente'); // Log para verificar chamada
    // Impede o comportamento padrão do navegador ao soltar o elemento
    event.preventDefault();

    // Verifica se o drop é em um contêiner components-container ou components-container col
    var targetContainer = event.target.closest('.components-container, .components-container.col');
    console.log(targetContainer);

    // Se o alvo do drop não for um contêiner válido, cancela a operação
    if (!targetContainer) {
        console.log('cancelou');
        return; // Impede o drop se não estiver em um contêiner válido
    }

    console.log('Component dropped in:', targetContainer);
    // Lógica para manipular o componente arrastado e inseri-lo no novo container
}
