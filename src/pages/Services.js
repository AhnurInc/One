import React from 'react';
import './Services.css';

function Services() {
  return (
    <div className="services">
      <section className="section services-header">
        <h1 className="section-title">Nossos Serviços</h1>
        <p className="services-subtitle">Soluções completas para seu negócio digital</p>
      </section>

      <section className="section services-grid">
        <div className="service-card">
          <div className="service-icon">
            <div className="icon-placeholder">💻</div>
          </div>
          <h3>Desenvolvimento Web</h3>
          <p>Criamos aplicações web modernas e responsivas usando as melhores tecnologias do mercado.</p>
          <ul>
            <li>React, Vue.js, Angular</li>
            <li>Node.js, Express</li>
            <li>Bases de dados modernas</li>
          </ul>
        </div>

        <div className="service-card">
          <div className="service-icon">
            <div className="icon-placeholder">📱</div>
          </div>
          <h3>Aplicativos Mobile</h3>
          <p>Desenvolvemos aplicativos nativos e híbridos para iOS e Android.</p>
          <ul>
            <li>React Native</li>
            <li>Flutter</li>
            <li>Apps nativos iOS/Android</li>
          </ul>
        </div>

        <div className="service-card">
          <div className="service-icon">
            <div className="icon-placeholder">☁️</div>
          </div>
          <h3>Soluções Cloud</h3>
          <p>Migração e desenvolvimento de soluções em nuvem escaláveis e seguras.</p>
          <ul>
            <li>AWS, Google Cloud, Azure</li>
            <li>Microserviços</li>
            <li>DevOps e CI/CD</li>
          </ul>
        </div>

        <div className="service-card">
          <div className="service-icon">
            <div className="icon-placeholder">🤖</div>
          </div>
          <h3>Automação e IA</h3>
          <p>Automatize processos e implemente soluções de inteligência artificial.</p>
          <ul>
            <li>Machine Learning</li>
            <li>Chatbots inteligentes</li>
            <li>Automação de processos</li>
          </ul>
        </div>

        <div className="service-card">
          <div className="service-icon">
            <div className="icon-placeholder">🔒</div>
          </div>
          <h3>Segurança Digital</h3>
          <p>Proteja seus dados e sistemas com nossas soluções de segurança.</p>
          <ul>
            <li>Auditoria de segurança</li>
            <li>Criptografia avançada</li>
            <li>Compliance e governança</li>
          </ul>
        </div>

        <div className="service-card">
          <div className="service-icon">
            <div className="icon-placeholder">📊</div>
          </div>
          <h3>Analytics e BI</h3>
          <p>Transforme dados em insights valiosos para seu negócio.</p>
          <ul>
            <li>Dashboards interativos</li>
            <li>Big Data Analytics</li>
            <li>Relatórios personalizados</li>
          </ul>
        </div>
      </section>

      <section className="section cta-section">
        <h2>Pronto para começar?</h2>
        <p>Entre em contato conosco e descubra como podemos ajudar seu negócio a crescer.</p>
        <div className="cta-buttons">
          <a href="/contact" className="btn btn-primary">Fale Conosco</a>
          <a href="/register" className="btn btn-outline-primary">Criar Conta</a>
        </div>
      </section>
    </div>
  );
}

export default Services;