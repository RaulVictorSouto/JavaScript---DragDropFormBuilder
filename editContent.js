function editComponent(button) {
    // Obtém o elemento pai do botão clicado, que é o contêiner do componente
    var element = button.parentElement;

    // Inicializa uma variável para armazenar o elemento alvo que será editado (label, botão, ou <h3>)
    var targetElement;

    // Verifica se o componente contém um campo de input
    if (element.querySelector('input')) {
        // Se for um campo de input, pega o label correspondente
        targetElement = element.querySelector('label');
    } 
    // Verifica se o componente contém um botão, mas ignora o botão de editar/remover
    else if (element.querySelector('button') && button !== element.querySelector('button')) {
        // Se for um botão, define o botão como alvo
        targetElement = element.querySelector('button');
        document.querySelector('.backgroundColor').value = '#007BFF';
        document.querySelector('.fontColor').value = '#ffffff';
        document.getElementById('transparentCheckbox').checked = false;
    } 
    // Verifica se o componente contém um campo de seleção (dropdown)
    else if (element.querySelector('select')) {
        // Se for um dropdown, pega o label correspondente
        targetElement = element.querySelector('label');
    }
    // Verifica se o componente contém um título <h3>
    else if (element.querySelector('h3')) {
        // Se for um título <h3>, define como o elemento alvo
        targetElement = element.querySelector('h3');
    }

     // Se encontrou o elemento correto (label, botão, ou <h3>), continua com o processo de edição
     if (targetElement) {
        // Preenche o nome/conteúdo do componente
        document.getElementById('componentName').value = targetElement.innerText;

        // Preenche o ID atual do componente
        document.getElementById('componentId').value = targetElement.id || '';

        // Preenche os estilos de fonte, cor, etc.
        document.getElementById('fontSize').value = parseInt(window.getComputedStyle(targetElement).fontSize); // Tamanho da fonte
        document.getElementById('fontColor').value = window.getComputedStyle(targetElement).color; // Cor da fonte
        document.getElementById('backgroundColor').value = window.getComputedStyle(targetElement).backgroundColor; // Cor de fundo

        // Verifica se o fundo está transparente
        if (window.getComputedStyle(targetElement).backgroundColor === 'transparent') {
            document.getElementById('transparentCheckbox').checked = true;
        } else {
            document.getElementById('transparentCheckbox').checked = false;
        }

        // Verifica estilos como negrito, itálico, sublinhado, cortado
        document.getElementById('boldCheckbox').checked = window.getComputedStyle(targetElement).fontWeight === 'bold';
        document.getElementById('italicCheckbox').checked = window.getComputedStyle(targetElement).fontStyle === 'italic';
        document.getElementById('strikethroughCheckbox').checked = window.getComputedStyle(targetElement).textDecoration.includes('line-through');

        // Verifica o alinhamento de texto
        document.getElementById('textAlignSelect').value = window.getComputedStyle(targetElement).textAlign;

        // Verifica estilos de borda
        document.getElementById('borderStyleSelect').value = window.getComputedStyle(targetElement).borderStyle;
        document.getElementById('borderWidth').value = parseInt(window.getComputedStyle(targetElement).borderWidth);
        document.getElementById('borderColor').value = window.getComputedStyle(targetElement).borderColor;

        // Abre o modal de edição usando Bootstrap
        $('#editComponentModal').modal('show');

        // Armazena a referência ao elemento que está sendo editado para atualizá-lo mais tarde
        window.currentEditingElement = targetElement;
    }
}

function saveChanges() {
    // Obtém o novo texto inserido pelo usuário
    var newName = document.getElementById('componentName').value;

    // Obtém o novo ID inserido pelo usuário
    var newId = document.getElementById('componentId').value;

    // Obtém as opções de estilo escolhidas pelo usuário
    var selectedFont = document.getElementById('fontSelect').value;
    var selectedTextAlign = document.getElementById('textAlignSelect').value;
    var selectedBorderStyle = document.getElementById('borderStyleSelect').value;

    // Novas opções adicionadas
    var fontSize = document.getElementById('fontSize').value + 'px'; // Tamanho da fonte
    var fontColor = document.getElementById('fontColor').value;      // Cor da fonte
    var backgroundColor = document.getElementById('backgroundColor').value;  // Cor de fundo
    var isTransparent = document.getElementById('transparentCheckbox').checked; // Fundo Transparente
    var borderWidth = document.getElementById('borderWidth').value + 'px';   // Largura da borda
    var borderColor = document.getElementById('borderColor').value;   // Cor da borda
    var isBold = document.getElementById('boldCheckbox').checked;     // Negrito
    var isItalic = document.getElementById('italicCheckbox').checked; // Itálico
    var isStrikethrough = document.getElementById('strikethroughCheckbox').checked; // Cortado


    // Atualiza o texto do componente (botão, label ou <h3>)
    if (window.currentEditingElement) {
        window.currentEditingElement.innerText = newName;

        // Atualiza o ID do componente, se o campo não estiver vazio
        if (newId) {
            window.currentEditingElement.id = newId;
        }

        // Aplicar estilo de fonte
        window.currentEditingElement.style.fontFamily = selectedFont;

        // Aplicar tamanho da fonte
        window.currentEditingElement.style.fontSize = fontSize;

        // Aplicar cor da fonte
        window.currentEditingElement.style.color = fontColor;

        // Aplicar cor de fundo
        if (isTransparent === true) {
            window.currentEditingElement.style.backgroundColor = 'transparent'; // Para um fundo transparente
        } else {
            window.currentEditingElement.style.backgroundColor = backgroundColor;
        }
        
        // Aplicar alinhamento de texto
        window.currentEditingElement.style.textAlign = selectedTextAlign;

        // Aplicar estilo de borda
        window.currentEditingElement.style.borderStyle = selectedBorderStyle;
        window.currentEditingElement.style.borderWidth = borderWidth;
        window.currentEditingElement.style.borderColor = borderColor;

        // Aplicar negrito e itálico
        window.currentEditingElement.style.fontWeight = isBold ? 'bold' : 'normal';
        window.currentEditingElement.style.fontStyle = isItalic ? 'italic' : 'normal';

        // Aplicar cortado (tachado) e sublinhado
        window.currentEditingElement.style.textDecoration = '';
        if (isStrikethrough) {
            window.currentEditingElement.style.textDecoration += 'line-through ';
        }
    }

    // Fechar o modal
    $('#editComponentModal').modal('hide');
}
