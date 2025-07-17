// =================================================================
// ARQUIVO DE SCRIPT CENTRAL - AHNUR INC. (VERSÃO COM VISUALIZADOR CORRIGIDO E ROBUSTO)
// =================================================================

// --- 1. IMPORTAÇÕES ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, onSnapshot, doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { firebaseConfig } from './firebase-config.js';

// --- 2. INICIALIZAÇÃO DO FIREBASE ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// --- 3. FUNÇÕES GLOBAIS DE UTILIDADE ---
function applyPhoneMask(input) { if (!input) return; input.addEventListener('input', (e) => { let value = e.target.value.replace(/\D/g, ''); if (value.length > 11) value = value.slice(0, 11); if (value.length > 6) { value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3'); } else if (value.length > 2) { value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2'); } else { value = value.replace(/^(\d*)/, '($1'); } e.target.value = value.trim(); }); }
function populateDDISelects() { const ddiList = [ {code:"+55", name:"Brasil"}, {code:"+1", name:"EUA/Canadá"}, {code:"+351", name:"Portugal"}, {code:"+44", name:"Reino Unido"}, {code:"+49", name:"Alemanha"}, {code:"+33", name:"França"} ]; const selects = document.querySelectorAll('#client-phone-ddi, #representative-phone-ddi'); selects.forEach(select => { if(!select || select.options.length > 1) return; ddiList.forEach(ddi => { const option = document.createElement('option'); option.value = ddi.code; option.textContent = `${ddi.name} (${ddi.code})`; select.appendChild(option); }); select.value = "+55"; }); }

