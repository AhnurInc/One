// =================================================================
// ARQUIVO DE SCRIPT CENTRAL - AHNUR INC. (VERSÃO PÓS-AUDITORIA)
// =================================================================

// --- 1. IMPORTAÇÕES ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, onSnapshot, doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

// --- 2. INICIALIZAÇÃO DO FIREBASE ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- 3. FUNÇÕES GLOBAIS DE UTILIDADE ---
function applyPhoneMask(input) {
  if (!input) return;
  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else {
      value = value.replace(/^(\d*)/, '($1');
    }
    e.target.value = value.trim();
  });
}

function populateDDISelects() {
    const ddiList = [ {code:"+55", name:"Brasil"}, {code:"+1", name:"EUA/Canadá"}, {code:"+351", name:"Portugal"}, {code:"+44", name:"Reino Unido"}, {code:"+49", name:"Alemanha"}, {code:"+33", name:"França"} ];
    const selects = document.querySelectorAll('#client-phone-ddi, #representative-phone-ddi');
    selects.forEach(select => {
        if(!select || select.options.length > 1) return;
        ddiList.forEach(ddi => {
            const option = document.createElement('option');
            option.value = ddi.code;
            option.textContent = `${ddi.name} (${ddi.code})`;
            select.appendChild(option);
        });
        select.value = "+55";
    });
}

