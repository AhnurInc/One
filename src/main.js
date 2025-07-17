// =================================================================
// ARQUIVO DE SCRIPT CENTRAL - AHNUR INC.
// Auditoria: Completa. Versão consolidada.
// =================================================================

// --- 1. IMPORTAÇÕES ---
// Importa todas as funções que precisamos do Firebase em um só lugar.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, // <-- Lógica de login RESTAURADA
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Importa nossa configuração de projeto
import { firebaseConfig } from './firebase-config.js';

// --- 2. INICIALIZAÇÃO DO FIREBASE ---
// Inicializa os serviços que vamos usar em todo o aplicativo.
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- 3. LÓGICA ESPECÍFICA DE CADA PÁGINA ---
// Esta função é chamada quando o HTML da página está pronto.
// Ela verifica em qual página estamos e executa apenas o código necessário.
function runPageSpecificLogic() {
  const path = window.location.pathname;

  // LÓGICA DA PÁGINA DE LOGIN (index.html)
  if (path.endsWith('/') || path.endsWith('index.html')) {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Tenta fazer o login com as credenciais fornecidas
        signInWithEmailAndPassword(auth, email, password)
          .catch((error) => {
            console.error("Falha no login:", error.code);
            alert("E-mail ou senha inválidos.");
          });
      });
    }
  }

  // LÓGICA DA PÁGINA DE CLIENTES (clientes.html)
  if (path.endsWith('clientes.html')) {
    const addClientForm = document.getElementById('add-client-form');
    if (addClientForm) {
      addClientForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) {
          alert("Erro: Você não está logado.");
          return;
        }
        try {
          // Salva o novo cliente no banco de dados
          await addDoc(collection(db, "clientes"), {
            nome: document.getElementById('client-name').value,
            email: document.getElementById('client-email').value || null,
            telefone: document.getElementById('client-phone').value || null,
            carteiraId: document.getElementById('client-wallet').value || null,
            status: "Ativo",
            dataCriacao: serverTimestamp(),
            criadoPor: user.uid
          });
          alert("Cliente cadastrado com sucesso!");
          addClientForm.reset();
          $('#add-client-modal').modal('hide');
        } catch (error) {
          console.error("Erro ao salvar cliente: ", error);
          alert("Ocorreu um erro ao salvar o cliente.");
        }
      });
    }
  }

  // LÓGICA DE LOGOUT (Presente em todas as páginas internas)
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      signOut(auth).catch((error) => console.error("Erro ao sair:", error));
    });
  }
}

// --- 4. GUARDA DE AUTENTICAÇÃO GLOBAL ---
// Este é o vigia do nosso sistema. Ele roda em TODAS as páginas.
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  const isOnLoginPage = path.endsWith('/') || path.endsWith('index.html');

  if (user) {
    // Se o usuário ESTÁ LOGADO:
    // 1. Mostra o e-mail dele no cabeçalho.
    const userDisplayName = document.getElementById('user-display-name');
    if (userDisplayName) userDisplayName.textContent = user.email;
    
    // 2. Se ele estiver na página de login, redireciona para o dashboard.
    if (isOnLoginPage) {
      window.location.href = 'dashboard.html';
    }
  } else {
    // Se o usuário NÃO ESTÁ LOGADO:
    // 1. Se ele tentar acessar qualquer página que não seja a de login,
    //    redireciona-o de volta para o login.
    if (!isOnLoginPage) {
      window.location.href = 'index.html';
    }
  }
});

// --- 5. PONTO DE ENTRADA ---
// Inicia a execução da lógica da página assim que o DOM estiver pronto.
document.addEventListener('DOMContentLoaded', runPageSpecificLogic);
