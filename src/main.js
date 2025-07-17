// =================================================================
// ARQUIVO DE SCRIPT CENTRAL - AHNUR INC. (VERSÃO COM MÓDULO DE SERVIÇOS)
// =================================================================

// --- 1. IMPORTAÇÕES ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, onSnapshot, doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// Novas importações para o Storage
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { firebaseConfig } from './firebase-config.js';

// --- 2. INICIALIZAÇÃO DO FIREBASE ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Inicialização do Storage

// --- 3. FUNÇÕES GLOBAIS DE UTILIDADE (sem alterações) ---
function applyPhoneMask(input) { if (!input) return; input.addEventListener('input', (e) => { let value = e.target.value.replace(/\D/g, ''); if (value.length > 11) value = value.slice(0, 11); if (value.length > 6) { value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3'); } else if (value.length > 2) { value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2'); } else { value = value.replace(/^(\d*)/, '($1'); } e.target.value = value.trim(); }); }
function populateDDISelects() { const ddiList = [ {code:"+55", name:"Brasil"}, {code:"+1", name:"EUA/Canadá"}, {code:"+351", name:"Portugal"}, {code:"+44", name:"Reino Unido"}, {code:"+49", name:"Alemanha"}, {code:"+33", name:"França"} ]; const selects = document.querySelectorAll('#client-phone-ddi, #representative-phone-ddi'); selects.forEach(select => { if(!select || select.options.length > 1) return; ddiList.forEach(ddi => { const option = document.createElement('option'); option.value = ddi.code; option.textContent = `${ddi.name} (${ddi.code})`; select.appendChild(option); }); select.value = "+55"; }); }

