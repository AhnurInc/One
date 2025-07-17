// Importa as funções que vamos precisar do Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Importa a nossa configuração do outro arquivo
import { firebaseConfig } from './firebase-config.js';

// --- INICIALIZAÇÃO DO FIREBASE ---
// Inicializa a conexão com o Firebase e obtém o serviço de autenticação
try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    console.log("Firebase inicializado com sucesso.");

    // --- LÓGICA DE LOGIN ---
    // Agora que temos certeza que o Firebase está pronto, vamos configurar o formulário.
    
    // Procura o formulário de login na página
    const loginForm = document.getElementById('login-form');

    // VERIFICAÇÃO IMPORTANTE: Só continua se o formulário de login existir nesta página
    if (loginForm) {
        console.log("Formulário de login encontrado. Adicionando o 'escutador'.");
        
        // Adiciona o "escutador" que espera o clique no botão "Entrar"
        loginForm.addEventListener('submit', (event) => {
            // Previne o recarregamento da página
            event.preventDefault();
            console.log("Formulário enviado, prevenindo recarregamento.");

            // Pega os elementos e os valores digitados
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const email = emailInput.value;
            const password = passwordInput.value;

            // Tenta fazer o login com a função do Firebase
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // SUCESSO!
                    console.log("Login bem-sucedido:", userCredential.user);
                    alert("Login realizado com sucesso! Redirecionando...");
                    window.location.href = 'dashboard.html';
                })
                .catch((error) => {
                    // ERRO!
                    console.error("Erro no login:", error);
                    let friendlyMessage = "Ocorreu um erro desconhecido.";
                    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                        friendlyMessage = 'E-mail ou senha inválidos. Verifique os dados e tente novamente.';
                    } else if (error.code === 'auth/wrong-password') {
                        friendlyMessage = 'Senha incorreta. Tente novamente.';
                    }
                    alert(friendlyMessage);
                });
        });
    } else {
        console.log("Nenhum formulário de login encontrado nesta página.");
    }

} catch (error) {
    console.error("Erro Crítico - Falha ao inicializar o Firebase:", error);
    alert("Não foi possível conectar aos nossos serviços. Por favor, tente recarregar a página.");
}