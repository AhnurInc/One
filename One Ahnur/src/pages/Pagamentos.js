import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import DashboardMenu from '../components/DashboardMenu';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import '../styles/CadastroStyle.css';

export default function Pagamentos() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({
    clienteId: '',
    valor: '',
    dataPagamento: new Date().toISOString().substring(0, 10),
    metodo: '',
    descricao: ''
  });
  const [clientes, setClientes] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Buscar clientes
        const clientesSnap = await getDocs(collection(db, 'clientes'));
        const clientesData = [];
        clientesSnap.forEach(doc => {
          clientesData.push({ id: doc.id, ...doc.data() });
        });
        setClientes(clientesData);

        // Buscar pagamentos
        const pagamentosQuery = query(collection(db, 'pagamentos'), orderBy('dataPagamento', 'desc'));
        const pagamentosSnap = await getDocs(pagamentosQuery);
        const pagamentosData = [];
        
        for (const docSnap of pagamentosSnap.docs) {
          const pagamento = docSnap.data();
          // Buscar dados do cliente associado
          if (pagamento.clienteId) {
            const clienteSnap = await getDoc(doc(db, 'clientes', pagamento.clienteId));
            if (clienteSnap.exists()) {
              pagamento.cliente = clienteSnap.data();
            }
          }
          pagamentosData.push({ id: docSnap.id, ...pagamento });
        }
        
        setPagamentos(pagamentosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    
    if (!form.clienteId || !form.valor || !form.metodo) {
      setMsg('Preencha todos os campos obrigatórios.');
      return;
    }
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'pagamentos'), {
        ...form,
        valor: parseFloat(form.valor),
        dataRegistro: new Date().toISOString()
      });
      
      setMsg('Pagamento registrado com sucesso!');
      setForm({
        clienteId: '',
        valor: '',
        dataPagamento: new Date().toISOString().substring(0, 10),
        metodo: '',
        descricao: ''
      });
      
      // Recarregar a lista de pagamentos
      const pagamentosQuery = query(collection(db, 'pagamentos'), orderBy('dataPagamento', 'desc'));
      const pagamentosSnap = await getDocs(pagamentosQuery);
      const pagamentosData = [];
      
      for (const docSnap of pagamentosSnap.docs) {
        const pagamento = docSnap.data();
        if (pagamento.clienteId) {
          const clienteSnap = await getDoc(doc(db, 'clientes', pagamento.clienteId));
          if (clienteSnap.exists()) {
            pagamento.cliente = clienteSnap.data();
          }
        }
        pagamentosData.push({ id: docSnap.id, ...pagamento });
      }
      
      setPagamentos(pagamentosData);
    } catch (error) {
      setMsg('Erro ao registrar pagamento: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  const formatarValor = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <>
      <TopBar onMenuClick={() => setMenuOpen(true)} />
      <DashboardMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="cadastro-bg" style={{paddingTop:'72px'}}>
        <div className="cadastro-card">
          <h2 className="cadastro-title"><span className="material-icons">attach_money</span> Registrar Pagamento</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="material-icons input-icon">person</span>
              <select 
                required 
                value={form.clienteId} 
                onChange={e=>setForm(f=>({...f,clienteId:e.target.value}))}
              >
                <option value="">Selecione um cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                ))}
              </select>
            </div>
            
            <div className="input-group">
              <span className="material-icons input-icon">attach_money</span>
              <input 
                type="number" 
                placeholder="Valor (R$)" 
                step="0.01" 
                min="0" 
                required 
                value={form.valor} 
                onChange={e=>setForm(f=>({...f,valor:e.target.value}))}
              />
            </div>
            
            <div className="input-group">
              <span className="material-icons input-icon">calendar_today</span>
              <input 
                type="date" 
                required 
                value={form.dataPagamento} 
                onChange={e=>setForm(f=>({...f,dataPagamento:e.target.value}))}
              />
            </div>
            
            <div className="input-group">
              <span className="material-icons input-icon">credit_card</span>
              <select 
                required 
                value={form.metodo} 
                onChange={e=>setForm(f=>({...f,metodo:e.target.value}))}
              >
                <option value="">Método de pagamento</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao">Cartão de crédito/débito</option>
                <option value="pix">Pix</option>
                <option value="transferencia">Transferência bancária</option>
                <option value="boleto">Boleto</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            
            <div className="input-group">
              <span className="material-icons input-icon">notes</span>
              <textarea 
                placeholder="Descrição" 
                value={form.descricao} 
                onChange={e=>setForm(f=>({...f,descricao:e.target.value}))}
              />
            </div>
            
            <div className="cadastro-actions">
              <button 
                type="submit" 
                className="btn-cadastro" 
                disabled={loading}
              >
                <span className="material-icons">save</span> 
                {loading ? 'Salvando...' : 'REGISTRAR PAGAMENTO'}
              </button>
            </div>
            
            <div className="cadastro-msg">{msg}</div>
          </form>
        </div>
        
        <div className="cadastro-card" style={{marginTop:'30px'}}>
          <h2 className="cadastro-title"><span className="material-icons">list</span> Histórico de Pagamentos</h2>
          
          {loading ? (
            <div>Carregando...</div>
          ) : pagamentos.length > 0 ? (
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', marginTop:'20px'}}>
                <thead>
                  <tr style={{borderBottom:'2px solid #eee'}}>
                    <th style={{textAlign:'left', padding:'10px 5px'}}>Cliente</th>
                    <th style={{textAlign:'left', padding:'10px 5px'}}>Valor</th>
                    <th style={{textAlign:'left', padding:'10px 5px'}}>Data</th>
                    <th style={{textAlign:'left', padding:'10px 5px'}}>Método</th>
                    <th style={{textAlign:'left', padding:'10px 5px'}}>Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  {pagamentos.map(pagamento => (
                    <tr key={pagamento.id} style={{borderBottom:'1px solid #eee'}}>
                      <td style={{padding:'10px 5px'}}>{pagamento.cliente?.nome || 'Cliente não encontrado'}</td>
                      <td style={{padding:'10px 5px'}}>{formatarValor(pagamento.valor)}</td>
                      <td style={{padding:'10px 5px'}}>{new Date(pagamento.dataPagamento).toLocaleDateString()}</td>
                      <td style={{padding:'10px 5px'}}>{pagamento.metodo}</td>
                      <td style={{padding:'10px 5px'}}>{pagamento.descricao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>Nenhum pagamento registrado</div>
          )}
        </div>
      </div>
    </>
  );
}