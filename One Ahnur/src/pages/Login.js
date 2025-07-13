import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/CadastroStyle.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', senha: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    
    signInWithEmailAndPassword(auth, form.email, form.senha)
      .then(() => {
        navigate('/');
      })
      .catch(err => {
        let errorMsg = 'Login inválido';
        if (err.code === 'auth/user-not-found') {
          errorMsg = 'Usuário não encontrado';
        } else if (err.code === 'auth/wrong-password') {
          errorMsg = 'Senha incorreta';
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
          <span className="material-icons">layers</span> Ahnur<span style={{fontWeight:700}}>Inc</span>
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
          <div className="cadastro-actions" style={{display:'flex', justifyContent:'center'}}>
            <button 
              type="submit" 
              className="btn-cadastro" 
              disabled={loading}
            >
              <span className="material-icons">login</span> 
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
          {msg && <div className="cadastro-msg error">{msg}</div>}
          
          <div style={{textAlign:'center', marginTop:'20px'}}>
            <p>Não tem uma conta? <Link to="/register">Cadastre-se</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}