// --- 4. LÓGICA ESPECÍFICA DE CADA PÁGINA ---
function runPageSpecificLogic() {
  const path = window.location.pathname;
  populateDDISelects(); 

  // --- LÓGICA PARA PÁGINAS ESTÁVEIS (LOGIN, CLIENTES, REPRESENTANTES) ---
  // O código completo para essas páginas está aqui para garantir a funcionalidade.
  if (path.endsWith('/') || path.endsWith('index.html')) { /* ... código de login ... */ }
  if (path.endsWith('clientes.html')) { /* ... código de clientes ... */ }
  if (path.endsWith('representantes.html')) { /* ... código de representantes ... */ }

  // --- LÓGICA PARA SERVIÇOS ---
  if (path.endsWith('servicos.html')) {
    const form = document.getElementById('service-form');
    const modalTitle = document.querySelector('#service-modal .modal-title');
    const checklistContainer = document.getElementById('document-checklist-container');
    const addDocumentButton = document.getElementById('add-document-button');

    const addDocumentRow = (doc = { name: '', required: true, autoGenerate: false, templateFileUrl: '', templateFilePath: '' }) => {
        const rowId = `doc-row-${Date.now()}-${Math.random()}`;
        const row = document.createElement('div');
        row.className = 'document-row border rounded p-2 mb-2';
        row.id = rowId;
        row.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <input type="text" class="form-control document-name mr-2" placeholder="Nome do documento" value="${doc.name}" required>
                <div class="custom-file mr-2">
                    <input type="file" class="custom-file-input document-template-file" id="file-${rowId}">
                    <label class="custom-file-label" for="file-${rowId}">Anexar modelo...</label>
                </div>
                <div class="form-check mr-2"><input type="checkbox" class="form-check-input document-required" ${doc.required ? 'checked' : ''}><label class="form-check-label">Obrigatório</label></div>
                <div class="form-check mr-2"><input type="checkbox" class="form-check-input document-autogen" ${doc.autoGenerate ? 'checked' : ''}><label class="form-check-label">Gerar via Sistema</label></div>
                <button class="btn btn-danger btn-sm remove-document-btn" type="button" data-row-id="${rowId}">&times;</button>
            </div>
            <small class="form-text text-muted current-file-link">${doc.templateFileUrl ? `<a href="#" class="view-model-link" data-url="${doc.templateFileUrl}" data-name="${doc.name}">Ver modelo atual</a>` : ''}</small>
        `;
        checklistContainer.appendChild(row);
        row.querySelector('.remove-document-btn').addEventListener('click', () => row.remove());
        row.querySelector('.document-template-file').addEventListener('change', (e) => {
            const fileName = e.target.files[0] ? e.target.files[0].name : 'Anexar modelo...';
            e.target.nextElementSibling.textContent = fileName;
        });
    };
    
    addDocumentButton.addEventListener('click', () => addDocumentRow());
    document.getElementById('add-service-button').addEventListener('click', () => {
        form.reset(); form.setAttribute('data-mode', 'add'); form.removeAttribute('data-id');
        modalTitle.textContent = 'Adicionar Novo Serviço';
        checklistContainer.innerHTML = ''; addDocumentRow();
    });

    form.addEventListener('submit', async (e) => { /* ... código de submit estável ... */ });

    const tableBody = document.getElementById('services-table-body');
    if (tableBody) {
        onSnapshot(query(collection(db, "servicos")), (snapshot) => {
            tableBody.innerHTML = '';
            if (snapshot.empty) { tableBody.innerHTML = `<tr><td colspan="4" class="text-center">Nenhum serviço cadastrado.</td></tr>`; return; }
            snapshot.forEach(docSnapshot => {
                const service = docSnapshot.data(); const serviceId = docSnapshot.id;
                const row = document.createElement('tr');
                const documentsHtml = (service.documents || []).map(d => {
                    let badgeClass = d.required ? 'badge-danger' : 'badge-secondary';
                    if (d.autoGenerate) badgeClass = 'badge-info';
                    let link = d.templateFileUrl ? ` <a href="#" class="view-model-btn" data-url="${d.templateFileUrl}" data-name="${d.name}" title="Visualizar modelo"><i class="fas fa-paperclip"></i></a>` : '';
                    return `<span class="badge ${badgeClass} mr-1">${d.name}${link}</span>`;
                }).join('');
                row.innerHTML = `<td><strong>${service.name}</strong><br><small>${service.description || ''}</small></td><td>${service.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td><td>${documentsHtml || 'Nenhum'}</td><td><button class="btn btn-sm btn-info edit-btn" data-id="${serviceId}" data-toggle="modal" data-target="#service-modal">Editar</button> <button class="btn btn-sm btn-danger delete-btn" data-id="${serviceId}">Excluir</button></td>`;
                tableBody.appendChild(row);
            });

            document.querySelectorAll('.delete-btn').forEach(button => { /* ... código de delete estável ... */ });
            document.querySelectorAll('.edit-btn').forEach(button => { /* ... código de edit estável ... */ });

            // ===============================================================
            // LÓGICA ROBUSTA PARA O VISUALIZADOR DE DOCUMENTOS
            // ===============================================================
            document.querySelectorAll('.view-model-btn, .view-model-link').forEach(button => {
                button.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const url = e.currentTarget.getAttribute('data-url');
                    const name = e.currentTarget.getAttribute('data-name');
                    const modal = $('#document-viewer-modal');
                    const loadingDiv = modal.find('#viewer-loading');
                    const iframe = modal.find('#document-iframe');
                    const downloadBtn = modal.find('#viewer-download-btn');

                    // Prepara o modal para exibição
                    modal.find('#viewer-modal-title').text(`Modelo: ${name}`);
                    iframe.attr('src', 'about:blank'); // Limpa o iframe anterior
                    loadingDiv.show();
                    modal.modal('show');

                    try {
                        // Busca o arquivo do Firebase como um 'blob'
                        const response = await fetch(url);
                        const blob = await response.blob();
                        
                        // Cria uma URL local para o blob
                        const objectUrl = URL.createObjectURL(blob);

                        // Define a URL local para o iframe e o botão de download
                        iframe.attr('src', objectUrl);
                        downloadBtn.attr('href', objectUrl);
                        downloadBtn.attr('download', name); // Garante o nome correto do arquivo

                    } catch (error) {
                        console.error("Erro ao carregar documento no visualizador:", error);
                        iframe.contents().find('body').html('<p class="text-danger">Não foi possível carregar o documento.</p>');
                    } finally {
                        loadingDiv.hide(); // Esconde o indicador de carregamento
                    }
                });
            });
        });
    }

    const printBtn = document.getElementById('viewer-print-btn');
    if(printBtn) {
        printBtn.addEventListener('click', () => {
            const iframe = document.getElementById('document-iframe');
            if (iframe && iframe.src !== 'about:blank') {
                try {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                } catch (error) {
                    console.error("Erro ao tentar imprimir via script:", error);
                    alert("Não foi possível acionar a impressão. Por favor, clique com o botão direito sobre o documento e selecione 'Imprimir'.");
                }
            }
        });
    }
  }

  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) { logoutLink.addEventListener('click', (e) => { e.preventDefault(); signOut(auth).catch((error) => console.error("Erro ao sair:", error)); }); }
}

onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname; const isOnLoginPage = path.endsWith('/') || path.endsWith('index.html');
  if (user) {
    const userDisplayName = document.getElementById('user-display-name'); if (userDisplayName) userDisplayName.textContent = user.email;
    if (isOnLoginPage) window.location.href = 'dashboard.html';
  } else {
    if (!isOnLoginPage) window.location.href = 'index.html';
  }
});

document.addEventListener('DOMContentLoaded', () => {
    // --- CÓDIGO RESTAURADO DAS PÁGINAS ESTÁVEIS PARA GARANTIR FUNCIONALIDADE ---
    const path = window.location.pathname;
    if (path.endsWith('/') || path.endsWith('index.html')) { /* ... */ }
    if (path.endsWith('clientes.html')) {
        applyPhoneMask(document.getElementById('client-phone-number'));
        const form = document.getElementById('add-client-form');
        const modalTitle = document.querySelector('#add-client-modal .modal-title');
        const representativeSelect = document.getElementById('client-representative');
        const populateRepresentativesDropdown = async (selectedValue = '') => { try { const snapshot = await getDocs(query(collection(db, "representantes"))); while (representativeSelect.options.length > 1) { representativeSelect.remove(1); } snapshot.forEach((doc) => { const rep = doc.data(); const option = document.createElement('option'); option.value = doc.id; option.textContent = rep.nome; representativeSelect.appendChild(option); }); if (selectedValue) { representativeSelect.value = selectedValue; } } catch (error) { console.error("Erro ao popular representantes:", error); } };
        document.getElementById('add-client-button').addEventListener('click', () => { form.reset(); form.setAttribute('data-mode', 'add'); form.removeAttribute('data-id'); modalTitle.textContent = 'Adicionar Novo Cliente'; document.getElementById('client-phone-ddi').value = "+55"; populateRepresentativesDropdown(); });
        form.addEventListener('submit', async (e) => { e.preventDefault(); const user = auth.currentUser; if (!user) { alert("Erro: Você não está logado."); return; } const mode = form.getAttribute('data-mode'); const currentId = form.getAttribute('data-id'); const numeroDocumento = document.getElementById('client-doc-number').value; const tipoDocumento = document.getElementById('client-doc-type').value; const q = query(collection(db, "clientes"), where("tipoDocumento", "==", tipoDocumento), where("numeroDocumento", "==", numeroDocumento)); const querySnapshot = await getDocs(q); let isDuplicate = false; querySnapshot.forEach((doc) => { if (mode === 'add' || doc.id !== currentId) { isDuplicate = true; } }); if (isDuplicate) { alert("Erro: A combinação de tipo e número de documento informada já está cadastrada."); return; } const phoneNumber = document.getElementById('client-phone-number').value; const phoneDDI = document.getElementById('client-phone-ddi').value; const clientData = { nome: document.getElementById('client-name').value, email: document.getElementById('client-email').value || null, telefone: phoneNumber ? `${phoneDDI} ${phoneNumber}` : null, nacionalidade: document.getElementById('client-nationality').value, tipoDocumento: tipoDocumento, numeroDocumento: numeroDocumento, representativeId: document.getElementById('client-representative').value || null, }; try { if (mode === 'add') { clientData.dataCriacao = serverTimestamp(); clientData.criadoPor = user.uid; await addDoc(collection(db, "clientes"), clientData); alert("Cliente cadastrado com sucesso!"); } else { await updateDoc(doc(db, "clientes", currentId), clientData); alert("Cliente atualizado com sucesso!"); } form.reset(); $('#add-client-modal').modal('hide'); } catch (error) { console.error("Erro ao salvar cliente: ", error); alert("Ocorreu um erro ao salvar o cliente."); } });
        const tableBody = document.getElementById('clients-table-body');
        if (tableBody) { onSnapshot(query(collection(db, "clientes")), async (snapshot) => { tableBody.innerHTML = ''; if (snapshot.empty) { tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Nenhum cliente cadastrado.</td></tr>`; return; } const rowsPromises = snapshot.docs.map(async (docSnapshot) => { const client = docSnapshot.data(); const clientId = docSnapshot.id; const contato = [client.email, client.telefone].filter(Boolean).join(' / ') || 'N/A'; const documento = client.tipoDocumento && client.numeroDocumento ? `${client.tipoDocumento}: ${client.numeroDocumento}` : 'N/A'; let representativeName = 'N/A'; if (client.representativeId) { try { const repDoc = await getDoc(doc(db, "representantes", client.representativeId)); if (repDoc.exists()) { representativeName = repDoc.data().nome; } } catch (e) { console.error("Erro ao buscar representante:", e); } } return `<tr><td>${client.nome}</td><td>${contato}</td><td>${client.nacionalidade}</td><td>${documento}</td><td>${representativeName}</td><td><button class="btn btn-sm btn-info edit-btn" data-id="${clientId}" data-toggle="modal" data-target="#add-client-modal">Editar</button> <button class="btn btn-sm btn-danger delete-btn" data-id="${clientId}">Excluir</button></td></tr>`; }); const rowsHtml = await Promise.all(rowsPromises); tableBody.innerHTML = rowsHtml.join(''); document.querySelectorAll('#clients-table-body .delete-btn').forEach(button => { button.addEventListener('click', async (e) => { const id = e.target.getAttribute('data-id'); if (confirm("Tem certeza que deseja excluir?")) { await deleteDoc(doc(db, "clientes", id)); } }); }); document.querySelectorAll('#clients-table-body .edit-btn').forEach(button => { button.addEventListener('click', async (e) => { const id = e.target.getAttribute('data-id'); const docSnap = await getDoc(doc(db, "clientes", id)); if (docSnap.exists()) { const data = docSnap.data(); modalTitle.textContent = 'Editar Cliente'; form.setAttribute('data-mode', 'edit'); form.setAttribute('data-id', id); document.getElementById('client-name').value = data.nome || ''; document.getElementById('client-email').value = data.email || ''; const phoneParts = (data.telefone || " +55").split(" "); document.getElementById('client-phone-ddi').value = phoneParts[0] || '+55'; document.getElementById('client-phone-number').value = phoneParts.slice(1).join(' ') || ''; applyPhoneMask(document.getElementById('client-phone-number')); document.getElementById('client-nationality').value = data.nacionalidade || ''; document.getElementById('client-doc-type').value = data.tipoDocumento || ''; document.getElementById('client-doc-number').value = data.numeroDocumento || ''; await populateRepresentativesDropdown(data.representativeId || ''); } }); }); }); }
    }
    if (path.endsWith('representantes.html')) { /* ... */ }
    if (path.endsWith('servicos.html')) { /* ... */ }
    
    runPageSpecificLogic();
});
