import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

function Services() {
  return (
    <div className="services-page">
      <section className="section services-header">
        <h1 className="section-title">Nossos Serviços</h1>
        <p className="services-subtitle">
          Soluções completas para acelerar o crescimento do seu negócio
        </p>
      </section>

      <section className="section services-list">
        <div className="services-grid">
          <div id="web" className="service-card">
            <div className="service-icon">
              <i className="fas fa-laptop-code"></i>
            </div>
            <h3>Desenvolvimento Web</h3>
            <p>
              Sites e aplicações web modernos e responsivos, com foco em experiência do usuário, performance e tecnologia de ponta.
            </p>
          </div>
          <div id="mobile" className="service-card">
            <div className="service-icon">
              <i className="fas fa-mobile-alt"></i>
            </div>
            <h3>Aplicativos Mobile</h3>
            <p>
              Desenvolvimento de aplicativos nativos e híbridos para iOS e Android, com design intuitivo e funcionalidades avançadas.
            </p>
          </div>
          <div id="cloud" className="service-card">
            <div className="service-icon">
              <i className="fas fa-cloud"></i>
            </div>
            <h3>Cloud &amp; DevOps</h3>
            <p>
              Infraestrutura em nuvem escalável e segura, automação de processos, integração contínua e suporte a novas tecnologias.
            </p>
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="cta-content">
          <h2>Precisa de uma solução personalizada?</h2>
          <p>
            Entre em contato conosco para um atendimento consultivo e descubra como podemos impulsionar seu negócio.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Solicitar Orçamento
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Services;