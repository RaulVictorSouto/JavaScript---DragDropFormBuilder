function previewForm() {
    // Exibe o modal de visualização
    $('#previewFormModal').modal('show');
    $('#previewFormModal .modal-dialog').addClass('modal-lg'); // Classe para aumentar o modal

    if (currentEditingElement) {
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

        // Copia a estrutura da drop-area com as form_row e seus estilos
        var dropArea = document.querySelector('.drop-area');
        if (dropArea) {
            var dropAreaClone = dropArea.cloneNode(true); // Clona a drop-area inteira

            // Itera sobre as divs form_row para garantir que seus estilos inline sejam preservados
            var formRows = dropAreaClone.querySelectorAll('.form_row');
            formRows.forEach(function(formRow) {
                // Remove qualquer div com a classe 'control-buttons' dentro de form_row
                var controlButtons = formRow.querySelectorAll('.control-buttons');
                controlButtons.forEach(function(container) {
                    container.remove(); // Remove a div control-buttons
                });

                var computedStyle = window.getComputedStyle(formRow);
                formRow.style.cssText = computedStyle.cssText; // Aplica os estilos calculados para a visualização
            });

            // Adiciona a drop-area clonada ao preview
            formPreview.appendChild(dropAreaClone);
        }
    } else {
        console.error("Nenhum elemento está sendo editado para visualizar");
    }
}
