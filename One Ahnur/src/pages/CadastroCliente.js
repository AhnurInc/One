import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import DashboardMenu from '../components/DashboardMenu';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import '../styles/CadastroStyle.css';

export default function CadastroCliente() {
  const [menuOpen, setMenuOpen] = useState(false);
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
  const [servicos, setServicos] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'servicos'));
        const servicosData = [];
        querySnapshot.forEach(doc => {
          servicosData.push({ id: doc.id, ...doc.data() });
        });
        setServicos(servicosData);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
      }
    };
    fetchServicos();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    if (!form.nome || !form.email || !form.telefone || !form.nacionalidade || !form.tipoDocumento || !form.numeroDocumento || !form.servico) {
      setMsg('Preencha todos os campos obrigatórios.');
      return;
    }
    try {
      await addDoc(collection(db, 'clientes'), {
        ...form, dataCadastro: new Date().toISOString()
      });
      setMsg('Cliente cadastrado com sucesso!');
      setForm({
        nome: '',
        email: '',
        telefone: '',
        nacionalidade: '',
        tipoDocumento: '',
        numeroDocumento: '',
        servico: '',
        observacoes: ''
      });
    } catch (error) {
      setMsg('Erro ao cadastrar cliente: ' + error.message);
    }
  }

  return (
    <>
      <TopBar onMenuClick={() => setMenuOpen(true)} />
      <DashboardMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="cadastro-bg" style={{paddingTop:'72px'}}>
        <div className="cadastro-card">
          <h2 className="cadastro-title"><span className="material-icons">person_add</span> Cadastro Cliente</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="material-icons input-icon">person</span>
              <input type="text" placeholder="Nome completo" required value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))} />
            </div>
            <div className="input-group">
              <span className="material-icons input-icon">email</span>
              <input type="email" placeholder="Email" required value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
            </div>
            <div className="input-group">
              <span className="material-icons input-icon">phone</span>
              <input type="tel" placeholder="Telefone" required value={form.telefone} onChange={e=>setForm(f=>({...f,telefone:e.target.value}))} />
            </div>
            <div className="input-group">
              <span className="material-icons input-icon">flag</span>
              <input type="text" placeholder="Nacionalidade" required value={form.nacionalidade} onChange={e=>setForm(f=>({...f,nacionalidade:e.target.value}))} />
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
              <button type="submit" className="btn-cadastro">
                <span className="material-icons">save</span> CADASTRAR CLIENTE
              </button>
            </div>
            <div className="cadastro-msg">{msg}</div>
          </form>
        </div>
      </div>
    </>
  );
}