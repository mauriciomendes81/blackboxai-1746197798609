// Global variables
let dividerCounter = 0;
let textBoxCounter = 0;
let containerCounter = 0;
let currentLayoutId = null;

document.addEventListener('DOMContentLoaded', function() {
    // Add event delegation for delete buttons
    const dynamicContent = document.querySelector('#dynamic-content');
    if (dynamicContent) {
        dynamicContent.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('delete-button')) {
                try {
                    if (confirm('Tem certeza que deseja deletar este objeto?')) {
                        const dynamicElem = e.target.closest('.dynamic-element');
                        if (dynamicElem) {
                            dynamicElem.remove();
                        } else {
                            console.error('Elemento "dynamic-element" não encontrado para remoção.');
                        }
                    }
                } catch (error) {
                    console.error('Erro ao tentar deletar o objeto:', error);
                    alert('Erro ao tentar deletar o objeto. Por favor, tente novamente.');
                }
            }
        });
    }
    // Add delegated click event listener for toggle functionality
    document.addEventListener('click', function(e) {
        try {
            // Toggle container visibility
            if (e.target.matches('.toggle-container')) {
                const container = e.target.closest('.dynamic-element');
                if (container) {
                    const containerBody = container.querySelector('.space-y-4');
                    if (containerBody) {
                        if (containerBody.classList.contains('hidden')) {
                            containerBody.classList.remove('hidden');
                            e.target.innerHTML = '▼ Ocultar';
                        } else {
                            containerBody.classList.add('hidden');
                            e.target.innerHTML = '▶ Exibir';
                        }
                    } else {
                        console.error('Container body not found for toggling.');
                    }
                }
            }
            // Toggle hidden child container
            if (e.target.matches('.toggle-child')) {
                const dynamicBox = e.target.closest('.dynamic-element');
                if (dynamicBox) {
                    const childCont = dynamicBox.querySelector('.child-container');
                    if (childCont) {
                        childCont.classList.toggle('hidden');
                    } else {
                        console.error('Child container not found for toggling.');
                    }
                }
            }
        } catch (error) {
            console.error('Error during delegated click processing:', error);
        }
    });

    // Check for layout to load from sessionStorage
    if (window.location.pathname.endsWith('index.html')) {
        try {
            const selectedLayout = sessionStorage.getItem('selectedLayout');
            if (selectedLayout) {
                const layout = JSON.parse(selectedLayout);
                // Validate that all required properties exist
                if (layout.object && layout.description && layout.author && layout.content) {
                    // If no "id" exists, assign one now
                    if (!layout.id) {
                        layout.id = Date.now();
                    }
                    
                    // Populate input fields and dynamic content
                    document.querySelector('input[placeholder="Objeto"]').value = layout.object;
                    document.querySelector('input[placeholder="Descrição"]').value = layout.description;
                    document.querySelector('input[placeholder="Autor"]').value = layout.author;
                    document.querySelector('#dynamic-content').innerHTML = layout.content;
                    
                    // Flag edit mode if an id exists
                    currentLayoutId = layout.id;
                    
                    // Show edit mode banner
                    const editBanner = document.getElementById('edit-mode-banner');
                    if (editBanner) {
                        editBanner.classList.remove('hidden');
                    }
                    
                    // Add fade-in effect
                    document.querySelector('#dynamic-content').classList.add('transition-opacity', 'duration-500', 'ease-in');
                }
                // Clear the sessionStorage after loading
                sessionStorage.removeItem('selectedLayout');
            }
        } catch (error) {
            console.error('Error loading layout:', error);
            alert('Erro ao carregar layout selecionado.');
            sessionStorage.removeItem('selectedLayout');
        }
    }

    // Input field validations
    const inputObject = document.querySelector('input[placeholder="Objeto"]');
    const inputDescription = document.querySelector('input[placeholder="Descrição"]');
    const inputAuthor = document.querySelector('input[placeholder="Autor"]');

    // Add required attribute to all inputs
    [inputObject, inputDescription, inputAuthor].forEach(input => {
        input.required = true;
    });

    // Special validation for Object input (T1)
    inputObject.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\s/g, '').toUpperCase();
    });

    // Sidebar toggle functionality
    const sidebar = document.querySelector('aside');
    const mainContent = document.querySelector('main');
    let sidebarVisible = true;

    // Add toggle button to sidebar
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '◀';
    toggleButton.className = 'absolute -right-3 top-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md hover:bg-blue-600 transition-colors';
    sidebar.querySelector('.p-4').prepend(toggleButton);

    toggleButton.addEventListener('click', () => {
        sidebarVisible = !sidebarVisible;
        sidebar.style.transform = sidebarVisible ? 'translateX(0)' : 'translateX(-256px)';
        mainContent.style.marginLeft = sidebarVisible ? '16rem' : '0';
        toggleButton.innerHTML = sidebarVisible ? '◀' : '▶';
    });

    // Sidebar buttons functionality
    document.getElementById('btn-divider').addEventListener('click', () => addDivider(document.querySelector('#dynamic-content')));
    document.getElementById('btn-textbox').addEventListener('click', () => addTextBoxS2(document.querySelector('#dynamic-content')));
    document.getElementById('btn-hiddentextbox').addEventListener('click', () => addTextBoxS3(document.querySelector('#dynamic-content')));
    document.getElementById('btn-container').addEventListener('click', () => addContainer(document.querySelector('#dynamic-content')));

    // Footer buttons functionality
    document.getElementById('btn-save').addEventListener('click', saveLayout);
    document.getElementById('btn-load').addEventListener('click', loadLayout);

    // Header Lista button functionality
    document.getElementById('btn-list').addEventListener('click', () => {
        window.location.href = 'lista.html';
    });
});

