var currentEditingElement = null; // Variável para armazenar a div que está sendo editada

// Função para abrir o modal de edição e carregar as informações da div selecionada
function editForm(button) {
     // Abre o modal de edição
     $('#editFormModal').modal('show');
    // Obtém o elemento pai do botão clicado, que é o contêiner do componente
    currentEditingElement = button.closest('.drop-area.dragover');

    if (currentEditingElement) {
        // Preenche o nome/conteúdo do componente
        document.getElementById('componentName').value = currentEditingElement.innerText;

        // Preenche o ID atual do componente
        document.getElementById('componentId').value = currentEditingElement.id;

        // Estilos de borda
        document.getElementById('borderWidth').value = parseInt(window.getComputedStyle(currentEditingElement).borderWidth);
        document.getElementById('borderColor').value = window.getComputedStyle(currentEditingElement).borderColor;

        // Verifica se a borda é circular
        document.getElementById('borderRadius').checked = window.getComputedStyle(currentEditingElement).borderRadius !== '0px';

        // Padding
        const padding = window.getComputedStyle(currentEditingElement).padding.split(' ');
        document.getElementById('paddingTop').value = parseInt(padding[0]);
        document.getElementById('paddingRight').value = parseInt(padding[1]);
        document.getElementById('paddingBottom').value = parseInt(padding[2]);
        document.getElementById('paddingLeft').value = parseInt(padding[3]);

    }
}

// Função para salvar as mudanças feitas na div
function saveFormChanges() {
    if (currentEditingElement) {
        // Obtém o novo nome inserido pelo usuário
        var newName = document.getElementById('componentName').value;

        // Obtém as novas opções de estilo
        var borderColor = document.getElementById('borderColor').value;
        var borderWidth = document.getElementById('borderWidth').value + 'px';
        var isCircular = document.getElementById('borderRadius').checked;
        var paddingTop = document.getElementById('paddingTop').value + 'px';
        var paddingRight = document.getElementById('paddingRight').value + 'px';
        var paddingBottom = document.getElementById('paddingBottom').value + 'px';
        var paddingLeft = document.getElementById('paddingLeft').value + 'px';

        // Atualiza o texto da div
        currentEditingElement.innerText = newName;

        // Atualiza os estilos de borda
        currentEditingElement.style.borderColor = borderColor;
        currentEditingElement.style.borderWidth = borderWidth;
        currentEditingElement.style.borderRadius = isCircular ? '50%' : '0';

        // Atualiza o padding
        currentEditingElement.style.padding = `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`;
    }

    // Fecha o modal após salvar as alterações
    $('#editFormModal').modal('hide');
}
