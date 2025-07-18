// =================================================================
// ARQUIVO DE SCRIPT CENTRAL - AHNUR INC. (VERSÃO COM LÓGICA DE AUTH CORRIGIDA PARA GITHUB PAGES)
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

  if (path.includes('login') || path.endsWith('/One/') || path.endsWith('/One/index.html') || path.endsWith('/')) {
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
  
  if (path.includes('clientes.html')) {
    // A lógica de clientes permanece aqui
  }
  
  if (path.includes('representantes.html')) {
    // A lógica de representantes permanece aqui
  }
  
  if (path.includes('servicos.html')) {
    // A lógica de serviços permanece aqui
  }
  
  if (path.includes('ordens_de_servico.html')) {
    const mainForm = document.getElementById('os-main-form');
    const clientSelect = $('#os-client-select'); // Usando jQuery para o Select2
    const servicesSelect = $('#os-services-select'); // Usando jQuery para o Select2
    const servicesTableBody = document.getElementById('os-services-table-body');
    const totalValueDisplay = document.getElementById('os-total-value');
    const saveButton = document.getElementById('save-os-main-button');
    const docsSection = document.getElementById('os-docs-section');
    
    let allServicesCache = [];
    let currentOS = { services: [] };

    clientSelect.select2({ theme: 'bootstrap4', placeholder: 'Selecione um cliente...' });
    servicesSelect.select2({ theme: 'bootstrap4', placeholder: 'Adicionar um serviço...' });

    const populateClients = async () => {
        const snapshot = await getDocs(query(collection(db, "clientes")));
        const clientOptions = snapshot.docs.map(doc => new Option(doc.data().nome, doc.id, false, false));
        clientSelect.append(new Option('', '', true, true)).append(...clientOptions).trigger('change');
    };

    const populateServices = async () => {
        const snapshot = await getDocs(query(collection(db, "servicos")));
        allServicesCache = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const serviceOptions = allServicesCache.map(service => new Option(service.name, service.id, false, false));
        servicesSelect.append(new Option('', '', true, true)).append(...serviceOptions).trigger('change');
    };

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

    servicesSelect.on('select2:select', (e) => {
        const serviceId = e.params.data.id;
        if (!serviceId || currentOS.services.some(s => s.id === serviceId)) return;
        const serviceData = allServicesCache.find(s => s.id === serviceId);
        currentOS.services.push({ id: serviceData.id, name: serviceData.name, value: serviceData.value, valorPraticado: serviceData.value, documents: serviceData.documents });
        renderServicesTable();
        servicesSelect.val(null).trigger('change');
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
        const clientIdValue = clientSelect.val();
        if (!clientIdValue || currentOS.services.length === 0) {
            alert("Por favor, selecione um cliente e adicione pelo menos um serviço.");
            return;
        }
        const osData = {
            clientId: clientIdValue,
            clientName: clientSelect.select2('data')[0].text,
            status: document.getElementById('os-status-select').value,
            servicos: currentOS.services.map(s => ({ serviceId: s.id, nome: s.name, valorPraticado: s.valorPraticado })),
            valorTotal: currentOS.services.reduce((sum, s) => sum + s.valorPraticado, 0),
            parcelas: {
                p1: Number(document.getElementById('os-payment-1').value) || 0,
                p2: Number(document.getElementById('os-payment-2').value) || 0,
            },
            documentos: []
        };
        try {
            if (osId) {
                await updateDoc(doc(db, "ordensDeServico", osId), osData);
                alert("Ordem de Serviço atualizada com sucesso!");
            } else {
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
    
    populateClients();
    populateServices();
  }

  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      signOut(auth).catch((error) => console.error("Erro ao sair:", error));
    });
  }
}

// ===============================================================
// **CORREÇÃO DEFINITIVA**: LÓGICA DE AUTENTICAÇÃO ROBUSTA
// ===============================================================
onAuthStateChanged(auth, (user) => {
  const basePath = '/One'; // Nome do seu repositório
  const path = window.location.pathname;

  // Verifica de forma explícita se estamos na página de login
  const isOnLoginPage = path === `${basePath}/` || path === `${basePath}/index.html`;

  if (user) {
    // Usuário está logado
    const userDisplayName = document.getElementById('user-display-name');
    if (userDisplayName) {
      userDisplayName.textContent = user.email;
    }
    // Se estiver na página de login, redireciona para o dashboard
    if (isOnLoginPage) {
      window.location.href = `${basePath}/dashboard.html`;
    }
  } else {
    // Usuário NÃO está logado
    // Se NÃO estiver na página de login, redireciona para ela
    if (!isOnLoginPage) {
      window.location.href = `${basePath}/index.html`;
    }
  }
});

document.addEventListener('DOMContentLoaded', runPageSpecificLogic);
