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

        // Exibir um aviso no console
        console.log("Nova coluna adicionada dentro da form_row.");
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
    buttonContainer.appendChild(moveLeftColButton);
    buttonContainer.appendChild(moveRightColButton);

    // Adicionar div de botões ao novo container de colunas
    container.appendChild(buttonContainer);
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
        var lButton = colContainers[0].querySelector('.btn-left');
        var rButton = colContainers[0].querySelector('.btn-right');
        if (removeButton && lButton && rButton) {
            removeButton.remove(); // Remove o botão de remoção
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
