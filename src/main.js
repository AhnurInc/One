// Importa as funções do Firebase que vamos usar
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// NOVAS IMPORTAÇÕES PARA O BANCO DE DADOS
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Importa nossa configuração
import { firebaseConfig } from './firebase-config.js';

// Inicialização dos serviços
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Inicializa o Firestore

/**
 * Lógica específica de cada página
 */
function runPageSpecificLogic() {
  const path = window.location.pathname;

  // Lógica para a PÁGINA DE CLIENTES
  if (path.endsWith('clientes.html')) {
    const addClientForm = document.getElementById('add-client-form');
    
    if (addClientForm) {
      addClientForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Pega os valores do formulário
        const nome = document.getElementById('client-name').value;
        const email = document.getElementById('client-email').value;
        const telefone = document.getElementById('client-phone').value;
        const carteiraId = document.getElementById('client-wallet').value;

        // Pega o usuário logado para o campo 'criadoPor'
        const user = auth.currentUser;
        if (!user) {
          alert("Erro: Você não está logado. Por favor, faça login novamente.");
          return;
        }

        try {
          // Tenta adicionar o documento na coleção 'clientes'
          const docRef = await addDoc(collection(db, "clientes"), {
            nome: nome,
            email: email || null, // Salva null se o campo estiver vazio
            telefone: telefone || null,
            carteiraId: carteiraId || null,
            status: "Ativo", // Status padrão
            dataCriacao: serverTimestamp(), // Pega a data/hora do servidor
            criadoPor: user.uid // ID do usuário que criou
          });

          console.log("Cliente salvo com o ID: ", docRef.id);
          alert("Cliente cadastrado com sucesso!");
          addClientForm.reset(); // Limpa o formulário
          
          // Fecha o modal (requer jQuery, que já está na página)
          $('#add-client-modal').modal('hide');

        } catch (error) {
          console.error("Erro ao salvar cliente: ", error);
          alert("Ocorreu um erro ao salvar o cliente. Tente novamente.");
        }
      });
    }
  }

  // Lógica para o DASHBOARD (Logout)
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      signOut(auth).catch((error) => console.error("Erro ao sair:", error));
    });
  }
}

/**
 * Guarda de Autenticação Global
 */
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  const isOnLoginPage = path.endsWith('/') || path.endsWith('index.html');

  if (user) {
    // USUÁRIO LOGADO
    const userDisplayName = document.getElementById('user-display-name');
    if (userDisplayName) userDisplayName.textContent = user.email;
    
    if (isOnLoginPage) window.location.href = 'dashboard.html';
  } else {
    // USUÁRIO DESLOGADO
    if (!isOnLoginPage) window.location.href = 'index.html';
  }
});

// Inicia a lógica da página
document.addEventListener('DOMContentLoaded', runPageSpecificLogic);
