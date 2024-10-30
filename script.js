let elementCount = 0; // Contador global para IDs de elementos

function allowDrop(event) {
    event.preventDefault();
    event.target.classList.add('dragover');
}

function drag(event) {
    console.log('drag');
    event.dataTransfer.setData("a", event.target.id);
}


function drop(event) {
    console.log('drop');
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
    return '<button class="btn btn-form btn-secondary btn-sm btn-remove bi bi-x" onclick="removeComponent(this)"></button>';
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
    return '<button class="btn btn-form btn-info btn-sm btn-edit bi bi-pencil-square" onclick="editComponent(this)"></button>';
}

function getMoveButton() {
    return '<button class="btn btn-form btn-info btn-sm btn-move bi bi-arrows-move" onmousedown="moveComponent(this)" onmouseup="stopMove()"></button>';
}

function getControlButtons() {
    return '<div class="control-buttons" style="display: none">' + 
               getEditButton() + 
               getRemoveButton() + 
               getMoveButton() + 
           '</div>';
}

function moveComponent(button) {
    console.log('moveComponent');
    var element = button.closest('.conteudo_inserido');
    element.setAttribute('draggable', 'true');
    element.addEventListener('dragstart', handleDragStart);
    element.style.opacity = "0.5";
    window.currentMovingElement = element;
}

function handleDragStart(event) {
    console.log('handleDragStart');
    const draggedElement = event.target;
    draggedElement.classList.add('dragging');

    window.currentMovingElement = draggedElement;
    
    // Adiciona eventos ao contêiner
    document.querySelectorAll('.components-container').forEach(container => {
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDrop);
    });
}

function handleDragOver(event) {
    console.log('handleDragOver');
    event.preventDefault(); // Necessário para permitir o drop

    const container = event.currentTarget;
    const dragging = document.querySelector('.dragging'); // Certifique-se de que o elemento arrastado tem a classe .dragging

    // Verifica se o elemento arrastado é uma .form_row
    if (dragging.classList.contains('form_row')) {
        // Impede que .form_row seja arrastada para dentro de qualquer .components-container
        if (event.target.closest('.components-container')) {
            return; // Sai da função para evitar a inserção em .components-container
        }
    }

    // Verifica se o alvo é uma div .components-container.col
    const targetCol = event.target.closest('.components-container.col');
    
    if (targetCol) {
        // Se o alvo for uma .components-container.col, use a função para movimentação vertical
        const afterElement = getDragAfterContainerInColumn(targetCol, event.clientY);
       
        if (afterElement === null) {
            targetCol.appendChild(dragging); // Coloca o componente no final se não houver elemento após
        } else {
            targetCol.insertBefore(dragging, afterElement); // Insere o componente antes do elemento encontrado
        }
    } else {
        // Caso contrário, realiza o comportamento para movimentação horizontal
        const afterElement = getDragAfterContainer(container, event.clientX);
        
        if (afterElement === null) {
            container.appendChild(dragging); // Se não houver nada à direita, coloca no final
        } else {
            container.insertBefore(dragging, afterElement); // Coloca antes do elemento encontrado
        }
    }
    console.log('targetCol: ', targetCol);
}




// Função para lidar com o evento de drop
function handleDrop(event) {
    console.log('handleDrop');
    event.preventDefault(); // Impede o comportamento padrão do navegador

    const container = event.currentTarget;
    const dragging = document.querySelector('.dragging'); // O elemento que está sendo arrastado

    // Se o elemento arrastado existe
    if (dragging) {
        // Verifica se o drop é em um contêiner de coluna ou um contêiner normal
        const targetContainer = event.target.closest('.components-container, .components-container.col');

        // Se o alvo do drop não for um contêiner válido, cancela a operação
        if (!targetContainer) {
            console.log('O componente deve ser adicionado em um contêiner válido.');
            return; // Impede o drop se não estiver em um contêiner válido
        }

        // Determina se o contêiner é uma coluna ou não
        const isColumn = targetContainer.classList.contains('col');

        // Usa a função apropriada para encontrar o elemento após o qual o dragging deve ser inserido
        const afterElement = isColumn 
            ? getDragAfterContainerinColumn(targetContainer, event.clientY) 
            : getDragAfterContainer(targetContainer, event.clientX);

        // Insere o elemento arrastado no lugar correto
        if (afterElement === null) {
            targetContainer.appendChild(dragging); // Coloca no final do contêiner
        } else {
            targetContainer.insertBefore(dragging, afterElement); // Insere antes do elemento encontrado
        }

        // Remove a classe 'dragging' do elemento que foi arrastado
        dragging.classList.remove('dragging');
        dragging.style.opacity = '1';
    }
}