// Function to create text formatting controls
function createFormatControls() {
    const controls = document.createElement('div');
    controls.className = 'flex gap-2 mb-2';

    const boldBtn = document.createElement('button');
    boldBtn.innerHTML = 'B';
    boldBtn.className = 'px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold';
    
    const centerBtn = document.createElement('button');
    centerBtn.innerHTML = '⚌';
    centerBtn.className = 'px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm';

    controls.append(boldBtn, centerBtn);
    return controls;
}

// Function to create delete button
function createDeleteButton() {
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = 'x';
    deleteBtn.className = 'delete-button absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600';
    deleteBtn.title = 'Deletar objeto';
    return deleteBtn;
}

// Function to add divider (BotãoS 1)
function addDivider() {
    const dividerContainer = document.createElement('div');
    dividerContainer.className = 'dynamic-element relative my-4';
    dividerContainer.id = `divider-${dividerCounter++}`;

    const hr = document.createElement('hr');
    hr.className = 'border-gray-300';

    const deleteBtn = createDeleteButton();

    dividerContainer.append(hr, deleteBtn);
    if (parent && parent instanceof Element) {
        parent.appendChild(dividerContainer);
    } else {
        document.querySelector('#dynamic-content').appendChild(dividerContainer);
    }
}

// Function to add text box (BotãoS 2)
function addTextBoxS2(parent = null) {
    const container = document.createElement('div');
    container.className = 'dynamic-element relative my-4';
    container.id = `textbox-${textBoxCounter++}`;

    const controls = createFormatControls();
    const deleteBtn = createDeleteButton();

    const textarea = document.createElement('div');
    textarea.contentEditable = true;
    textarea.className = 'min-h-[100px] p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

    // Auto-growing functionality
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });

    container.append(deleteBtn, controls, textarea);
    
    if (parent && parent instanceof Element) {
        parent.appendChild(container);
    } else {
        document.querySelector('#dynamic-content').appendChild(container);
    }

    // Add formatting functionality
    controls.querySelector('button:first-child').onclick = () => {
        document.execCommand('bold', false, null);
    };
    controls.querySelector('button:last-child').onclick = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.style.textAlign = 'center';
            span.style.display = 'block';
            range.surroundContents(span);
        }
    };
}

