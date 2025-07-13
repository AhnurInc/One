import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DashboardMenu.css';

export default function DashboardMenu({ open, onClose }) {
  const navigate = useNavigate();

  const menuItems = [
    { icon: 'home', text: 'Dashboard', path: '/' },
    { icon: 'person_add', text: 'Cadastrar Cliente', path: '/cadastro-cliente' },
    { icon: 'assignment', text: 'Cadastrar Serviço', path: '/cadastro-servico' },
    { icon: 'group', text: 'Cadastrar Indicação', path: '/cadastro-indicacao' },
    { icon: 'attach_money', text: 'Pagamentos', path: '/pagamentos' },
    { icon: 'search', text: 'Buscar', path: '/buscar' },
    { icon: 'person', text: 'Perfil', path: '/perfil' },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className={`dashboard-menu ${open ? 'open' : ''}`}>
      <div className="menu-header">
        <span className="material-icons menu-close" onClick={onClose}>close</span>
        <span>Menu</span>
      </div>
      <div className="menu-logo-row">
        <span className="material-icons menu-logo">layers</span>
        <span className="menu-title">Ahnur<span className="menu-title-bold">Inc</span></span>
        <span className="material-icons menu-search" onClick={() => handleNavigate('/buscar')}>search</span>
      </div>
      <div className="menu-items">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-item" onClick={() => handleNavigate(item.path)}>
            <span className="material-icons">{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
      <div className="menu-social">
        <div className="menu-social-title">Redes Sociais</div>
        <div className="menu-social-icons">
          <div className="menu-social-circle fb">
            <i className="fab fa-facebook-f"></i>
            <span className="menu-social-badge">2</span>
          </div>
          <div className="menu-social-circle tw">
            <i className="fab fa-twitter"></i>
          </div>
          <div className="menu-social-circle go">
            <i className="fab fa-google"></i>
            <span className="menu-social-badge">4</span>
          </div>
          <div className="menu-social-circle ig">
            <i className="fab fa-instagram"></i>
          </div>
        </div>
      </div>
    </div>
  );
}