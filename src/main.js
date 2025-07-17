console.log("Módulo main.js carregado.");

// Importa as funções que vamos precisar do Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// A MUDANÇA CRÍTICA ESTÁ AQUI:
// Usamos '../' para dizer "suba um nível de pasta" para encontrar o arquivo.
import { firebaseConfig } from '../firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente carregado. Iniciando a aplicação.");

    try {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        console.log("Firebase inicializado com sucesso.");

        const loginForm = document.getElementById('login-form');

        if (loginForm) {
            console.log("Formulário de login encontrado. Adicionando o 'escutador' de envio.");
            
            loginForm.addEventListener('submit', (event) => {
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
