import React from 'react';
import { NavLink } from 'react-router-dom';
import './DashboardSidebar.css';

function DashboardSidebar({ isOpen }) {
  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-content">
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <NavLink to="/dashboard" end className="sidebar-link">
              <i className="fas fa-home"></i>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/dashboard/projects" className="sidebar-link">
              <i className="fas fa-project-diagram"></i>
              <span>Projetos</span>
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/dashboard/profile" className="sidebar-link">
              <i className="far fa-user"></i>
              <span>Meu Perfil</span>
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/dashboard/settings" className="sidebar-link">
              <i className="fas fa-cog"></i>
              <span>Configurações</span>
            </NavLink>
          </li>
          <li className="sidebar-header">Ajuda & Suporte</li>
          <li className="sidebar-item">
            <a href="https://docs.ahnurinc.com" target="_blank" rel="noopener noreferrer" className="sidebar-link">
              <i className="fas fa-book"></i>
              <span>Documentação</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="https://support.ahnurinc.com" target="_blank" rel="noopener noreferrer" className="sidebar-link">
              <i className="fas fa-question-circle"></i>
              <span>Suporte</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default DashboardSidebar;