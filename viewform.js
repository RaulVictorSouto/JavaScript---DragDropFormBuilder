function previewForm() {
    // Exibe o modal de visualização
    $('#previewFormModal').modal('show');
    $('#previewFormModal .modal-dialog').addClass('modal-lg'); // Classe para aumentar o modal
    currentEditingElement = document.getElementById('box1');
    
    if (currentEditingElement) {
        console.log(currentEditingElement); // Verifique se currentEditingElement está definido
        
        // Limpar conteúdo anterior
        var formPreview = document.getElementById('formPreview');
        var formPreviewHeader = document.getElementById('formPreviewHeader');
        
        formPreview.innerHTML = ''; // Limpa o conteúdo anterior do modal
        formPreviewHeader.innerHTML = ''; // Limpa o conteúdo anterior do cabeçalho

        // Adiciona o nome e descrição do formulário ao cabeçalho
        var formName = currentEditingElement.dataset.formName || '';
        var description = currentEditingElement.dataset.description || '';
        
        formPreviewHeader.innerHTML += `<h4>${formName}</h4>`;
        formPreviewHeader.innerHTML += `<p>${description}</p>`;

        // Clona o currentEditingElement, que é a div .drop-area que está sendo editada
        var dropAreaClone = currentEditingElement.cloneNode(true); // Clona o elemento editado

        // Itera sobre as divs form_row dentro do currentEditingElement para garantir que seus estilos inline sejam preservados
        var formRows = dropAreaClone.querySelectorAll('.form_row');
        formRows.forEach(function(formRow) {
            // Remove qualquer div com a classe 'control-buttons' dentro de form_row
            var controlButtons = formRow.querySelectorAll('.control-buttons');
            controlButtons.forEach(function(container) {
                container.remove(); // Remove a div control-buttons
            });

            // Aplicar os estilos calculados para a visualização
            var computedStyle = window.getComputedStyle(formRow);
            formRow.style.cssText = computedStyle.cssText;
        });

        // Adiciona a drop-area clonada ao preview
        formPreview.appendChild(dropAreaClone);
        
    } else {
        console.error("Nenhum elemento está sendo editado para visualizar");
    }
}
