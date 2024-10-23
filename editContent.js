// Função para converter cor RGB para hexadecimal
function rgbToHex(rgb) {
    // Extrai os valores R, G e B
    var result = rgb.match(/\d+/g);
    if (result) {
        var r = parseInt(result[0]).toString(16).padStart(2, '0');
        var g = parseInt(result[1]).toString(16).padStart(2, '0');
        var b = parseInt(result[2]).toString(16).padStart(2, '0');
        // Retorna o valor hexadecimal no formato #RRGGBB
        return `#${r}${g}${b}`;
    }
    return '#000000'; // Valor padrão se a conversão falhar
}

function editComponent(button) {
    var element = button.closest('.conteudo_inserido');
    var targetElement;

    // Selecionando os elementos alvo
    if (element.querySelector('input')) {
        targetElement = element.querySelector('label');
    } else if (element.querySelector('button') && button !== element.querySelector('button')) {
        targetElement = element.querySelector('button');
    } else if (element.querySelector('select')) {
        targetElement = element.querySelector('label');
    } else if (element.querySelector('h3')) {
        targetElement = element.querySelector('h3');
    }

    if (targetElement) {
        // Preencher nome e ID do componente
        document.getElementById('componentName').value = targetElement.innerText || '';
        document.getElementById('componentId').value = targetElement.id || '';

        // Obter estilos computados
        var computedStyles = window.getComputedStyle(targetElement);
        document.getElementById('fontSize').value = parseInt(computedStyles.fontSize);

        // Converter a cor da fonte para hexadecimal
        var fontColor = computedStyles.color;
        var fontColorHex = rgbToHex(fontColor);
        document.getElementById('fontColor').value = fontColorHex;

        // Obter a cor de fundo e converter para hexadecimal
        var backgroundColor = computedStyles.backgroundColor;
        var backgroundColorHex = rgbToHex(backgroundColor);
        document.getElementById('backgroundColor').value = backgroundColorHex;

        // Converter a cor da borda para hexadecimal
        var borderColor = computedStyles.borderColor;
        var borderColorHex = rgbToHex(borderColor);
        
        // Verifica se a cor da borda não é transparente ou inexistente
        if (borderColor === 'transparent' || borderColor === 'rgba(0, 0, 0, 0)') {
            document.getElementById('borderColor').value = '#000000'; // Define um valor padrão
        } else {
            document.getElementById('borderColor').value = borderColorHex;
        }

        // Verificar e definir o estilo da borda
        var borderStyle = computedStyles.borderStyle;
        if (borderStyle === 'none') {
            document.getElementById('borderStyleSelect').value = 'solid'; // Define um estilo padrão
        } else {
            document.getElementById('borderStyleSelect').value = borderStyle;
        }

        // Verificação de fundo transparente
        if (backgroundColor === 'transparent' || backgroundColor === 'rgba(0, 0, 0, 0)') {
            document.getElementById('transparentCheckbox').checked = true;
        } else {
            document.getElementById('transparentCheckbox').checked = false;
        }

        // Se o elemento for um botão, definir cores específicas
        if (element.querySelector('button') && button !== element.querySelector('button')) {
            document.getElementById('fontColor').value = '#ffffff';
            document.getElementById('borderColor').value = '#007BFF';
        }

        // Verificações de estilos de fonte
        document.getElementById('boldCheckbox').checked = computedStyles.fontWeight === 'bold';
        document.getElementById('italicCheckbox').checked = computedStyles.fontStyle === 'italic';
        document.getElementById('strikethroughCheckbox').checked = computedStyles.textDecoration.includes('line-through');

        // Estilos de alinhamento de texto e largura da borda
        var textAlign = computedStyles.textAlign;
        if (textAlign === 'left' || textAlign === 'start') {
            document.getElementById('textAlignSelect').value = 'left';
        } else if (textAlign === 'center') {
            document.getElementById('textAlignSelect').value = 'center';
        } else if (textAlign === 'right' || textAlign === 'end') {
            document.getElementById('textAlignSelect').value = 'right';
        }
        document.getElementById('borderWidth').value = parseInt(computedStyles.borderWidth);

        // Mostrar o modal
        $('#editComponentModal').modal('show');
        window.currentEditingElement = targetElement;

        console.log('Elemento editado: ', targetElement);
        console.log('Cor de fundo armazenada: ', backgroundColorHex);
        console.log('Cor do campo de background: ', document.getElementById('backgroundColor').value);
        console.log('Cor da borda: ', borderColorHex);
        console.log('Cor da fonte: ', fontColorHex);
    }
}



