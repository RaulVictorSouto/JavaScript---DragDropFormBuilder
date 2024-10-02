/*
function editform() {
    /*
    // Obtém o elemento pai do botão clicado, que é o contêiner do componente
    var element = button.closest('.drop-area');
    var targetElement;

    // A lógica para encontrar o targetElement permanece a mesma...

    if (targetElement) {
        // Preenche o nome/conteúdo do componente
        document.getElementById('componentName').value = targetElement.innerText;

        // Preenche o ID atual do componente
        document.getElementById('componentId').value = targetElement.id;

        // Estilos de borda
        document.getElementById('borderWidth').value = parseInt(window.getComputedStyle(targetElement).borderWidth);
        document.getElementById('borderColor').value = window.getComputedStyle(targetElement).borderColor;

        // Verifica se a borda é circular
        document.getElementById('borderRadius').checked = window.getComputedStyle(targetElement).borderRadius !== '0px';

        // Padding
        const padding = window.getComputedStyle(targetElement).padding.split(' ');
        document.getElementById('paddingTop').value = parseInt(padding[0]);
        document.getElementById('paddingRight').value = parseInt(padding[1]);
        document.getElementById('paddingBottom').value = parseInt(padding[2]);
        document.getElementById('paddingLeft').value = parseInt(padding[3]);

       
        // Abre o modal de edição
        $('#editFormModal').modal('show'); 

        // Armazena a referência ao elemento que está sendo editado
        //window.currentEditingElement = targetElement;
    //}
}
*/

/*
function saveFormChanges() {
    // Obtém o novo texto inserido pelo usuário
    var newName = document.getElementById('componentName').value;

    // Obtém as novas opções de estilo escolhidas pelo usuário
    var borderColor = document.getElementById('borderColor').value;
    var borderWidth = document.getElementById('borderWidth').value + 'px';
    var isCircular = document.getElementById('borderRadius').checked;
    var paddingTop = document.getElementById('paddingTop').value + 'px';
    var paddingRight = document.getElementById('paddingRight').value + 'px';
    var paddingBottom = document.getElementById('paddingBottom').value + 'px';
    var paddingLeft = document.getElementById('paddingLeft').value + 'px';
    
    // Atualiza o texto do componente
    if (window.currentEditingElement) {
        window.currentEditingElement.innerText = newName;

        // Estilos de borda
        window.currentEditingElement.style.borderColor = borderColor;
        window.currentEditingElement.style.borderWidth = borderWidth;
        window.currentEditingElement.style.borderRadius = isCircular ? '50%' : '0'; // ou '0px' dependendo do seu estilo

        // Padding
        window.currentEditingElement.style.padding = `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`;
        
        // Aqui você pode adicionar lógica para manipular a imagem de fundo se necessário
    }

    // Fechar o modal
    $('#editFormModal').modal('hide');
}
*/

function editForm() {
    $('#editFormModal').modal('show'); // Usa jQuery para abrir o modal
}

function saveFormChanges() {
    // Lógica para salvar as mudanças
    alert("Mudanças salvas!"); // Apenas um exemplo de alerta
    $('#editFormModal').modal('hide'); // Fecha o modal após salvar
}
