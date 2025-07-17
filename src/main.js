// Importa as funções da versão 10 do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Importa nossa configuração
import { firebaseConfig } from './firebase-config.js';

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Função que roda a lógica específica de cada página.
 */
function runPageSpecificLogic() {
  const path = window.location.pathname;

  // Lógica para a página de LOGIN
  if (path.endsWith('/') || path.endsWith('index.html')) {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        signInWithEmailAndPassword(auth, email, password)
          .catch((error) => {
            console.error("Falha no login:", error.code);
            alert("E-mail ou senha inválidos.");
          });
      });
    }
  }

  // Lógica para a página de DASHBOARD
  if (path.endsWith('dashboard.html')) {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        signOut(auth).catch((error) => console.error("Erro ao sair:", error));
      });
    }
  }
}

/**
 * Guarda de Autenticação Global
 * Roda em todas as páginas e gerencia o estado de login do usuário.
 */
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  const isOnLoginPage = path.endsWith('/') || path.endsWith('index.html');

  if (user) {
    // USUÁRIO LOGADO
    console.log("Usuário verificado:", user.email);
    // Preenche o nome do usuário no cabeçalho do dashboard
    const userDisplayName = document.getElementById('user-display-name');
    if (userDisplayName) {
      userDisplayName.textContent = user.email;
    }
    
    // Se estiver na página de login, redireciona para o dashboard
    if (isOnLoginPage) {
      window.location.href = 'dashboard.html';
    }
  } else {
    // USUÁRIO DESLOGADO
    console.log("Nenhum usuário logado.");
    // Se tentar acessar qualquer página interna, redireciona para o login
    if (!isOnLoginPage) {
      window.location.href = 'index.html';
    }
  }
});

// Inicia a lógica da página assim que o HTML estiver pronto
document.addEventListener('DOMContentLoaded', runPageSpecificLogic);
