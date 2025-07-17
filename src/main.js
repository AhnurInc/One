// Importa as funções da versão 10 do Firebase (mais moderna)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Importa nossa configuração
import { firebaseConfig } from './firebase-config.js';

// Inicializa o Firebase e os serviços de autenticação
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Função principal que roda o nosso aplicativo.
 * Ela decide qual lógica executar baseado na página atual.
 */
function runApp() {
  const path = window.location.pathname;

  // --- LÓGICA DA PÁGINA DE LOGIN ---
  if (path.endsWith('/') || path.endsWith('index.html')) {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Sucesso, o 'onAuthStateChanged' vai cuidar do redirecionamento
            console.log("Login bem-sucedido para:", userCredential.user.email);
          })
          .catch((error) => {
            console.error("Falha no login:", error.code);
            alert("E-mail ou senha inválidos.");
          });
      });
    }
  }

  // --- LÓGICA DA PÁGINA DE DASHBOARD ---
  if (path.endsWith('dashboard.html')) {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        signOut(auth).catch((error) => {
          console.error("Erro ao sair:", error);
        });
      });
    }
  }
}

/**
 * Escutador de estado de autenticação.
 * Esta é a forma mais robusta de saber se um usuário está logado ou não.
 * Ele roda automaticamente quando a página carrega e sempre que o estado de login muda.
 */
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  const isOnLoginPage = path.endsWith('/') || path.endsWith('index.html');

  if (user) {
    // Usuário está LOGADO
    console.log("Usuário está logado:", user.email);
    if (isOnLoginPage) {
      // Se ele está logado e na página de login, redireciona para o dashboard
      window.location.href = 'dashboard.html';
    }
  } else {
    // Usuário está DESLOGADO
    console.log("Nenhum usuário logado.");
    if (!isOnLoginPage) {
      // Se ele não está logado e TENTA acessar outra página, redireciona para o login
      window.location.href = 'index.html';
    }
  }
});

// Inicia nosso aplicativo
runApp();
