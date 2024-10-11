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

            // Remover borda e ajustar margens e padding
            formRow.style.border = 'none'; 
            formRow.style.padding = '0'; 
            formRow.style.marginBottom = '10px'; 

            // Obter os estilos computados
            var computedStyle = window.getComputedStyle(formRow);
            
            // Aplicar manualmente os estilos importantes
            formRow.style.display = computedStyle.display;
            formRow.style.flexDirection = computedStyle.flexDirection;
            formRow.style.justifyContent = computedStyle.justifyContent;
            formRow.style.alignItems = computedStyle.alignItems;
            formRow.style.width = computedStyle.width;
            formRow.style.height = computedStyle.height;
            formRow.style.backgroundColor = computedStyle.backgroundColor;
            // Adicione outros estilos que você queira preservar

        });

        // Itera sobre as divs .components-container.col para remover as bordas
        var componentCols = dropAreaClone.querySelectorAll('.components-container.col');
        componentCols.forEach(function(col) {
            col.style.border = 'none'; // Remove a borda da coluna
        });

        // Adiciona a drop-area clonada ao preview
        formPreview.appendChild(dropAreaClone);

        
    } else {
        console.error("Nenhum elemento está sendo editado para visualizar");
    }
}
