var currentEditingElement; // Variável global para armazenar o elemento atual sendo editado

// Função para abrir o modal de edição e carregar as informações da div selecionada
function editForm(button) {
    // Obtém o ID da div .drop-area associada ao botão
    var dropAreaId = button.getAttribute('data-target');
    
    // Obtém o elemento da drop-area
    currentEditingElement = document.getElementById(dropAreaId);
    
    if (currentEditingElement) {
        // Carrega as informações da drop-area no modal

        // Nome
        document.getElementById('componentName').value = currentEditingElement.querySelector('p') ? currentEditingElement.querySelector('p').innerText : '';

        // Exibir borda
        document.getElementById('exibirBorda').checked = window.getComputedStyle(currentEditingElement).borderStyle !== 'none';

        // Largura da borda
        document.getElementById('borderWidth').value = parseInt(window.getComputedStyle(currentEditingElement).borderWidth);

        // Cor da borda
        document.getElementById('borderColor').value = window.getComputedStyle(currentEditingElement).borderColor;

        // Borda circular (border-radius)
        document.getElementById('borderRadius').value = parseInt(window.getComputedStyle(currentEditingElement).borderRadius);

        // Cor de fundo
        document.getElementById('backgroundColor').value = window.getComputedStyle(currentEditingElement).backgroundColor;

        // Padding
        const padding = window.getComputedStyle(currentEditingElement).padding.split(' ');
        document.getElementById('paddingTop').value = parseInt(padding[0]);
        document.getElementById('paddingRight').value = parseInt(padding[1]);
        document.getElementById('paddingBottom').value = parseInt(padding[2]);
        document.getElementById('paddingLeft').value = parseInt(padding[3]);

        // Descrição
        document.getElementById('description').value = currentEditingElement.querySelector('p') ? currentEditingElement.querySelector('p').innerText : '';

        // Abrir o modal
        $('#editFormModal').modal('show');
    } else {
        console.error("Elemento .drop-area não encontrado");
    }
}

// Função para salvar as mudanças feitas no modal
function saveFormChanges() {
    if (currentEditingElement) {
        // Aplicar as alterações na div atual

        // Nome (usando um <p> para exibir o nome)
        let componentName = document.getElementById('componentName').value;
        let nameElement = currentEditingElement.querySelector('p');
        if (!nameElement) {
            nameElement = document.createElement('p');
            currentEditingElement.appendChild(nameElement);
        }
        nameElement.innerText = componentName;

        // Exibir borda
        if (document.getElementById('exibirBorda').checked) {
            currentEditingElement.style.borderStyle = 'solid';
        } else {
            currentEditingElement.style.borderStyle = 'none';
        }

        // Largura da borda
        currentEditingElement.style.borderWidth = document.getElementById('borderWidth').value + 'px';

        // Cor da borda
        currentEditingElement.style.borderColor = document.getElementById('borderColor').value;

        // Borda circular (border-radius)
        currentEditingElement.style.borderRadius = document.getElementById('borderRadius').value + 'px';

        // Cor de fundo
        currentEditingElement.style.backgroundColor = document.getElementById('backgroundColor').value;

        // Padding
        currentEditingElement.style.paddingTop = document.getElementById('paddingTop').value + 'px';
        currentEditingElement.style.paddingRight = document.getElementById('paddingRight').value + 'px';
        currentEditingElement.style.paddingBottom = document.getElementById('paddingBottom').value + 'px';
        currentEditingElement.style.paddingLeft = document.getElementById('paddingLeft').value + 'px';

        // Descrição
        let description = document.getElementById('description').value;
        if (nameElement) {
            nameElement.innerText = description;
        }

        // Fechar o modal
        $('#editFormModal').modal('hide');
    } else {
        console.error("Nenhum elemento está sendo editado");
    }
}
