// =================================================================
// ARQUIVO DE SCRIPT CENTRAL - AHNUR INC.
// =================================================================

// --- 1. IMPORTAÇÕES ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc,
  query,
  onSnapshot, // <-- A MÁGICA EM TEMPO REAL COMEÇA AQUI
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Importa nossa configuração de projeto
import { firebaseConfig } from './firebase-config.js';

// --- 2. INICIALIZAÇÃO DO FIREBASE ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- 3. LÓGICA ESPECÍFICA DE CADA PÁGINA ---
function runPageSpecificLogic() {
  const path = window.location.pathname;

  // LÓGICA DA PÁGINA DE LOGIN
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

  // LÓGICA DA PÁGINA DE CLIENTES
  if (path.endsWith('clientes.html')) {
    // Função para salvar um novo cliente
    const addClientForm = document.getElementById('add-client-form');
    if (addClientForm) {
      addClientForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) { alert("Erro: Você não está logado."); return; }
        try {
          await addDoc(collection(db, "clientes"), {
            nome: document.getElementById('client-name').value,
            email: document.getElementById('client-email').value || null,
            telefone: document.getElementById('client-phone').value || null,
            nacionalidade: document.getElementById('client-nationality').value || null,
            tipoDocumento: document.getElementById('client-doc-type').value || null,
            numeroDocumento: document.getElementById('client-doc-number').value || null,
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

    // ===============================================================
    // A MUDANÇA ESTÁ AQUI: Função para carregar clientes na tabela
    // ===============================================================
    const clientsTableBody = document.getElementById('clients-table-body');
    if (clientsTableBody) {
      const q = query(collection(db, "clientes"));
      
      onSnapshot(q, (snapshot) => {
        // Limpa a tabela antes de adicionar os novos dados
        clientsTableBody.innerHTML = ''; 

        if (snapshot.empty) {
          clientsTableBody.innerHTML = `<tr><td colspan="6" class="text-center">Nenhum cliente cadastrado.</td></tr>`;
          return;
        }

        snapshot.forEach(doc => {
          const client = doc.data();
          const clientId = doc.id; // Pega o ID do documento

          // Cria a linha da tabela
          const row = document.createElement('tr');
          
          // Formata o documento para exibição
          const documento = client.tipoDocumento && client.numeroDocumento 
            ? `${client.tipoDocumento}: ${client.numeroDocumento}`
            : 'N/A';

          row.innerHTML = `
            <td>${client.nome}</td>
            <td>${client.email || 'N/A'}</td>
            <td>${client.nacionalidade || 'N/A'}</td>
            <td>${documento}</td>
            <td><span class="badge badge-success">${client.status}</span></td>
            <td>
              <button class="btn btn-sm btn-info" data-id="${clientId}">Editar</button>
              <button class="btn btn-sm btn-danger" data-id="${clientId}">Excluir</button>
            </td>
          `;

          clientsTableBody.appendChild(row);
        });
      });
    }
  }

  // LÓGICA DE LOGOUT
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      signOut(auth).catch((error) => console.error("Erro ao sair:", error));
    });
  }
}

// --- 4. GUARDA DE AUTENTICAÇÃO GLOBAL ---
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  const isOnLoginPage = path.endsWith('/') || path.endsWith('index.html');
  if (user) {
    const userDisplayName = document.getElementById('user-display-name');
    if (userDisplayName) userDisplayName.textContent = user.email;
    if (isOnLoginPage) window.location.href = 'dashboard.html';
  } else {
    if (!isOnLoginPage) window.location.href = 'index.html';
  }
});

// --- 5. PONTO DE ENTRADA ---
document.addEventListener('DOMContentLoaded', runPageSpecificLogic);
