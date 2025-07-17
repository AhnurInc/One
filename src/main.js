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
  where,           // <-- Novo: Para criar a consulta de verificação
  getDocs,         // <-- Novo: Para executar a consulta de verificação
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
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

  // LÓGICA DA PÁGINA DE LOGIN (sem alterações)
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
    const addClientForm = document.getElementById('add-client-form');
    const modalTitle = document.querySelector('#add-client-modal .modal-title');
    const modalSubmitButton = document.querySelector('#add-client-modal .btn-primary');
    
    document.getElementById('add-client-button').addEventListener('click', () => {
        addClientForm.reset();
        addClientForm.setAttribute('data-mode', 'add');
        addClientForm.removeAttribute('data-id');
        modalTitle.textContent = 'Adicionar Novo Cliente';
        modalSubmitButton.textContent = 'Salvar Cliente';
    });

    addClientForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = auth.currentUser;
      if (!user) { alert("Erro: Você não está logado."); return; }
      
      const mode = addClientForm.getAttribute('data-mode');
      const currentId = addClientForm.getAttribute('data-id');
      const numeroDocumento = document.getElementById('client-doc-number').value;

      // ===============================================================
      // A MUDANÇA ESTÁ AQUI: Verificação de documento duplicado
      // ===============================================================
      const q = query(collection(db, "clientes"), where("numeroDocumento", "==", numeroDocumento));
      const querySnapshot = await getDocs(q);
      
      let isDuplicate = false;
      querySnapshot.forEach((doc) => {
        if (mode === 'add' || doc.id !== currentId) {
          isDuplicate = true;
        }
      });

      if (isDuplicate) {
        alert("Erro: O número do documento informado já está cadastrado em nosso sistema.");
        return; // Interrompe a execução
      }

      const clientData = {
        nome: document.getElementById('client-name').value,
        email: document.getElementById('client-email').value || null,
        telefone: document.getElementById('client-phone').value || null,
        nacionalidade: document.getElementById('client-nationality').value, // Agora é obrigatório
        tipoDocumento: document.getElementById('client-doc-type').value, // Agora é obrigatório
        numeroDocumento: numeroDocumento, // Agora é obrigatório
        carteiraId: document.getElementById('client-wallet').value || null,
        status: "Ativo",
      };

      try {
        if (mode === 'add') {
          clientData.dataCriacao = serverTimestamp();
          clientData.criadoPor = user.uid;
          await addDoc(collection(db, "clientes"), clientData);
          alert("Cliente cadastrado com sucesso!");
        } else {
          const clientRef = doc(db, "clientes", currentId);
          await updateDoc(clientRef, clientData);
          alert("Cliente atualizado com sucesso!");
        }
        addClientForm.reset();
        $('#add-client-modal').modal('hide');
      } catch (error) {
        console.error("Erro ao salvar cliente: ", error);
        alert("Ocorreu um erro ao salvar o cliente.");
      }
    });

    // Lógica para carregar a tabela (sem alterações)
    const clientsTableBody = document.getElementById('clients-table-body');
    if (clientsTableBody) {
      const q = query(collection(db, "clientes"));
      onSnapshot(q, (snapshot) => {
        clientsTableBody.innerHTML = ''; 
        if (snapshot.empty) {
          clientsTableBody.innerHTML = `<tr><td colspan="6" class="text-center">Nenhum cliente cadastrado.</td></tr>`;
          return;
        }
        snapshot.forEach(docSnapshot => {
          const client = docSnapshot.data();
          const clientId = docSnapshot.id;
          const row = document.createElement('tr');
          const documento = client.tipoDocumento && client.numeroDocumento ? `${client.tipoDocumento}: ${client.numeroDocumento}` : 'N/A';
          row.innerHTML = `<td>${client.nome}</td><td>${client.email || 'N/A'}</td><td>${client.nacionalidade || 'N/A'}</td><td>${documento}</td><td><span class="badge badge-success">${client.status}</span></td><td><button class="btn btn-sm btn-info edit-btn" data-id="${clientId}" data-toggle="modal" data-target="#add-client-modal">Editar</button> <button class="btn btn-sm btn-danger delete-btn" data-id="${clientId}">Excluir</button></td>`;
          clientsTableBody.appendChild(row);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
          button.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            if (confirm("Tem certeza que deseja excluir este cliente? Esta ação é irreversível.")) {
              await deleteDoc(doc(db, "clientes", id));
            }
          });
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
          button.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            const docSnap = await getDoc(doc(db, "clientes", id));
            if (docSnap.exists()) {
              const data = docSnap.data();
              document.getElementById('client-name').value = data.nome || '';
              document.getElementById('client-email').value = data.email || '';
              document.getElementById('client-phone').value = data.telefone || '';
              document.getElementById('client-nationality').value = data.nacionalidade || '';
              document.getElementById('client-doc-type').value = data.tipoDocumento || '';
              document.getElementById('client-doc-number').value = data.numeroDocumento || '';
              document.getElementById('client-wallet').value = data.carteiraId || '';
              addClientForm.setAttribute('data-mode', 'edit');
              addClientForm.setAttribute('data-id', id);
              modalTitle.textContent = 'Editar Cliente';
              modalSubmitButton.textContent = 'Salvar Alterações';
            }
          });
        });
      });
    }
  }

  // LÓGICA DE LOGOUT (sem alterações)
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      signOut(auth).catch((error) => console.error("Erro ao sair:", error));
    });
  }
}

// --- 4. GUARDA DE AUTENTICAÇÃO GLOBAL (sem alterações) ---
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

// --- 5. PONTO DE ENTRADA (sem alterações) ---
document.addEventListener('DOMContentLoaded', runPageSpecificLogic);
