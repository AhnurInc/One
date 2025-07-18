// =================================================================
// ARQUIVO DE SCRIPT CENTRAL - AHNUR INC. (FASE 3 - LÓGICA INICIAL DA O.S.)
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
const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// --- 4. LÓGICA ESPECÍFICA DE CADA PÁGINA ---
function runPageSpecificLogic() {
  const path = window.location.pathname;
  populateDDISelects(); 

  // --- LÓGICA PARA PÁGINAS ANTERIORES (ESTÁVEL) ---
  if (path.endsWith('/') || path.endsWith('index.html')) { /* ...código de login estável... */ }
  if (path.endsWith('clientes.html')) { /* ...código de clientes estável... */ }
  if (path.endsWith('representantes.html')) { /* ...código de representantes estável... */ }
  if (path.endsWith('servicos.html')) { /* ...código de serviços estável... */ }

  // ===============================================================
  // LÓGICA DA PÁGINA DE ORDENS DE SERVIÇO
  // ===============================================================
  if (path.endsWith('ordens_de_servico.html')) {
    const mainForm = document.getElementById('os-main-form');
    const clientSelect = document.getElementById('os-client-select');
    const servicesSelect = document.getElementById('os-services-select');
    const servicesTableBody = document.getElementById('os-services-table-body');
    const totalValueDisplay = document.getElementById('os-total-value');
    const saveButton = document.getElementById('save-os-main-button');
    const docsSection = document.getElementById('os-docs-section');
    
    let allServicesCache = []; // Cache para evitar múltiplas leituras do DB
    let currentOS = { services: [] }; // Objeto para manter o estado da O.S. atual

    // --- FUNÇÕES DE POPULAÇÃO ---
    const populateClients = async () => {
        clientSelect.innerHTML = '<option value="">Selecione um cliente...</option>';
        const snapshot = await getDocs(query(collection(db, "clientes")));
        snapshot.forEach(doc => {
            const client = doc.data();
            clientSelect.innerHTML += `<option value="${doc.id}">${client.nome}</option>`;
        });
    };

    const populateServices = async () => {
        servicesSelect.innerHTML = '<option value="">Adicionar um serviço...</option>';
        const snapshot = await getDocs(query(collection(db, "servicos")));
        allServicesCache = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allServicesCache.forEach(service => {
            servicesSelect.innerHTML += `<option value="${service.id}">${service.name}</option>`;
        });
    };

    // --- FUNÇÕES DE RENDERIZAÇÃO E CÁLCULO ---
    const calculateTotal = () => {
        const total = currentOS.services.reduce((sum, service) => sum + Number(service.valorPraticado), 0);
        totalValueDisplay.textContent = formatCurrency(total);
    };
    
    const renderServicesTable = () => {
        servicesTableBody.innerHTML = '';
        currentOS.services.forEach((service, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${service.name}</td>
                <td>${formatCurrency(service.value)}</td>
                <td>
                    <div class="input-group">
                        <div class="input-group-prepend"><span class="input-group-text">R$</span></div>
                        <input type="number" class="form-control service-value-input" data-index="${index}" value="${service.valorPraticado}" step="0.01">
                    </div>
                </td>
                <td><button type="button" class="btn btn-sm btn-danger remove-service-btn" data-index="${index}">&times;</button></td>
            `;
            servicesTableBody.appendChild(row);
        });
        calculateTotal();
    };

    // --- EVENT LISTENERS ---
    servicesSelect.addEventListener('change', () => {
        const serviceId = servicesSelect.value;
        if (!serviceId || currentOS.services.some(s => s.id === serviceId)) return;

        const serviceData = allServicesCache.find(s => s.id === serviceId);
        currentOS.services.push({
            id: serviceData.id,
            name: serviceData.name,
            value: serviceData.value,
            valorPraticado: serviceData.value,
            documents: serviceData.documents // Importante para a próxima fase
        });
        
        renderServicesTable();
        servicesSelect.value = ''; // Reseta o dropdown
    });

    servicesTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-service-btn')) {
            const index = e.target.getAttribute('data-index');
            currentOS.services.splice(index, 1);
            renderServicesTable();
        }
    });

    servicesTableBody.addEventListener('input', (e) => {
        if (e.target.classList.contains('service-value-input')) {
            const index = e.target.getAttribute('data-index');
            currentOS.services[index].valorPraticado = Number(e.target.value);
            calculateTotal();
        }
    });

    saveButton.addEventListener('click', async () => {
        const osId = mainForm.getAttribute('data-id');
        const clientId = clientSelect.value;

        if (!clientId || currentOS.services.length === 0) {
            alert("Por favor, selecione um cliente e adicione pelo menos um serviço.");
            return;
        }

        const osData = {
            clientId: clientId,
            clientName: clientSelect.options[clientSelect.selectedIndex].text,
            status: document.getElementById('os-status-select').value,
            servicos: currentOS.services.map(s => ({ serviceId: s.id, nome: s.name, valorPraticado: s.valorPraticado })),
            valorTotal: currentOS.services.reduce((sum, s) => sum + s.valorPraticado, 0),
            parcelas: {
                p1: Number(document.getElementById('os-payment-1').value) || 0,
                p2: Number(document.getElementById('os-payment-2').value) || 0,
            },
            documentos: [] // Estrutura para a Fase 2
        };

        try {
            if (osId) {
                // Lógica de atualização (futuro)
                await updateDoc(doc(db, "ordensDeServico", osId), osData);
                alert("Ordem de Serviço atualizada com sucesso!");
            } else {
                // Lógica de criação
                const now = new Date();
                const protocol = `OS-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}`;
                
                osData.protocolo = protocol;
                osData.dataCriacao = serverTimestamp();
                
                const docRef = await addDoc(collection(db, "ordensDeServico"), osData);
                mainForm.setAttribute('data-id', docRef.id);
                document.getElementById('os-title').textContent = `Detalhes da O.S.`;
                document.getElementById('os-protocol-display').innerHTML = `<strong>Protocolo:</strong> ${protocol}`;
                
                alert(`Ordem de Serviço ${protocol} criada com sucesso!`);
                saveButton.textContent = 'Atualizar Informações Gerais';
                docsSection.style.display = 'block';
            }
        } catch (error) {
            console.error("Erro ao salvar Ordem de Serviço:", error);
            alert("Ocorreu um erro ao salvar a O.S.");
        }
    });
    
    // --- INICIALIZAÇÃO DA PÁGINA ---
    populateClients();
    populateServices();
  }

  // --- LÓGICA DE AUTENTICAÇÃO E LOGOUT ---
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

// --- PONTO DE ENTRADA PRINCIPAL ---
document.addEventListener('DOMContentLoaded', runPageSpecificLogic);

// --- CÓDIGO COMPLETO E FUNCIONAL DAS PÁGINAS ESTÁVEIS ---
// (Omitido para clareza, mas o código real deve conter a lógica completa para as outras páginas como na versão anterior)
// ...
