import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import DashboardMenu from '../components/DashboardMenu';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/CadastroStyle.css';

export default function Buscar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (busca.length >= 3) {
      buscarClientes();
    } else if (busca.length === 0) {
      listarTodosClientes();
    }
  }, [busca]);

  const listarTodosClientes = async () => {
    setLoading(true);
    try {
      const clientesRef = collection(db, 'clientes');
      const q = query(clientesRef, orderBy('nome'));
      const querySnapshot = await getDocs(q);
      
      const clientes = [];
      querySnapshot.forEach(doc => {
        clientes.push({ id: doc.id, ...doc.data() });
      });
      
      setResultados(clientes);
    } catch (error) {
      console.error("Erro ao listar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const buscarClientes = async () => {
    setLoading(true);
    try {
      const clientesRef = collection(db, 'clientes');
      const buscaLower = busca.toLowerCase();
      const querySnapshot = await getDocs(clientesRef);
      
      const clientesFiltrados = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        if (
          data.nome?.toLowerCase().includes(buscaLower) ||
          data.email?.toLowerCase().includes(buscaLower) ||
          data.telefone?.includes(busca) ||
          data.numeroDocumento?.includes(busca)
        ) {
          clientesFiltrados.push({ id: doc.id, ...data });
        }
      });
      
      setResultados(clientesFiltrados);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopBar onMenuClick={() => setMenuOpen(true)} />
      <DashboardMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="cadastro-bg" style={{paddingTop:'72px'}}>
        <div className="cadastro-card">
          <h2 className="cadastro-title"><span className="material-icons">search</span> Buscar Clientes</h2>
          
          <div className="input-group">
            <span className="material-icons input-icon">search</span>
            <input 
              type="text" 
              placeholder="Digite nome, email, telefone ou documento" 
              value={busca} 
              onChange={e => setBusca(e.target.value)}
            />
          </div>
          
          {loading ? (
            <div>Buscando...</div>
          ) : (
            <div style={{marginTop: '20px'}}>
              <h3>Resultados ({resultados.length})</h3>
              {resultados.length > 0 ? (
                <ul style={{listStyle:'none', padding:0}}>
                  {resultados.map(cliente => (
                    <li key={cliente.id} style={{padding:'10px 0', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <div>
                        <div><strong>{cliente.nome}</strong></div>
                        <div style={{fontSize:'0.9em', color:'#666'}}>
                          {cliente.email} • {cliente.telefone}
                        </div>
                      </div>
                      <button 
                        className="btn-small"
                        onClick={() => navigate(`/detalhes-cliente/${cliente.id}`)}
                      >
                        Ver detalhes
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                busca.length >= 3 && <div>Nenhum cliente encontrado</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}