// --- 4. LÓGICA ESPECÍFICA DE CADA PÁGINA ---
function runPageSpecificLogic() {
  const path = window.location.pathname;
  populateDDISelects(); 

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

  // LÓGICA DA PÁGINA DE CLIENTES (COM CORREÇÃO NO CARREGAMENTO)
  if (path.endsWith('clientes.html')) {
    applyPhoneMask(document.getElementById('client-phone-number'));
    const form = document.getElementById('add-client-form');
    const modalTitle = document.querySelector('#add-client-modal .modal-title');
    
    document.getElementById('add-client-button').addEventListener('click', () => {
        form.reset(); form.setAttribute('data-mode', 'add'); form.removeAttribute('data-id');
        modalTitle.textContent = 'Adicionar Novo Cliente';
        document.getElementById('client-phone-ddi').value = "+55";
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = auth.currentUser; if (!user) { alert("Erro: Você não está logado."); return; }
      const mode = form.getAttribute('data-mode'); const currentId = form.getAttribute('data-id');
      const numeroDocumento = document.getElementById('client-doc-number').value; const tipoDocumento = document.getElementById('client-doc-type').value;
      const q = query(collection(db, "clientes"), where("tipoDocumento", "==", tipoDocumento), where("numeroDocumento", "==", numeroDocumento));
      const querySnapshot = await getDocs(q); let isDuplicate = false;
      querySnapshot.forEach((doc) => { if (mode === 'add' || doc.id !== currentId) { isDuplicate = true; } });
      if (isDuplicate) { alert("Erro: A combinação de tipo e número de documento informada já está cadastrada."); return; }
      
      const phoneNumber = document.getElementById('client-phone-number').value;
      const phoneDDI = document.getElementById('client-phone-ddi').value;
      const clientData = {
        nome: document.getElementById('client-name').value, email: document.getElementById('client-email').value || null,
        telefone: phoneNumber ? `${phoneDDI} ${phoneNumber}` : null,
        nacionalidade: document.getElementById('client-nationality').value, tipoDocumento: tipoDocumento, 
        numeroDocumento: numeroDocumento, representativeId: document.getElementById('client-representative').value || null,
      };
      try {
        if (mode === 'add') {
          clientData.dataCriacao = serverTimestamp(); clientData.criadoPor = user.uid;
          await addDoc(collection(db, "clientes"), clientData); alert("Cliente cadastrado com sucesso!");
        } else {
          await updateDoc(doc(db, "clientes", currentId), clientData); alert("Cliente atualizado com sucesso!");
        }
        form.reset(); $('#add-client-modal').modal('hide');
      } catch (error) { console.error("Erro ao salvar cliente: ", error); alert("Ocorreu um erro ao salvar o cliente."); }
    });
    
    const tableBody = document.getElementById('clients-table-body');
    if (tableBody) {
      onSnapshot(query(collection(db, "clientes")), async (snapshot) => {
        tableBody.innerHTML = ''; 
        if (snapshot.empty) { tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Nenhum cliente cadastrado.</td></tr>`; return; }
        
        // CORREÇÃO: Usar Promise.all para aguardar todas as buscas de representantes
        const rowsPromises = snapshot.docs.map(async (docSnapshot) => {
          const client = docSnapshot.data();
          const clientId = docSnapshot.id;
          const contato = [client.email, client.telefone].filter(Boolean).join(' / ') || 'N/A';
          const documento = client.tipoDocumento && client.numeroDocumento ? `${client.tipoDocumento}: ${client.numeroDocumento}` : 'N/A';
          let representativeName = 'N/A';
          if (client.representativeId) {
            try {
              const repDoc = await getDoc(doc(db, "representantes", client.representativeId));
              if (repDoc.exists()) { representativeName = repDoc.data().nome; }
            } catch (e) { console.error("Erro ao buscar representante:", e); }
          }
          return `<tr>
            <td>${client.nome}</td>
            <td>${contato}</td>
            <td>${client.nacionalidade}</td>
            <td>${documento}</td>
            <td>${representativeName}</td>
            <td>
              <button class="btn btn-sm btn-info edit-btn" data-id="${clientId}" data-toggle="modal" data-target="#add-client-modal">Editar</button>
              <button class="btn btn-sm btn-danger delete-btn" data-id="${clientId}">Excluir</button>
            </td>
          </tr>`;
        });

        const rowsHtml = await Promise.all(rowsPromises);
        tableBody.innerHTML = rowsHtml.join('');

        // Reanexar eventos após a renderização
        document.querySelectorAll('#clients-table-body .delete-btn').forEach(button => { button.addEventListener('click', async (e) => { const id = e.target.getAttribute('data-id'); if (confirm("Tem certeza que deseja excluir?")) { await deleteDoc(doc(db, "clientes", id)); } }); });
        document.querySelectorAll('#clients-table-body .edit-btn').forEach(button => { button.addEventListener('click', async (e) => { const id = e.target.getAttribute('data-id'); const docSnap = await getDoc(doc(db, "clientes", id)); if (docSnap.exists()) { const data = docSnap.data(); document.getElementById('client-name').value = data.nome || ''; document.getElementById('client-email').value = data.email || ''; const phoneParts = (data.telefone || " +55").split(" "); document.getElementById('client-phone-ddi').value = phoneParts[0] || '+55'; document.getElementById('client-phone-number').value = phoneParts.slice(1).join(' ') || ''; applyPhoneMask(document.getElementById('client-phone-number')); document.getElementById('client-nationality').value = data.nacionalidade || ''; document.getElementById('client-doc-type').value = data.tipoDocumento || ''; document.getElementById('client-doc-number').value = data.numeroDocumento || ''; document.getElementById('client-representative').value = data.representativeId || ''; form.setAttribute('data-mode', 'edit'); form.setAttribute('data-id', id); modalTitle.textContent = 'Editar Cliente'; } }); });
      });
    }
  }

  // LÓGICA DA PÁGINA DE REPRESENTANTES (COM CORREÇÃO NA EDIÇÃO)
  if (path.endsWith('representantes.html')) {
    applyPhoneMask(document.getElementById('representative-phone-number'));
    const form = document.getElementById('add-representative-form');
    const modalTitle = document.querySelector('#add-representative-modal .modal-title');
    
    document.getElementById('add-representative-button').addEventListener('click', () => {
        form.reset(); form.setAttribute('data-mode', 'add'); form.removeAttribute('data-id');
        modalTitle.textContent = 'Adicionar Novo Representante';
        document.getElementById('representative-phone-ddi').value = "+55";
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = auth.currentUser; if (!user) { alert("Erro: Você não está logado."); return; }
      const mode = form.getAttribute('data-mode');
      const phoneNumber = document.getElementById('representative-phone-number').value;
      const phoneDDI = document.getElementById('representative-phone-ddi').value;
      const repData = {
        nome: document.getElementById('representative-name').value,
        nacionalidade: document.getElementById('representative-nationality').value,
        email: document.getElementById('representative-email').value || null,
        telefone: phoneNumber ? `${phoneDDI} ${phoneNumber}` : null,
      };
      try {
        if (mode === 'add') {
          repData.dataCriacao = serverTimestamp(); repData.criadoPor = user.uid;
          await addDoc(collection(db, "representantes"), repData); alert("Representante cadastrado com sucesso!");
        } else {
          const repId = form.getAttribute('data-id'); await updateDoc(doc(db, "representantes", repId), repData); alert("Representante atualizado com sucesso!");
        }
        form.reset(); $('#add-representative-modal').modal('hide');
      } catch (error) { console.error("Erro ao salvar representante: ", error); alert("Ocorreu um erro ao salvar o representante."); }
    });

    const tableBody = document.getElementById('representatives-table-body');
    if (tableBody) {
      onSnapshot(query(collection(db, "representantes")), (snapshot) => {
        tableBody.innerHTML = ''; if (snapshot.empty) { tableBody.innerHTML = `<tr><td colspan="4" class="text-center">Nenhum representante cadastrado.</td></tr>`; return; }
        snapshot.forEach(docSnapshot => {
          const rep = docSnapshot.data(); const repId = docSnapshot.id; const row = document.createElement('tr');
          const contato = [rep.email, rep.telefone].filter(Boolean).join(' / ') || 'N/A';
          row.innerHTML = `<td>${rep.nome}</td><td>${rep.nacionalidade}</td><td>${contato}</td><td><button class="btn btn-sm btn-info edit-btn" data-id="${repId}" data-toggle="modal" data-target="#add-representative-modal">Editar</button> <button class="btn btn-sm btn-danger delete-btn" data-id="${repId}">Excluir</button></td>`;
          tableBody.appendChild(row);
        });
        document.querySelectorAll('#representatives-table-body .delete-btn').forEach(button => { button.addEventListener('click', async (e) => { const id = e.target.getAttribute('data-id'); if (confirm("Tem certeza que deseja excluir?")) { await deleteDoc(doc(db, "representantes", id)); } }); });
        
        // CORREÇÃO: Lógica para preencher o formulário de edição foi restaurada
        document.querySelectorAll('#representatives-table-body .edit-btn').forEach(button => { 
          button.addEventListener('click', async (e) => { 
            const id = e.target.getAttribute('data-id'); 
            const docSnap = await getDoc(doc(db, "representantes", id)); 
            if (docSnap.exists()) { 
              const data = docSnap.data(); 
              document.getElementById('representative-name').value = data.nome || ''; 
              document.getElementById('representative-nationality').value = data.nacionalidade || ''; 
              document.getElementById('representative-email').value = data.email || ''; 
              const phoneParts = (data.telefone || " +55").split(" ");
              document.getElementById('representative-phone-ddi').value = phoneParts[0] || '+55';
              document.getElementById('representative-phone-number').value = phoneParts.slice(1).join(' ') || '';
              applyPhoneMask(document.getElementById('representative-phone-number'));
              form.setAttribute('data-mode', 'edit'); 
              form.setAttribute('data-id', id); 
              modalTitle.textContent = 'Editar Representante'; 
            } 
          }); 
        });
      });
    }
  }

  // LÓGICA DE LOGOUT
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => { e.preventDefault(); signOut(auth).catch((error) => console.error("Erro ao sair:", error)); });
  }
}

// --- 5. GUARDA DE AUTENTICAÇÃO GLOBAL ---
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname; const isOnLoginPage = path.endsWith('/') || path.endsWith('index.html');
  if (user) {
    const userDisplayName = document.getElementById('user-display-name'); if (userDisplayName) userDisplayName.textContent = user.email;
    if (isOnLoginPage) window.location.href = 'dashboard.html';
  } else {
    if (!isOnLoginPage) window.location.href = 'index.html';
  }
});

// --- 6. PONTO DE ENTRADA ---
document.addEventListener('DOMContentLoaded', runPageSpecificLogic);
