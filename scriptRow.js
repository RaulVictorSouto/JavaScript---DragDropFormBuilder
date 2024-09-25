// Variável global para rastrear a linha sendo arrastada
let draggedRow = null;

window.onload = function() {
    // Adiciona a primeira linha ao carregar a página
    addRow();
};

function addRow() {
    var dropArea = document.getElementById("box1");
    var row = document.createElement('div');
    row.classList.add('form_row');
    row.draggable = true; // Permite que a linha seja arrastável

    // Cria um contêiner para os componentes
    var componentsContainer = document.createElement('div');
    componentsContainer.classList.add('components-container');

    // Adiciona o contêiner de componentes à linha
    row.appendChild(componentsContainer);

    // Cria o botão de remoção de linha
    var removeRowButton = document.createElement('button');
    removeRowButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'btn-remove', 'remove-row-button');
    removeRowButton.innerHTML = '<i class="bi bi-x"></i>';
    removeRowButton.onclick = function() {
        removeRow(row);
    };

    // Cria o botão de movimentação de linha
    var moveRowButton = document.createElement('button');
    moveRowButton.classList.add('btn', 'btn-info', 'btn-sm', 'btn-remove', 'remove-row-button');
    moveRowButton.innerHTML = '<i class="bi bi-arrows-move"></i>';
    
    // Adiciona os botões à linha
    row.appendChild(removeRowButton);
    row.appendChild(moveRowButton);
    row.appendChild(componentsContainer);

    // Definir eventos de "drag and drop" para mover linhas
    row.addEventListener('dragstart', dragRowStart);
    row.addEventListener('dragover', allowDrop);
    row.addEventListener('drop', dropRow);
    row.addEventListener('dragleave', dragLeave);

    dropArea.appendChild(row);
}

function removeRow(row) {
    row.parentNode.removeChild(row);
}

// Função chamada ao iniciar o arrasto da linha
function dragRowStart(event) {
    draggedRow = event.target; // Armazena a linha que está sendo arrastada
    event.target.style.opacity = "0.5"; // Reduz a opacidade da linha arrastada
}

// Permite o drop de elementos ao arrastar sobre uma linha
function allowDrop(event) {
    event.preventDefault(); // Permite que o evento de drop ocorra
    event.target.closest('.form_row').classList.add('dragover'); // Adiciona classe visual quando arrastando
}

// Remove a classe "dragover" quando o mouse sai da área
function dragLeave(event) {
    event.target.closest('.form_row').classList.remove('dragover');
}

// Função chamada ao soltar a linha
function dropRow(event) {
    event.preventDefault();

    const allRows = [...document.querySelectorAll('.form_row')];
    const dropTarget = event.target.closest('.form_row');

    if (draggedRow && dropTarget !== draggedRow) {
        const dropArea = document.getElementById("box1");

        // Reorganiza as linhas baseando-se na posição do mouse
        const afterElement = getDragAfterElement(allRows, event.clientY);
        if (afterElement == null) {
            dropArea.appendChild(draggedRow); // Adiciona a linha no final
        } else {
            dropArea.insertBefore(draggedRow, afterElement); // Adiciona a linha na posição correta
        }
    }

    draggedRow.style.opacity = "1"; // Restaura a opacidade da linha
    draggedRow = null; // Limpa a referência da linha arrastada
}

// Função que ajuda a calcular a posição correta para a linha ser solta
function getDragAfterElement(allRows, y) {
    return allRows.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