// --- 4. LÓGICA ESPECÍFICA DE CADA PÁGINA ---
function runPageSpecificLogic() {
  const path = window.location.pathname;
  populateDDISelects(); 

  // LÓGICA DA PÁGINA DE LOGIN (Estável)
  if (path.endsWith('/') || path.endsWith('index.html')) { /* ...código estável omitido para clareza... */ }

  // LÓGICA DA PÁGINA DE CLIENTES (Estável)
  if (path.endsWith('clientes.html')) { /* ...código estável omitido para clareza... */ }

  // LÓGICA DA PÁGINA DE REPRESENTANTES (Estável)
  if (path.endsWith('representantes.html')) { /* ...código estável omitido para clareza... */ }

  // ===============================================================
  // NOVA LÓGICA PARA A PÁGINA DE SERVIÇOS
  // ===============================================================
  if (path.endsWith('servicos.html')) {
    const form = document.getElementById('service-form');
    const modalTitle = document.querySelector('#service-modal .modal-title');
    const checklistContainer = document.getElementById('document-checklist-container');
    const addDocumentButton = document.getElementById('add-document-button');
    const fileInput = document.getElementById('service-template-file');
    const fileInputLabel = document.querySelector('.custom-file-label');
    const currentFileLink = document.getElementById('current-file-link');

    // Função para adicionar uma nova linha de documento na checklist
    const addDocumentRow = (doc = { name: '', required: true }) => {
        const rowId = `doc-row-${Date.now()}`;
        const row = document.createElement('div');
        row.className = 'input-group mb-2';
        row.id = rowId;
        row.innerHTML = `
            <input type="text" class="form-control document-name" placeholder="Nome do documento" value="${doc.name}" required>
            <div class="input-group-append">
                <div class="input-group-text">
                    <input type="checkbox" class="document-required" ${doc.required ? 'checked' : ''}>
                    <label class="mb-0 ml-2">Obrigatório</label>
                </div>
                <button class="btn btn-danger remove-document-btn" type="button" data-row-id="${rowId}">&times;</button>
            </div>
        `;
        checklistContainer.appendChild(row);
        row.querySelector('.remove-document-btn').addEventListener('click', () => row.remove());
    };
    
    addDocumentButton.addEventListener('click', () => addDocumentRow());

    // Limpa e prepara o modal para ADICIONAR
    document.getElementById('add-service-button').addEventListener('click', () => {
        form.reset();
        form.setAttribute('data-mode', 'add');
        form.removeAttribute('data-id');
        modalTitle.textContent = 'Adicionar Novo Serviço';
        checklistContainer.innerHTML = '';
        currentFileLink.innerHTML = '';
        fileInputLabel.textContent = 'Escolher arquivo...';
        addDocumentRow(); // Adiciona uma linha em branco para começar
    });

    // Atualiza o nome do arquivo no label
    fileInput.addEventListener('change', (e) => {
        const fileName = e.target.files[0] ? e.target.files[0].name : 'Escolher arquivo...';
        fileInputLabel.textContent = fileName;
    });

    // Lógica de SUBMISSÃO do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = auth.currentUser; if (!user) { alert("Erro: Você não está logado."); return; }

        const mode = form.getAttribute('data-mode');
        const serviceId = form.getAttribute('data-id');

        // Coleta dados da checklist
        const documents = [];
        checklistContainer.querySelectorAll('.input-group').forEach(row => {
            const nameInput = row.querySelector('.document-name');
            const requiredCheckbox = row.querySelector('.document-required');
            if (nameInput.value) { // Só adiciona se tiver nome
                documents.push({
                    name: nameInput.value,
                    required: requiredCheckbox.checked
                });
            }
        });

        const serviceData = {
            name: document.getElementById('service-name').value,
            value: Number(document.getElementById('service-value').value) || 0,
            documents: documents,
        };

        try {
            // Upload de arquivo
            const file = fileInput.files[0];
            if (file) {
                const filePath = `service_templates/${Date.now()}_${file.name}`;
                const fileRef = ref(storage, filePath);
                await uploadBytes(fileRef, file);
                serviceData.templateFileUrl = await getDownloadURL(fileRef);
                serviceData.templateFilePath = filePath; // Salva o caminho para deleção futura
            }

            if (mode === 'add') {
                serviceData.dataCriacao = serverTimestamp();
                await addDoc(collection(db, "servicos"), serviceData);
                alert("Serviço cadastrado com sucesso!");
            } else {
                // Se não houver novo arquivo, não sobrescreve o campo do arquivo
                if (!file) {
                    const docSnap = await getDoc(doc(db, "servicos", serviceId));
                    serviceData.templateFileUrl = docSnap.data().templateFileUrl || null;
                    serviceData.templateFilePath = docSnap.data().templateFilePath || null;
                }
                await updateDoc(doc(db, "servicos", serviceId), serviceData);
                alert("Serviço atualizado com sucesso!");
            }
            form.reset();
            $('#service-modal').modal('hide');
        } catch (error) {
            console.error("Erro ao salvar serviço: ", error);
            alert("Ocorreu um erro ao salvar o serviço.");
        }
    });

    // Lógica para CARREGAR a tabela
    const tableBody = document.getElementById('services-table-body');
    if (tableBody) {
        onSnapshot(query(collection(db, "servicos")), (snapshot) => {
            tableBody.innerHTML = '';
            if (snapshot.empty) {
                tableBody.innerHTML = `<tr><td colspan="4" class="text-center">Nenhum serviço cadastrado.</td></tr>`;
                return;
            }
            snapshot.forEach(docSnapshot => {
                const service = docSnapshot.data();
                const serviceId = docSnapshot.id;
                const row = document.createElement('tr');
                
                const documentsHtml = service.documents.map(d => 
                    `<span class="badge ${d.required ? 'badge-danger' : 'badge-secondary'} mr-1">${d.name}</span>`
                ).join('');

                row.innerHTML = `
                    <td>${service.name}</td>
                    <td>${service.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td>${documentsHtml || 'Nenhum'}</td>
                    <td>
                        <button class="btn btn-sm btn-info edit-btn" data-id="${serviceId}" data-toggle="modal" data-target="#service-modal">Editar</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${serviceId}">Excluir</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Ativar botões de EXCLUIR
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm("Tem certeza? Esta ação não pode ser desfeita.")) {
                        try {
                            const docSnap = await getDoc(doc(db, "servicos", id));
                            if (docSnap.exists() && docSnap.data().templateFilePath) {
                                await deleteObject(ref(storage, docSnap.data().templateFilePath));
                            }
                            await deleteDoc(doc(db, "servicos", id));
                        } catch (error) {
                            console.error("Erro ao excluir serviço:", error);
                            alert("Ocorreu um erro ao excluir.");
                        }
                    }
                });
            });

            // Ativar botões de EDITAR
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    const docSnap = await getDoc(doc(db, "servicos", id));
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        form.reset();
                        checklistContainer.innerHTML = '';
                        currentFileLink.innerHTML = '';
                        
                        modalTitle.textContent = 'Editar Serviço';
                        form.setAttribute('data-mode', 'edit');
                        form.setAttribute('data-id', id);

                        document.getElementById('service-name').value = data.name;
                        document.getElementById('service-value').value = data.value;

                        data.documents.forEach(docItem => addDocumentRow(docItem));

                        if (data.templateFileUrl) {
                            currentFileLink.innerHTML = `Arquivo atual: <a href="${data.templateFileUrl}" target="_blank">Visualizar/Baixar</a>`;
                        }
                        fileInputLabel.textContent = 'Substituir arquivo (opcional)...';
                    }
                });
            });
        });
    }
  }


  // LÓGICA DE LOGOUT (Estável)
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => { e.preventDefault(); signOut(auth).catch((error) => console.error("Erro ao sair:", error)); });
  }
}

// --- 5. GUARDA DE AUTENTICAÇÃO GLOBAL (CÓDIGO COMPLETO RESTAURADO) ---
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname; const isOnLoginPage = path.endsWith('/') || path.endsWith('index.html');
  if (user) {
    const userDisplayName = document.getElementById('user-display-name'); if (userDisplayName) userDisplayName.textContent = user.email;
    if (isOnLoginPage) window.location.href = 'dashboard.html';
  } else {
    if (!isOnLoginPage) window.location.href = 'index.html';
  }
});

// --- 6. PONTO DE ENTRADA (CÓDIGO COMPLETO RESTAURADO) ---
document.addEventListener('DOMContentLoaded', () => {
    // Para garantir que o código das páginas estáveis não seja omitido, vou colá-lo aqui.
    const path = window.location.pathname;

    // LÓGICA DA PÁGINA DE CLIENTES (COMPLETA)
    if (path.endsWith('clientes.html')) {
        applyPhoneMask(document.getElementById('client-phone-number'));
        const form = document.getElementById('add-client-form');
        const modalTitle = document.querySelector('#add-client-modal .modal-title');
        const representativeSelect = document.getElementById('client-representative');

        const populateRepresentativesDropdown = async (selectedValue = '') => {
            try {
                const snapshot = await getDocs(query(collection(db, "representantes")));
                while (representativeSelect.options.length > 1) { representativeSelect.remove(1); }
                snapshot.forEach((doc) => {
                    const rep = doc.data(); const option = document.createElement('option');
                    option.value = doc.id; option.textContent = rep.nome;
                    representativeSelect.appendChild(option);
                });
                if (selectedValue) { representativeSelect.value = selectedValue; }
            } catch (error) { console.error("Erro ao popular representantes:", error); }
        };
        
        document.getElementById('add-client-button').addEventListener('click', () => {
            form.reset(); form.setAttribute('data-mode', 'add'); form.removeAttribute('data-id');
            modalTitle.textContent = 'Adicionar Novo Cliente';
            document.getElementById('client-phone-ddi').value = "+55";
            populateRepresentativesDropdown();
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
                
                const rowsPromises = snapshot.docs.map(async (docSnapshot) => {
                    const client = docSnapshot.data(); const clientId = docSnapshot.id;
                    const contato = [client.email, client.telefone].filter(Boolean).join(' / ') || 'N/A';
                    const documento = client.tipoDocumento && client.numeroDocumento ? `${client.tipoDocumento}: ${client.numeroDocumento}` : 'N/A';
                    let representativeName = 'N/A';
                    if (client.representativeId) {
                        try { const repDoc = await getDoc(doc(db, "representantes", client.representativeId)); if (repDoc.exists()) { representativeName = repDoc.data().nome; } } catch (e) { console.error("Erro ao buscar representante:", e); }
                    }
                    return `<tr><td>${client.nome}</td><td>${contato}</td><td>${client.nacionalidade}</td><td>${documento}</td><td>${representativeName}</td><td><button class="btn btn-sm btn-info edit-btn" data-id="${clientId}" data-toggle="modal" data-target="#add-client-modal">Editar</button> <button class="btn btn-sm btn-danger delete-btn" data-id="${clientId}">Excluir</button></td></tr>`;
                });
                const rowsHtml = await Promise.all(rowsPromises);
                tableBody.innerHTML = rowsHtml.join('');
                document.querySelectorAll('#clients-table-body .delete-btn').forEach(button => { button.addEventListener('click', async (e) => { const id = e.target.getAttribute('data-id'); if (confirm("Tem certeza que deseja excluir?")) { await deleteDoc(doc(db, "clientes", id)); } }); });
                document.querySelectorAll('#clients-table-body .edit-btn').forEach(button => { button.addEventListener('click', async (e) => { const id = e.target.getAttribute('data-id'); const docSnap = await getDoc(doc(db, "clientes", id)); if (docSnap.exists()) { const data = docSnap.data(); modalTitle.textContent = 'Editar Cliente'; form.setAttribute('data-mode', 'edit'); form.setAttribute('data-id', id); document.getElementById('client-name').value = data.nome || ''; document.getElementById('client-email').value = data.email || ''; const phoneParts = (data.telefone || " +55").split(" "); document.getElementById('client-phone-ddi').value = phoneParts[0] || '+55'; document.getElementById('client-phone-number').value = phoneParts.slice(1).join(' ') || ''; applyPhoneMask(document.getElementById('client-phone-number')); document.getElementById('client-nationality').value = data.nacionalidade || ''; document.getElementById('client-doc-type').value = data.tipoDocumento || ''; document.getElementById('client-doc-number').value = data.numeroDocumento || ''; await populateRepresentativesDropdown(data.representativeId || ''); } }); });
            });
        }
    }

    // LÓGICA DA PÁGINA DE REPRESENTANTES (COMPLETA)
    if (path.endsWith('representantes.html')) {
        applyPhoneMask(document.getElementById('representative-phone-number'));
        const form = document.getElementById('add-representative-form');
        const modalTitle = document.querySelector('#add-representative-modal .modal-title');
        document.getElementById('add-representative-button').addEventListener('click', () => { form.reset(); form.setAttribute('data-mode', 'add'); form.removeAttribute('data-id'); modalTitle.textContent = 'Adicionar Novo Representante'; document.getElementById('representative-phone-ddi').value = "+55"; });
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = auth.currentUser; if (!user) { alert("Erro: Você não está logado."); return; }
            const mode = form.getAttribute('data-mode');
            const phoneNumber = document.getElementById('representative-phone-number').value;
            const phoneDDI = document.getElementById('representative-phone-ddi').value;
            const repData = { nome: document.getElementById('representative-name').value, nacionalidade: document.getElementById('representative-nationality').value, email: document.getElementById('representative-email').value || null, telefone: phoneNumber ? `${phoneDDI} ${phoneNumber}` : null, };
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
                document.querySelectorAll('#representatives-table-body .edit-btn').forEach(button => { button.addEventListener('click', async (e) => { const id = e.target.getAttribute('data-id'); const docSnap = await getDoc(doc(db, "representantes", id)); if (docSnap.exists()) { const data = docSnap.data(); modalTitle.textContent = 'Editar Representante'; form.setAttribute('data-mode', 'edit'); form.setAttribute('data-id', id); document.getElementById('representative-name').value = data.nome || ''; document.getElementById('representative-nationality').value = data.nacionalidade || ''; document.getElementById('representative-email').value = data.email || ''; const phoneParts = (data.telefone || " +55").split(" "); document.getElementById('representative-phone-ddi').value = phoneParts[0] || '+55'; document.getElementById('representative-phone-number').value = phoneParts.slice(1).join(' ') || ''; applyPhoneMask(document.getElementById('representative-phone-number')); } }); });
            });
        }
    }

    // Executa a lógica da página atual.
    runPageSpecificLogic();
});
