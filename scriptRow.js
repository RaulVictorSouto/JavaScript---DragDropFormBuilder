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
    };
    row.onmouseout = function() {
        buttonsContainer.style.display = 'none';
    };

    dropArea.appendChild(row);
}


function dropComponentInRow(event) {
    event.preventDefault(); // Impede o comportamento padrão do evento.

    var draggedRow = window.currentMovingElement; // Obtém o elemento que está sendo arrastado.
    var targetRow = event.target.closest('.form_row'); // Verifica se o alvo do drop é um elemento com a classe 'form_row'.

    // Se não for um 'form_row', não permite o drop e retorna.
    if (!targetRow) {
        alert('Você deve soltar o componente dentro de uma linha (form_row)!');
        return; 
    }

    targetRow.classList.remove('dragover'); // Remove a classe de arrastar se estiver aplicada.

    // Verifica se o elemento arrastado é uma 'form_row'
    if (draggedRow.classList.contains('form_row')) {
        var parentContainer = targetRow.parentNode; // Obter o container pai de targetRow

        // Verifica a posição do mouse para decidir se a linha deve ser trocada
        var afterElement = getDragAfterElement(parentContainer, event.clientY);
        
        if (afterElement === null) {
            // Se o mouse estiver na parte inferior do container, coloca a linha arrastada no final
            parentContainer.appendChild(draggedRow);
        } else {
            // Caso contrário, insere antes do elemento que está abaixo
            parentContainer.insertBefore(draggedRow, afterElement);
        }
        
        // Adiciona a classe para animação de movimento
        draggedRow.classList.add('moved');
        targetRow.classList.add('moved');

        // Remove a classe após um curto período
        setTimeout(() => {
            draggedRow.classList.remove('moved');
            targetRow.classList.remove('moved');
        }, 300);

        window.currentMovingElement = null; // Reseta a referência do elemento que estava sendo movido.
        return; // Finaliza a função, já que a linha foi movida
    }

    // Criar um novo elemento na nova linha com os mesmos dados
    var newElement = document.createElement('div');
    newElement.classList.add('conteudo_inserido');
    newElement.innerHTML = draggedRow.innerHTML;

    // Atribuir IDs aos elementos internos apenas se eles não tiverem
    assignIDsToInnerElements(newElement); // Isso não deve adicionar novos IDs ao mover

    // Adiciona o novo elemento dentro da containers de componentes da linha de destino
    targetRow.querySelector('.components-container').appendChild(newElement);

    // Remover o componente da linha anterior
    draggedRow.remove(); // Remove o elemento arrastado da linha anterior.
    window.currentMovingElement = null; // Reseta a referência do elemento que estava sendo movido.

    newElement.setAttribute('onmouseover', 'showControlButtons(this)'); // Adiciona eventos para mostrar botões de controle ao passar o mouse.
    newElement.setAttribute('onmouseout', 'hideControlButtons(this)'); // Adiciona eventos para esconder botões de controle ao retirar o mouse.
}

// Função auxiliar para determinar onde o elemento deve ser inserido com base na posição do mouse
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.form_row:not(.dragging)')]; // Obtem todos os elementos arrastáveis
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect(); // Obtém a posição do elemento
        const offset = y - box.top - box.height / 2; // Verifica a posição do mouse em relação ao meio do elemento
        if (offset < 0 && offset > closest.offset) { // Se a posição está acima do elemento atual
            return { offset: offset, element: child }; // Retorna o elemento mais próximo
        } else {
            return closest; // Retorna o elemento mais próximo encontrado
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element; // Inicializa como o menor número possível
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

