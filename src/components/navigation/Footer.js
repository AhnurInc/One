import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h2 className="footer-title">AhnurInc One</h2>
            <p>
              Oferecemos soluções tecnológicas inovadoras para empresas de todos os tamanhos.
              Nossa missão é transformar ideias em realidade digital.
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div className="footer-section links">
            <h2 className="footer-title">Links Rápidos</h2>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">Sobre Nós</Link></li>
              <li><Link to="/services">Serviços</Link></li>
              <li><Link to="/contact">Contato</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Cadastro</Link></li>
            </ul>
          </div>

          <div className="footer-section contact">
            <h2 className="footer-title">Contato</h2>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Av. Paulista, 1000, São Paulo - SP</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+55 (11) 9999-9999</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>contato@ahnurinc.com</span>
              </div>
            </div>
          </div>

          <div className="footer-section newsletter">
            <h2 className="footer-title">Newsletter</h2>
            <p>Inscreva-se para receber nossas novidades e atualizações.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Seu email" required />
              <button type="submit" className="btn btn-primary">Inscrever</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AhnurInc One. Todos os direitos reservados.</p>
          <p className="footer-update">Última atualização: 2025-07-13 05:44:38</p>
          <div className="footer-bottom-links">
            <Link to="/terms">Termos de Uso</Link>
            <Link to="/privacy">Política de Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;