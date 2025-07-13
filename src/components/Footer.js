import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>AhnurInc One</h3>
          <p>Inovação para o futuro.</p>
        </div>
        <div className="footer-section">
          <h3>Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">Sobre</a></li>
            <li><a href="/contact">Contato</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contato</h3>
          <p>contato@ahonurinc.com</p>
          <p>+55 (11) 9999-9999</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AhnurInc. Todos os direitos reservados.</p>
        <p>Última atualização: 2025-07-13 05:42:24</p>
      </div>
    </footer>
  );
}

export default Footer;