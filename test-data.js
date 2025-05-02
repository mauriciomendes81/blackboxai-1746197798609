// Test data for layouts
const testLayouts = [
    {
        object: "Layout Principal",
        description: "Layout da página inicial do sistema",
        author: "João Silva"
    },
    {
        object: "Dashboard Admin",
        description: "Painel de controle administrativo",
        author: "Maria Santos"
    },
    {
        object: "Formulário de Cadastro",
        description: "Layout do formulário de registro de usuários",
        author: "Pedro Oliveira"
    }
];

// Store test data in localStorage
localStorage.setItem('layouts', JSON.stringify(testLayouts));
console.log('Test data has been added to localStorage');
