// Importa as funções que vamos precisar do Firebase SDK
// Pense nisso como "pegar as ferramentas da caixa do Firebase"
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Importa a nossa configuração secreta do outro arquivo
import { firebaseConfig } from './firebase-config.js';

// Inicializa a conexão com o Firebase usando nossas chaves
const app = initializeApp(firebaseConfig);
// Obtém o serviço de autenticação do Firebase
const auth = getAuth(app);

// Pega os elementos do HTML para que possamos usá-los no JavaScript
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Adiciona um "escutador" ao formulário. Ele vai disparar uma ação quando o formulário for enviado (ou seja, quando o botão "Entrar" for clicado)
loginForm.addEventListener('submit', (event) => {
    // Previne o comportamento padrão do navegador, que é recarregar a página.
    event.preventDefault();

    // Pega os valores que o usuário digitou nos campos
    const email = emailInput.value;
    const password = passwordInput.value;

    // Mostra uma mensagem no console do navegador para depuração. Útil para nós!
    console.log(`Tentando fazer login com o e-mail: ${email}`);

    // Usa a função do Firebase para tentar fazer o login
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // SUCESSO! O login foi bem-sucedido.
            const user = userCredential.user;
            console.log("Login realizado com sucesso!", user);

            // Mostra um alerta de sucesso para o usuário
            alert("Login realizado com sucesso! Redirecionando...");

            // Redireciona o usuário para a página do dashboard
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            // ERRO! Algo deu errado.
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(`Erro no login: ${errorCode}`, errorMessage);

            // Traduz o erro para uma mensagem amigável para o usuário
            if (errorCode === 'auth/user-not-found') {
                alert('Erro: Usuário não encontrado. Verifique o e-mail digitado.');
            } else if (errorCode === 'auth/wrong-password') {
                alert('Erro: Senha incorreta. Tente novamente.');
            } else {
                alert(`Ocorreu um erro: ${errorMessage}`);
            }
        });
});