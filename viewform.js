function previewForm() {
    if (currentEditingElement) {
        // Limpar conteúdo anterior
        var formPreview = document.getElementById('formPreview');
        formPreview.innerHTML = '';

        // Criar visualização com base nos dados do elemento atual
        var formName = currentEditingElement.dataset.formName || 'Nome do Formulário';
        var description = currentEditingElement.dataset.description || 'Descrição do Formulário';
        
        // Adicionar o nome e descrição ao preview
        formPreview.innerHTML += `<h4>${formName}</h4>`;
        formPreview.innerHTML += `<p>${description}</p>`;

        // Adicionar a imagem de fundo, se houver
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
        
        // Abrir o modal
        $('#previewFormModal').modal('show');
    } else {
        console.error("Nenhum elemento está sendo editado para visualizar");
    }
}