// Function to add text box with hidden child (BotãoS 3)
function addTextBoxS3(parent = null) {
    const container = document.createElement('div');
    container.className = 'dynamic-element relative my-4';
    container.id = `hidden-textbox-${textBoxCounter++}`;

    const controls = createFormatControls();
    const deleteBtn = createDeleteButton();

    // Add eye button
    const eyeBtn = document.createElement('button');
    eyeBtn.innerHTML = '👁';
    eyeBtn.className = 'px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm ml-2';
    controls.appendChild(eyeBtn);

    const textarea = document.createElement('div');
    textarea.contentEditable = true;
    textarea.className = 'min-h-[100px] p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

    // Create child textarea (hidden by default)
    const childContainer = document.createElement('div');
    childContainer.className = 'mt-2 hidden';
    childContainer.id = `child-textbox-${textBoxCounter}`;

    const childTextarea = document.createElement('div');
    childTextarea.contentEditable = true;
    childTextarea.className = 'min-h-[100px] p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

    childContainer.appendChild(childTextarea);

    container.append(deleteBtn, controls, textarea, childContainer);
    
    if (parent && parent instanceof Element) {
        parent.appendChild(container);
    } else {
        document.querySelector('#dynamic-content').appendChild(container);
    }

    // Add formatting functionality
    controls.querySelector('button:first-child').onclick = () => {
        document.execCommand('bold', false, null);
    };
    controls.querySelector('button:last-child').onclick = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.style.textAlign = 'center';
            span.style.display = 'block';
            range.surroundContents(span);
        }
    };

    // Add toggle-child class to eye button
    eyeBtn.classList.add('toggle-child');
    // Add child-container class to childContainer
    childContainer.classList.add('child-container');
}

// Function to add container (BotãoS 4)
function addContainer(parent = null) {
    // Create main container
    const containerDiv = document.createElement('div');
    containerDiv.className = 'dynamic-element relative my-4 p-4 border-2 border-dashed border-gray-300 rounded';
    containerDiv.id = `container-${containerCounter++}`;

    // Create container header
    const containerHeader = document.createElement('div');
    containerHeader.className = 'flex justify-between items-center mb-4';

    // Create header controls group (left side)
    const headerControls = document.createElement('div');
    headerControls.className = 'flex items-center gap-2';

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '▼ Ocultar';
    toggleBtn.className = 'px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm transition-colors toggle-container';

    // Create delete button
    const deleteBtn = createDeleteButton();

    // Create container body for content
    const containerBody = document.createElement('div');
    containerBody.className = 'space-y-4';

    // Create controls for adding elements
    const controls = document.createElement('div');
    controls.className = 'flex gap-2 mb-4';

    const addTextareaBtn = document.createElement('button');
    addTextareaBtn.innerHTML = '+ Textarea';
    addTextareaBtn.className = 'px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors';

    const addNestedTextareaBtn = document.createElement('button');
    addNestedTextareaBtn.innerHTML = '+ Nested Textarea';
    addNestedTextareaBtn.className = 'px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors';

    const addContainerBtn = document.createElement('button');
    addContainerBtn.innerHTML = '+ Container';
    addContainerBtn.className = 'px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors';

    // Assemble the container structure
    controls.append(addTextareaBtn, addNestedTextareaBtn, addContainerBtn);
    headerControls.append(toggleBtn);
    containerHeader.append(headerControls, deleteBtn);
    containerBody.appendChild(controls);
    containerDiv.append(containerHeader, containerBody);

    // Add to parent or main
    if (parent && parent instanceof Element) {
        parent.appendChild(containerDiv);
    } else {
        document.querySelector('#dynamic-content').appendChild(containerDiv);
    }

    // Add toggle-container class to toggle button
    toggleBtn.classList.add('toggle-container');

    // Add event listeners for buttons
    addTextareaBtn.onclick = () => addTextBoxS2(containerBody);
    addNestedTextareaBtn.onclick = () => addTextBoxS3(containerBody);
    addContainerBtn.onclick = () => addContainer(containerBody);

    return containerDiv;
}

