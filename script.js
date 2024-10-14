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
    newElement.ondrop = dropComponentInRow;

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
    element.addEventListener('dragstart', handleDragStart);
    element.style.opacity = "0.5";
    window.currentMovingElement = element;
}

function handleDragStart(event) {
    const draggedElement = event.target;
    draggedElement.classList.add('dragging');
    window.currentMovingElement = draggedElement;
    
    // Adiciona eventos ao contêiner
    document.querySelectorAll('.components-container', '.form_row').forEach(container => {
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDrop);
    });
}

function handleDragOver(event) {
    event.preventDefault(); // Necessário para permitir o drop
    const container = event.currentTarget;
    const afterElement = getDragAfterContainer(container, event.clientY); // Posição vertical

    const dragging = document.querySelector('.dragging');
    if (afterElement == null) {
        container.appendChild(dragging); // Se não houver nada abaixo, coloca no final
    } else {
        container.insertBefore(dragging, afterElement); // Coloca antes do elemento encontrado
    }
}


function handleDrop(event) {
    event.preventDefault(); // Impede o comportamento padrão do navegador

    const container = event.currentTarget;
    const dragging = document.querySelector('.dragging');

    // Remover classe de arrastando
    dragging.classList.remove('dragging');
    dragging.style.opacity = "1";

    // Lógica de reciclagem: Verificar se o elemento foi movido para um novo container
    if (window.currentMovingElement.parentElement !== container) {
        const newElement = document.createElement('div');
        newElement.classList.add('conteudo_inserido');
        newElement.innerHTML = window.currentMovingElement.innerHTML;

        assignIDsToInnerElements(newElement); // Atribuir IDs aos elementos internos, se necessário

        // Adiciona o novo elemento no contêiner alvo
        container.appendChild(newElement);

        // Remover o elemento original do contêiner anterior
        window.currentMovingElement.remove();

        // Atribuir eventos de controle ao novo elemento
        newElement.setAttribute('onmouseover', 'showControlButtons(this)');
        newElement.setAttribute('onmouseout', 'hideControlButtons(this)');
    }

    // Limpar referência do item movido
    window.currentMovingElement = null;

    // Remover listeners de dragover e drop
    document.querySelectorAll('.components-container').forEach(container => {
        container.removeEventListener('dragover', handleDragOver);
        container.removeEventListener('drop', handleDrop);
    });
}


function getDragAfterContainer(container, y) {
    const elements = [...container.querySelectorAll('.conteudo_inserido:not(.dragging)')]; // Excluir o item que está sendo arrastado
    
    return elements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2; // Verifica se o mouse está acima ou abaixo do centro do item
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
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
    document.querySelectorAll('.components-container').forEach(container => {
        container.removeEventListener('dragover', handleDragOver);
        container.removeEventListener('drop', handleDrop);
    });
}

function dropComponentInRow(event) {
    console.log('função para colocar componente'); // Log para verificar chamada
    // Impede o comportamento padrão do navegador ao soltar o elemento
    event.preventDefault();
    
    // Verifica se o drop é em um contêiner components-container
    var targetContainer = event.target.closest('.components-container');
    console.log(targetContainer);

    // Se o alvo do drop não for um contêiner components-container, evita o drop
    if (!targetContainer) {
        console.log('cancelou');
        return; // Impede o drop se não estiver em um contêiner válido
    }

    console.log('Component dropped in:', targetContainer);
}