function saveChanges() {
    // Obtém o novo texto inserido pelo usuário
    var newName = document.getElementById('componentName').value.charAt(0).toUpperCase() + document.getElementById('componentName').value.slice(1);
    
    // Obtém o novo ID
    var newId = document.getElementById('componentId').value;
    
    // Obtém opções de estilo escolhidas pelo usuário
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
        if (isTransparent) {
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

        // Aplicar cortado (tachado)
        window.currentEditingElement.style.textDecoration = '';
        if (isStrikethrough) {
            window.currentEditingElement.style.textDecoration += 'line-through ';
        }
    }

    // Fechar o modal
    $('#editComponentModal').modal('hide');
}


function previewImage(event) {
    var input = event.target; // O input file que disparou o evento
    var imagePreview = input.parentElement.querySelector('#imagePreview'); // O elemento img onde a pré-visualização será exibida
    var removeImageButton = input.parentElement.querySelector('#removeImageButton'); // O botão de remover imagem

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            // Definir o src da imagem com o conteúdo carregado
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block'; // Mostrar a imagem

            // Ocultar a label e o input
            input.style.display = 'none';
            input.previousElementSibling.style.display = 'none'; // Ocultar a label
            removeImageButton.style.display = 'inline'; // Mostrar o botão de remover
        };

        reader.readAsDataURL(input.files[0]); // Ler o arquivo como URL base64
    }
}

function removeImage(button) {
    var imagePreview = button.parentElement.querySelector('#imagePreview');
    var input = button.parentElement.querySelector('#imagem');

    // Limpa a pré-visualização da imagem
    imagePreview.src = '';
    imagePreview.style.display = 'none'; // Oculta a imagem

    // Oculta o botão de remover imagem
    button.style.display = 'none';

    // Mostra novamente a label e o input
    input.style.display = 'block';
    input.previousElementSibling.style.display = 'block'; // Mostrar a label

    // Limpa o campo de input
    input.value = '';
}

function showControlsImage(row) {
    var removeImageButton = row.querySelector('#removeImageButton');
    
    // Verificar se o botão existe antes de tentar acessá-lo
    if (removeImageButton) {
        removeImageButton.style.display = 'inline'; // Mostrar o botão de remover
    }
}

function hideControlsImage(row) {
    var removeImageButton = row.querySelector('#removeImageButton');
    
    // Verificar se o botão existe antes de tentar acessá-lo
    if (removeImageButton) {
        removeImageButton.style.display = 'none'; // Ocultar o botão de remover
    }
}

function showControlsOption(row) {
    var removeOptionButton = row.querySelector('.removeOptionButton'); 
    var addOptionButton = row.querySelector('.addOptionButton');
    
    // Verificar se os botões existem antes de tentar acessá-los
    if (removeOptionButton) {
        removeOptionButton.style.display = 'inline';
    }
    if (addOptionButton) {
        addOptionButton.style.display = 'inline';
    }
}

function hideControlsOption(row) {
    var removeOptionButton = row.querySelector('.removeOptionButton'); 
    var addOptionButton = row.querySelector('.addOptionButton');
    
    // Verificar se os botões existem antes de tentar acessá-los
    if (removeOptionButton) {
        removeOptionButton.style.display = 'none';
    }
    if (addOptionButton) {
        addOptionButton.style.display = 'none';
    }
}

function addOption(button) {
    // Obtém o contêiner onde o dropdown está localizado
    var container = button.closest('.conteudo');
    var select = container.querySelector('select');

    // Cria uma nova opção
    var newOptionValue = prompt("Insira o valor da nova opção:");
    var newOptionText = prompt("Insira o texto da nova opção:");

    // Se o usuário inseriu um valor e texto, adiciona a nova opção
    if (newOptionValue && newOptionText) {
        var newOption = document.createElement("option");
        newOption.value = newOptionValue;
        newOption.text = newOptionText;
        select.add(newOption);
    } else {
        alert("Valor e texto da opção são obrigatórios.");
    }
}

function removeOption(button) {
    // Obtém o contêiner onde o dropdown está localizado
    var container = button.closest('.conteudo');
    var select = container.querySelector('select');

    // Obtém a opção selecionada
    var selectedOption = select.options[select.selectedIndex];

    // Remove a opção selecionada se existir
    if (selectedOption) {
        select.remove(selectedOption.index);
    } else {
        alert("Por favor, selecione uma opção para remover.");
    }
}


function setColor(inputId, color) {
    document.getElementById(inputId).value = color;
}