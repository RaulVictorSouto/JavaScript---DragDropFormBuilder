var currentEditingElement; // Variável global para armazenar o elemento atual sendo editado

// Função para abrir o modal de edição e carregar as informações da div selecionada
function editForm(button) {
    var dropAreaId = button.getAttribute('data-target');
    currentEditingElement = document.getElementById(dropAreaId);
    
    if (currentEditingElement) {
        // Carregar informações no modal
        document.getElementById('componentName').value = currentEditingElement.dataset.componentName || '';
        document.getElementById('exibirBorda').checked = window.getComputedStyle(currentEditingElement).borderStyle !== 'none';
        document.getElementById('borderWidth').value = parseInt(window.getComputedStyle(currentEditingElement).borderWidth);
        document.getElementById('borderColor').value = window.getComputedStyle(currentEditingElement).borderColor;
        document.getElementById('borderRadius').value = parseInt(window.getComputedStyle(currentEditingElement).borderRadius);
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

function saveFormChanges() {
    if (currentEditingElement) {
        // Armazenar as propriedades no dataset da drop-area
        currentEditingElement.dataset.componentName = document.getElementById('componentName').value;
        currentEditingElement.dataset.borderStyle = document.getElementById('exibirBorda').checked ? 'solid' : 'none';
        currentEditingElement.dataset.borderWidth = document.getElementById('borderWidth').value + 'px';
        currentEditingElement.dataset.borderColor = document.getElementById('borderColor').value;
        currentEditingElement.dataset.borderRadius = document.getElementById('borderRadius').value + 'px';
        currentEditingElement.dataset.backgroundColor = document.getElementById('backgroundColor').value;
        currentEditingElement.dataset.paddingTop = document.getElementById('paddingTop').value + 'px';
        currentEditingElement.dataset.paddingRight = document.getElementById('paddingRight').value + 'px';
        currentEditingElement.dataset.paddingBottom = document.getElementById('paddingBottom').value + 'px';
        currentEditingElement.dataset.paddingLeft = document.getElementById('paddingLeft').value + 'px';
        currentEditingElement.dataset.description = document.getElementById('description').value;

        // Aplicar as alterações visualmente
        applyChanges(currentEditingElement);

        // Fechar o modal
        $('#editFormModal').modal('hide');
    } else {
        console.error("Nenhum elemento está sendo editado");
    }
}

// Função para aplicar as alterações visuais a uma drop-area
function applyChanges(element) {
    if (!element) return;

    // Aplicar as propriedades salvas
    element.style.borderStyle = element.dataset.borderStyle || 'none';
    element.style.borderWidth = element.dataset.borderWidth || '0px';
    element.style.borderColor = element.dataset.borderColor || 'transparent';
    element.style.borderRadius = element.dataset.borderRadius || '0px';
    element.style.backgroundColor = element.dataset.backgroundColor || 'transparent';
    element.style.paddingTop = element.dataset.paddingTop || '0px';
    element.style.paddingRight = element.dataset.paddingRight || '0px';
    element.style.paddingBottom = element.dataset.paddingBottom || '0px';
    element.style.paddingLeft = element.dataset.paddingLeft || '0px';

    // Atualizar o nome ou descrição (usando um <p> para exibir)
    let nameElement = element.querySelector('p');
    if (!nameElement) {
        nameElement = document.createElement('p');
        element.appendChild(nameElement);
    }
    nameElement.innerText = element.dataset.description || element.dataset.componentName || '';
}
