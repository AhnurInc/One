import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './DashboardNav.css';

function DashboardNav({ toggleSidebar }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="dashboard-nav">
      <div className="dashboard-nav-container">
        <div className="dashboard-nav-start">
          <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle Sidebar">
            <i className="fas fa-bars"></i>
          </button>
          <Link to="/" className="dashboard-logo">
            AhnurInc <span>One</span>
          </Link>
        </div>

        <div className="dashboard-nav-end">
          <div className="nav-item search-box">
            <input type="text" placeholder="Pesquisar..." />
            <button className="search-btn" aria-label="Search">
              <i className="fas fa-search"></i>
            </button>
          </div>

          <div className="nav-item notifications">
            <button className="notification-btn" aria-label="Notifications">
              <i className="far fa-bell"></i>
              <span className="badge">3</span>
            </button>
          </div>

          <div className="nav-item user-dropdown">
            <div className="user-info" onClick={toggleDropdown}>
              <div className="user-avatar">
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="User avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              <span className="user-name">{currentUser?.displayName || 'Usuário'}</span>
              <i className="fas fa-chevron-down"></i>
            </div>
            
            <div className={`user-dropdown-menu ${dropdownOpen ? 'active' : ''}`}>
              <Link to="/dashboard/profile" className="dropdown-item">
                <i className="far fa-user"></i> Meu Perfil
              </Link>
              <Link to="/dashboard/settings" className="dropdown-item">
                <i className="fas fa-cog"></i> Configurações
              </Link>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNav;