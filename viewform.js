function previewForm() {
    $('#previewFormModal').modal('show'); // Exibe o modal de visualização
    $('#previewFormModal .modal-dialog').addClass('modal-lg'); // Classe para aumentar o modal
    if (currentEditingElement) {
        // Limpar conteúdo anterior
        var formPreview = document.getElementById('formPreview');
        var formPreviewHeader = document.getElementById('formPreviewHeader');

        formPreview.innerHTML = ''; // Limpa o conteúdo anterior do modal
        formPreviewHeader.innerHTML = ''; // Limpa o conteúdo anterior do cabeçalho

        // Adiciona o nome e descrição do formulário
        var formName = currentEditingElement.dataset.formName || 'Nome do Formulário';
        var description = currentEditingElement.dataset.description || 'Descrição do Formulário';
        
        formPreviewHeader.innerHTML += `<h4>${formName}</h4>`;
        formPreviewHeader.innerHTML += `<p>${description}</p>`;

        // Seleciona todos os elementos com a classe "conteudo" dentro do elemento atual
        var contentElements = currentEditingElement.querySelectorAll('.conteudo');

        // Itera sobre os elementos e adiciona ao preview
        contentElements.forEach(function(contentElement) {
            var clone = contentElement.cloneNode(true); // Clona o elemento
            formPreview.appendChild(clone); // Adiciona o clone ao preview
        });

        // Adiciona a imagem de fundo, se houver
        if (currentEditingElement.style.backgroundImage) {
            formPreview.style.backgroundImage = currentEditingElement.style.backgroundImage;
            formPreview.style.backgroundSize = 'cover';
            formPreview.style.backgroundPosition = 'center';
        } else {
            formPreview.style.backgroundImage = 'none';
        }

        // Aplicar estilos do elemento atual ao preview
        formPreview.style.borderWidth = currentEditingElement.dataset.borderWidth || '0px';
        formPreview.style.borderColor = currentEditingElement.dataset.borderColor || 'transparent';
        formPreview.style.borderRadius = currentEditingElement.dataset.borderRadius || '0px';
        formPreview.style.paddingTop = currentEditingElement.dataset.paddingTop || '0px';
        formPreview.style.paddingRight = currentEditingElement.dataset.paddingRight || '0px';
        formPreview.style.paddingBottom = currentEditingElement.dataset.paddingBottom || '0px';
        formPreview.style.paddingLeft = currentEditingElement.dataset.paddingLeft || '0px';
    } else {
        console.error("Nenhum elemento está sendo editado para visualizar");
    }
}

