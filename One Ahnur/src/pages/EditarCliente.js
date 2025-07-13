import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import DashboardMenu from '../components/DashboardMenu';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CadastroStyle.css';

export default function EditarCliente() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { id } = useParams();
  const [servicos, setServicos] = useState([]);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    nacionalidade: '',
    tipoDocumento: '',
    numeroDocumento: '',
    servico: '',
    observacoes: ''
  });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados do cliente
        const clienteSnap = await getDoc(doc(db, 'clientes', id));
        if (clienteSnap.exists()) {
          setForm(clienteSnap.data());
        } else {
          setMsg('Cliente não encontrado');
        }

        // Buscar serviços disponíveis
        const servicosSnap = await getDocs(collection(db, 'servicos'));
        const servicosData = [];
        servicosSnap.forEach(doc => {
          servicosData.push({ id: doc.id, ...doc.data() });
        });
        setServicos(servicosData);
      } catch (error) {
        setMsg('Erro ao carregar dados: ' + error.message);
      }
    };

    fetchData();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    try {
      await updateDoc(doc(db, 'clientes', id), form);
      setMsg('Dados atualizados com sucesso!');
      setTimeout(() => navigate(`/detalhes-cliente/${id}`), 1500);
    } catch (err) {
      setMsg('Erro ao salvar: ' + err.message);
    }
  }

  return (
    <>
      <TopBar onMenuClick={() => setMenuOpen(true)} />
      <DashboardMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="cadastro-bg" style={{paddingTop:'72px'}}>
        <div className="cadastro-card">
          <h2 className="cadastro-title"><span className="material-icons">edit</span> Editar Cliente</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="material-icons input-icon">person</span>
              <input type="text" placeholder="Nome completo" required value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))}/>
            </div>
            <div className="input-group">
              <span className="material-icons input-icon">email</span>
              <input type="email" placeholder="Email" required value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
            </div>
            <div className="input-group">
              <span className="material-icons input-icon">phone</span>
              <input type="tel" placeholder="Telefone" required value={form.telefone} onChange={e=>setForm(f=>({...f,telefone:e.target.value}))}/>
            </div>
            <div className="input-group">
              <span className="material-icons input-icon">flag</span>
              <input type="text" placeholder="Nacionalidade" required value={form.nacionalidade} onChange={e=>setForm(f=>({...f,nacionalidade:e.target.value}))}/>
            </div>
            <div className="input-group">
              <span className="material-icons input-icon">badge</span>
              <select required value={form.tipoDocumento} onChange={e=>setForm(f=>({...f,tipoDocumento:e.target.value}))}>
                <option value="">Tipo de documento</option>
                <option value="passaporte">Passaporte</option>
                <option value="rnm">RNM</option>
              </select>
              <input type="text" required style={{marginLeft:'10px',maxWidth:'180px'}} placeholder="Número documento" value={form.numeroDocumento} onChange={e=>setForm(f=>({...f,numeroDocumento:e.target.value}))}/>
            </div>
            <div className="input-group">
              <span className="material-icons input-icon">assignment</span>
              <select required value={form.servico} onChange={e=>setForm(f=>({...f,servico:e.target.value}))}>
                <option value="">Tipo de serviço</option>
                {servicos.map(servico => (
                  <option key={servico.id} value={servico.id}>{servico.nome}</option>
                ))}
                <option value="outro">Outro</option>
              </select>
            </div>
            <div className="input-group">
              <span className="material-icons input-icon">notes</span>
              <textarea placeholder="Observações" value={form.observacoes} onChange={e=>setForm(f=>({...f,observacoes:e.target.value}))}/>
            </div>
            <div className="cadastro-actions">
              <button type="submit" className="btn-cadastro"><span className="material-icons">save</span> SALVAR</button>
            </div>
            <div className="cadastro-msg">{msg}</div>
          </form>
        </div>
      </div>
    </>
  );
}