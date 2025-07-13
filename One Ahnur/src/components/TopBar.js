import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TopBar.css';

export default function TopBar({ onMenuClick }) {
  const navigate = useNavigate();

  return (
    <div className="material-topbar">
      <div className="topbar-left" onClick={() => navigate('/')}>
        <span className="material-icons topbar-logo">layers</span>
        <span className="topbar-title">Ahnur<span className="topbar-title-bold">Inc</span></span>
      </div>
      <div className="topbar-icons">
        <span className="material-icons topbar-icon" onClick={() => navigate('/buscar')}>search</span>
        <span className="material-icons topbar-icon" onClick={() => navigate('/cadastro-cliente')}>person_add</span>
        <span className="material-icons topbar-icon" onClick={onMenuClick}>menu</span>
      </div>
    </div>
  );
}