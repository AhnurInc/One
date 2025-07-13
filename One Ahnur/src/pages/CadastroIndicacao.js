import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import DashboardMenu from '../components/DashboardMenu';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import '../styles/CadastroStyle.css';

export default function CadastroIndicacao() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    email: '',
    indicacaoDe: ''
  });
  const [msg, setMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    if (!form.nome || !form.indicacaoDe) {
      setMsg('Preencha todos os campos obrigatórios.');
      return;
    }
    try {
      await addDoc(collection(db, 'indicacoes'), {
        ...form, dataCadastro: new Date().toISOString()
      });
      setMsg('Indicação cadastrada com sucesso!');
      setForm({ nome: '', telefone: '', email: '', indicacaoDe: '' });
    } catch (error) {
      setMsg('Erro ao cadastrar indicação: ' + error.message);
    }
  }

  return (
    <>
      <TopBar onMenuClick={() => setMenuOpen(true)} />
      <DashboardMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="cadastro-bg" style={{paddingTop:'72px'}}>
        <div className="cadastro-card">
          <h2 className="cadastro-title"><span className="material-icons">group</span> Cadastro Indicação</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="material-icons input-icon">person</span>
              <input type="text" placeholder="Nome do indicado" required value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))}/>
            </div>
            <div className="input-group">
              <span className="material-icons input-icon">phone</span>
              <input type="tel" placeholder="Telefone" value={form.telefone} onChange={e=>setForm(f=>({...f,telefone:e.target.value}))}/>
            </div>
            <div className="input-group">
              <span className="material-icons input-icon">email</span>
              <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
            </div>
            <div className="input-group">
              <span className="material-icons input-icon">person</span>
              <input type="text" placeholder="Indicação de quem?" required value={form.indicacaoDe} onChange={e=>setForm(f=>({...f,indicacaoDe:e.target.value}))}/>
            </div>
            <div className="cadastro-actions">
              <button type="submit" className="btn-cadastro">
                <span className="material-icons">save</span> CADASTRAR INDICAÇÃO
              </button>
            </div>
            <div className="cadastro-msg">{msg}</div>
          </form>
        </div>
      </div>
    </>
  );
}