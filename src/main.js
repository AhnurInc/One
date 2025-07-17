import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function runPageSpecificLogic() {
  const path = window.location.pathname;

  if (path.endsWith('clientes.html')) {
    const addClientForm = document.getElementById('add-client-form');
    if (addClientForm) {
      addClientForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('client-name').value;
        const email = document.getElementById('client-email').value;
        const telefone = document.getElementById('client-phone').value;
        const carteiraId = document.getElementById('client-wallet').value;
        const user = auth.currentUser;
        if (!user) {
          alert("Erro: Você não está logado.");
          return;
        }
        try {
          const docRef = await addDoc(collection(db, "clientes"), {
            nome: nome,
            email: email || null,
            telefone: telefone || null,
            carteiraId: carteiraId || null,
            status: "Ativo",
            dataCriacao: serverTimestamp(),
            criadoPor: user.uid
          });
          console.log("Cliente salvo com o ID: ", docRef.id);
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

  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      signOut(auth).catch((error) => console.error("Erro ao sair:", error));
    });
  }
}

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

document.addEventListener('DOMContentLoaded', runPageSpecificLogic);
