import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/CadastroStyle.css';

export default function Register() {
  const [form, setForm] = useState({ email: '', senha: '', confirmarSenha: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    
    if (form.senha !== form.confirmarSenha) {
      setMsg('As senhas não coincidem');
      return;
    }
    
    if (form.senha.length < 6) {
      setMsg('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    createUserWithEmailAndPassword(auth, form.email, form.senha)
      .then(() => {
        navigate('/');
      })
      .catch(err => {
        let errorMsg = 'Erro no cadastro';
        if (err.code === 'auth/email-already-in-use') {
          errorMsg = 'Este email já está em uso';
        }
        setMsg(errorMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="cadastro-bg" style={{paddingTop:'72px', background:'#03A9F4', justifyContent:'center'}}>
      <div className="cadastro-card" style={{marginTop:'30px'}}>
        <h2 className="cadastro-title" style={{textAlign:'center'}}>
          <span className="material-icons">person_add</span> Cadastro
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="material-icons input-icon">email</span>
            <input 
              type="email" 
              placeholder="E-mail" 
              required 
              value={form.email} 
              onChange={e=>setForm(f=>({...f,email:e.target.value}))}
            />
          </div>
          <div className="input-group">
            <span className="material-icons input-icon">lock</span>
            <input 
              type="password" 
              placeholder="Senha" 
              required 
              value={form.senha} 
              onChange={e=>setForm(f=>({...f,senha:e.target.value}))}
            />
          </div>
          <div className="input-group">
            <span className="material-icons input-icon">lock_outline</span>
            <input 
              type="password" 
              placeholder="Confirmar Senha" 
              required 
              value={form.confirmarSenha} 
              onChange={e=>setForm(f=>({...f,confirmarSenha:e.target.value}))}
            />
          </div>
          <div className="cadastro-actions" style={{display:'flex', justifyContent:'center'}}>
            <button 
              type="submit" 
              className="btn-cadastro" 
              disabled={loading}
            >
              <span className="material-icons">person_add</span> 
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </div>
          {msg && <div className="cadastro-msg error">{msg}</div>}
          
          <div style={{textAlign:'center', marginTop:'20px'}}>
            <p>Já tem uma conta? <Link to="/login">Fazer login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}