// Function to download layout
function downloadLayout(layout) {
    try {
        const blob = new Blob([JSON.stringify(layout, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${layout.object}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Erro ao efetuar download do arquivo:', error);
        alert('Erro ao efetuar download do arquivo.');
    }
}

// Function to save layout
function saveLayout() {
    // Gather layout data from UI
    const layout = {
        object: document.querySelector('input[placeholder="Objeto"]').value,
        description: document.querySelector('input[placeholder="Descrição"]').value,
        author: document.querySelector('input[placeholder="Autor"]').value,
        content: document.querySelector('#dynamic-content').innerHTML
    };

    // Validate required fields
    if (!layout.object || !layout.description || !layout.author) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Load current layouts from localStorage
    let layoutsArray = [];
    try {
        layoutsArray = JSON.parse(localStorage.getItem('layouts') || '[]');
    } catch (e) {
        console.error('Erro ao ler layouts do localStorage:', e);
        layoutsArray = [];
    }

    // If editing existing layout then update it; otherwise, add a new layout
    if (currentLayoutId) {
        // Update existing layout record
        const indexToUpdate = layoutsArray.findIndex(item => item.id === currentLayoutId);
        layout.id = currentLayoutId;
        if (indexToUpdate !== -1) {
            layoutsArray[indexToUpdate] = layout;
            localStorage.setItem('layouts', JSON.stringify(layoutsArray));
            if (confirm('Deseja efetuar o download do arquivo atualizado?')) {
                downloadLayout(layout);
            }
            alert('Layout atualizado com sucesso!');
        } else {
            // If not found, treat as new layout
            currentLayoutId = Date.now();
            layout.id = currentLayoutId;
            layoutsArray.push(layout);
            localStorage.setItem('layouts', JSON.stringify(layoutsArray));
            if (confirm('Deseja efetuar o download do arquivo?')) {
                downloadLayout(layout);
            }
            alert('Layout salvo com sucesso (criado novo registro).');
        }
    } else {
        // Save new layout
        currentLayoutId = Date.now();
        layout.id = currentLayoutId;
        layoutsArray.push(layout);
        localStorage.setItem('layouts', JSON.stringify(layoutsArray));
        if (confirm('Deseja efetuar o download do arquivo?')) {
            downloadLayout(layout);
        }
        alert('Layout salvo com sucesso!');
    }

    // Clear the form and dynamic content after saving
    document.querySelector('#dynamic-content').innerHTML = '';
    document.querySelectorAll('input').forEach(input => input.value = '');

    // Hide the edit banner - layout has been saved/updated
    const editBanner = document.getElementById('edit-mode-banner');
    if (editBanner) {
        editBanner.classList.add('hidden');
    }

    // Reset the global variable after saving
    currentLayoutId = null;
}

// Function to load layout
function loadLayout() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const layout = JSON.parse(e.target.result);
                
                if (confirm(`Deseja carregar o arquivo "${layout.object}"?\nDescrição: ${layout.description}`)) {
                    // If no id exists, assign one now
                    if (!layout.id) {
                        layout.id = Date.now();
                    }
                    
                    // Set currentLayoutId for edit mode
                    currentLayoutId = layout.id;
                    
                    // Show edit mode banner
                    const editBanner = document.getElementById('edit-mode-banner');
                    if (editBanner) {
                        editBanner.classList.remove('hidden');
                    }
                    
                    // Populate fields
                    document.querySelector('input[placeholder="Objeto"]').value = layout.object;
                    document.querySelector('input[placeholder="Descrição"]').value = layout.description;
                    document.querySelector('input[placeholder="Autor"]').value = layout.author;
                    document.querySelector('#dynamic-content').innerHTML = layout.content;
                }
            } catch (err) {
                alert('Erro ao carregar o arquivo.');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}
