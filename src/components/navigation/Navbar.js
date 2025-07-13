import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      closeMenu();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          AhnurInc <span>One</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}></div>
        </div>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <NavLink to="/" className="nav-link" onClick={closeMenu}>
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/about" className="nav-link" onClick={closeMenu}>
              Sobre
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/services" className="nav-link" onClick={closeMenu}>
              Serviços
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/contact" className="nav-link" onClick={closeMenu}>
              Contato
            </NavLink>
          </li>
          {currentUser ? (
            <li className="nav-item nav-user-item">
              <div className="user-dropdown" onClick={toggleDropdown}>
                <div className="user-avatar">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="User avatar" />
                  ) : (
                    <div className="avatar-placeholder">
                      {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
                <span className="user-name">{currentUser.displayName || 'Usuário'}</span>
                <div className={`dropdown-menu ${dropdownOpen ? 'active' : ''}`}>
                  <Link to="/dashboard" className="dropdown-item" onClick={closeMenu}>
                    Dashboard
                  </Link>
                  <Link to="/dashboard/profile" className="dropdown-item" onClick={closeMenu}>
                    Meu Perfil
                  </Link>
                  <Link to="/dashboard/settings" className="dropdown-item" onClick={closeMenu}>
                    Configurações
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    Sair
                  </button>
                </div>
              </div>
            </li>
          ) : (
            <>
              <li className="nav-item login-btn">
                <NavLink to="/login" className="btn btn-outline-primary" onClick={closeMenu}>
                  Login
                </NavLink>
              </li>
              <li className="nav-item register-btn">
                <NavLink to="/register" className="btn btn-primary" onClick={closeMenu}>
                  Cadastro
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;