//Script para adição de colunas

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

                // Crie o botão de remover
                var removeColButton = document.createElement('button');
                removeColButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'btn-remove');
                removeColButton.innerHTML = '<i class="bi bi-x"></i>'; // Use innerHTML para adicionar o ícone
                removeColButton.onclick = function() {
                    removeCol(newComponentsContainer, formRow); // Chama a função para remover
                };

                // Adicione o botão de remover **antes** de qualquer conteúdo
                newComponentsContainer.appendChild(removeColButton);

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

        // Crie o botão de remover
        var removeColButton = document.createElement('button');
        removeColButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'btn-remove');
        removeColButton.innerHTML = '<i class="bi bi-x"></i>'; // Use innerHTML para adicionar o ícone
        removeColButton.onclick = function() {
            removeCol(newComponentsContainer, formRow); // Chama a função para remover
        };

        // Adicione o botão de remover **antes** de qualquer conteúdo
        newComponentsContainer.appendChild(removeColButton);

        // Insira a nova 'components-container col' dentro da form_row
        formRow.appendChild(newComponentsContainer);

        // Exibir um aviso no console
        console.log("Nova coluna adicionada dentro da form_row.");
    }
}


//Remover coluna
function removeCol(container, formRow) {
    // Remove a coluna
    container.remove();

    // Verifica se ainda há colunas
    var colContainers = formRow.querySelectorAll('.components-container.col');

    if (colContainers.length === 1) {
        // Se restar apenas uma coluna, troque a classe para 'components-container'
        colContainers[0].classList.remove('col');
        console.log("A última coluna se tornou 'components-container'.");

        // Remover o botão de remoção (se houver)
        var removeButton = colContainers[0].querySelector('.btn-remove');
        if (removeButton) {
            removeButton.remove(); // Remove o botão de remoção
            console.log("Botão de remoção removido.");
        }
    } else if (colContainers.length === 0) {
        // Se não houver colunas, exiba uma mensagem
        console.log("Não há mais colunas 'components-container col'.");
    } else {
        console.log("Uma coluna foi removida.");
    }
}
