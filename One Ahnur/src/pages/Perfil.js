import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import TopBar from '../components/TopBar';
import DashboardMenu from '../components/DashboardMenu';
import LogoutBtn from '../components/LogoutBtn';
import '../styles/CadastroStyle.css';

export default function Perfil() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({
    nome: auth.currentUser?.displayName || '',
    email: auth.currentUser?.email || '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMsg('');
    setMsgType('');
    setLoading(true);

    try {
      if (form.nome !== auth.currentUser?.displayName) {
        await updateProfile(auth.currentUser, { displayName: form.nome });
      }
      
      if (form.email !== auth.currentUser?.email) {
        await updateEmail(auth.currentUser, form.email);
      }
      
      if (form.novaSenha) {
        if (form.novaSenha !== form.confirmarSenha) {
          throw new Error('As senhas não coincidem');
        }
        
        if (form.novaSenha.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres');
        }
        
        await updatePassword(auth.currentUser, form.novaSenha);
        setForm({...form, senhaAtual: '', novaSenha: '', confirmarSenha: ''});
      }
      
      setMsg('Perfil atualizado com sucesso!');
      setMsgType('success');
    } catch (error) {
      setMsg('Erro: ' + error.message);
      setMsgType('error');
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
          <h2 className="cadastro-title"><span className="material-icons">person</span> Perfil do Usuário</h2>
          
          {auth.currentUser ? (
            <form onSubmit={handleUpdateProfile}>
              <div className="input-group">
                <span className="material-icons input-icon">person</span>
                <input 
                  type="text" 
                  placeholder="Nome" 
                  value={form.nome} 
                  onChange={e=>setForm(f=>({...f,nome:e.target.value}))}
                />
              </div>
              
              <div className="input-group">
                <span className="material-icons input-icon">email</span>
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={form.email} 
                  onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                />
              </div>
              
              <h3 style={{marginTop:'20px'}}>Alterar Senha</h3>
              
              <div className="input-group">
                <span className="material-icons input-icon">lock</span>
                <input 
                  type="password" 
                  placeholder="Nova Senha" 
                  value={form.novaSenha} 
                  onChange={e=>setForm(f=>({...f,novaSenha:e.target.value}))}
                />
              </div>
              
              <div className="input-group">
                <span className="material-icons input-icon">lock_outline</span>
                <input 
                  type="password" 
                  placeholder="Confirmar Nova Senha" 
                  value={form.confirmarSenha} 
                  onChange={e=>setForm(f=>({...f,confirmarSenha:e.target.value}))}
                />
              </div>
              
              <div className="cadastro-actions" style={{display:'flex', gap:'20px'}}>
                <button 
                  type="submit" 
                  className="btn-cadastro" 
                  disabled={loading}
                >
                  <span className="material-icons">save</span> 
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                
                <LogoutBtn />
              </div>
              
              <div className={`cadastro-msg ${msgType === 'error' ? 'error' : ''}`}>{msg}</div>
              
              <div style={{marginTop:'20px'}}>
                <p><strong>UID:</strong> {auth.currentUser.uid}</p>
                <p><strong>Último login:</strong> {auth.currentUser.metadata.lastSignInTime}</p>
              </div>
            </form>
          ) : (
            <div>
              <p>Nenhum usuário logado.</p>
              <button 
                className="btn-cadastro" 
                onClick={()=>window.location='/login'}
              >
                <span className="material-icons">login</span> Entrar
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}