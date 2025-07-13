import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import DashboardMenu from '../components/DashboardMenu';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import '../styles/CadastroStyle.css';

export default function CadastroServico() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    valor: '',
    tipo: ''
  });
  const [msg, setMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    if (!form.nome || !form.valor || !form.tipo) {
      setMsg('Preencha todos os campos obrigatórios.');
      return;
    }
    try {
      await addDoc(collection(db, 'servicos'), {
        ...form, valor: parseFloat(form.valor), dataCadastro: new Date().toISOString()
      });
      setMsg('Serviço cadastrado com sucesso!');
      setForm({ nome: '', descricao: '', valor: '', tipo: '' });
    } catch (error) {
      setMsg('Erro ao cadastrar serviço: ' + error.message);
    }
  }

  return (
    <>
      <TopBar onMenuClick={() => setMenuOpen(true)} />
      <DashboardMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="cadastro-bg" style={{paddingTop:'72px'}}>
        <div className="cadastro-card">
          <h2 className="cadastro-title"><span className="material-icons">assignment</span> Cadastro Serviço</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="material-icons input-icon">assignment</span>
              <input type="text" placeholder="Nome do serviço" required value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))}/>
            </div>
            <div className="input-group">
              <span className="material-icons input-icon">notes</span>
              <textarea placeholder="Descrição" value={form.descricao} onChange={e=>setForm(f=>({...f,descricao:e.target.value}))}/>
            </div>
            <div className="input-group">
              <span className="material-icons input-icon">attach_money</span>
              <input type="number" placeholder="Valor (R$)" required min="0" step="0.01" value={form.valor} onChange={e=>setForm(f=>({...f,valor:e.target.value}))}/>
            </div>
            <div className="input-group">
              <span className="material-icons input-icon">category</span>
              <select required value={form.tipo} onChange={e=>setForm(f=>({...f,tipo:e.target.value}))}>
                <option value="">Tipo</option>
                <option value="visto">Visto</option>
                <option value="documento">Documento</option>
                <option value="consultoria">Consultoria</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div className="cadastro-actions">
              <button type="submit" className="btn-cadastro">
                <span className="material-icons">save</span> CADASTRAR SERVIÇO
              </button>
            </div>
            <div className="cadastro-msg">{msg}</div>
          </form>
        </div>
      </div>
    </>
  );
}