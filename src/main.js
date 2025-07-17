// Adicionamos um log no início para ter certeza que o arquivo está sendo lido.
console.log("Módulo main.js carregado.");

// Importa as funções que vamos precisar do Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Importa a nossa configuração do outro arquivo
import { firebaseConfig } from './firebase-config.js';

// --- ESTRUTURA PRINCIPAL ---
// Adiciona um "escutador" ao documento. A função aqui dentro só vai rodar
// quando o navegador terminar de carregar todo o HTML da página.
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente carregado. Iniciando a aplicação.");

    try {
        // Inicializa a conexão com o Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        console.log("Firebase inicializado com sucesso.");

        // Procura o formulário de login na página
        const loginForm = document.getElementById('login-form');

        if (loginForm) {
            console.log("Formulário de login encontrado. Adicionando o 'escutador' de envio.");
            
            loginForm.addEventListener('submit', (event) => {
                // Previne o recarregamento da página
                event.preventDefault();
                console.log("Envio do formulário interceptado.");

                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        console.log("Login bem-sucedido:", userCredential.user);
                        alert("Login realizado com sucesso! Redirecionando...");
                        window.location.href = 'dashboard.html';
                    })
                    .catch((error) => {
                        console.error("Erro no login:", error.code, error.message);
                        let friendlyMessage = 'E-mail ou senha inválidos. Verifique os dados e tente novamente.';
                        alert(friendlyMessage);
                    });
            });
        } else {
            console.log("Nenhum formulário de login encontrado nesta página.");
        }

    } catch (error) {
        console.error("Erro Crítico - Falha ao inicializar o Firebase:", error);
        alert("ERRO: Não foi possível conectar aos nossos serviços. Verifique o console para mais detalhes.");
    }
});