// Adicione os manipuladores de eventos ao contêiner
const container = document.querySelector('.components-container, .components-container.col');
container.addEventListener('dragover', handleDragOver);
container.addEventListener('drop', handleDrop);




// Função para determinar qual elemento está mais próximo do mouse (movimentação horizontal)
function getDragAfterContainer(container, mouseX) {
    console.log('getDragAfterContainer');
    
    // Obtém todos os elementos '.conteudo_inserido' que não estão sendo arrastados, dentro do container atual
    const elements = [...container.querySelectorAll('.conteudo_inserido:not(.dragging)')];
    console.log('elements: ', elements);

    let closestElement = null;
    let closestOffset = Number.POSITIVE_INFINITY;

    elements.forEach(child => {
        const box = child.getBoundingClientRect();
        const offset = mouseX - (box.left + box.width / 2);

        // Se o offset for menor que zero, significa que o mouse está à esquerda do centro do elemento
        if (offset < 0 && Math.abs(offset) < closestOffset) {
            closestOffset = Math.abs(offset);
            closestElement = child;
        }
    });

    // Verifica se o elemento mais próximo está dentro do container correto
    if (closestElement && closestElement.closest('.form_row') !== container.closest('.form_row')) {
        // Se o elemento mais próximo não pertence ao mesmo 'form_row', ignora
        closestElement = null;
    }

    return closestElement;
}





// Função para determinar qual elemento está mais próximo do mouse (movimentação vertical)
function getDragAfterContainerInColumn(container, mouseY) {

    console.log('getDragAfterContainerInColumn');
    const elements = [...container.querySelectorAll('.conteudo_inserido:not(.dragging)')];
    console.log('elements: ', elements);

    let closestElement = null;
    let closestOffset = Number.POSITIVE_INFINITY;

    elements.forEach(child => {
        const box = child.getBoundingClientRect();
        const offset = mouseY - (box.top + box.height / 2);

        // Se o offset for menor que zero, significa que o mouse está acima do centro do elemento
        if (offset < 0 && Math.abs(offset) < closestOffset) {
            closestOffset = Math.abs(offset);
            closestElement = child;
        }
    });

    return closestElement;
}



function stopMove() {
    console.log('stopMove');
    if (window.currentMovingElement) {
        window.currentMovingElement.setAttribute('draggable', 'false');
        window.currentMovingElement.style.opacity = "1";
        window.currentMovingElement = null;
    }
}

function dragComponent(event) {
    console.log('dragComponent');
    event.dataTransfer.setData("component", window.currentMovingElement.innerHTML);
}


function handleDropInButtonsContainer(event) {
    console.log('handleDropInButtonsContainer');
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

//função para colocar novos componentes no formulário
function dropComponentInRow(event) {
    console.log('dropComponentInRow');
    console.log('função para colocar componente'); // Log para verificar chamada
    // Impede o comportamento padrão do navegador ao soltar o elemento
    event.preventDefault();

    // Verifica se o drop é em um contêiner components-container ou components-container col
    var targetContainer = event.target.closest('.components-container, .components-container.col');
    console.log("targetContainer: ", targetContainer);

    // Se o alvo do drop não for um contêiner válido, cancela a operação
    if (!targetContainer) {
        console.log('cancelou');
        return; // Impede o drop se não estiver em um contêiner válido
    }

    console.log('Component dropped in:', targetContainer);
    // Lógica para manipular o componente arrastado e inseri-lo no novo container
}