import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about">
      <section className="section about-header">
        <h1 className="section-title">Sobre a AhnurInc One</h1>
        <p className="about-subtitle">Conheça nossa história, missão e visão para o futuro.</p>
      </section>

      <section className="section about-story">
        <h2>Nossa História</h2>
        <div className="about-content">
          <div className="about-text">
            <p>A AhnurInc One foi fundada em 2023 com uma visão clara: criar soluções tecnológicas que transformam a maneira como as empresas operam e se conectam com seus clientes.</p>
            <p>Começamos como uma pequena equipe de desenvolvedores apaixonados por inovação e, desde então, crescemos para nos tornar uma referência em desenvolvimento de software de alta qualidade.</p>
            <p>Ao longo dos anos, trabalhamos com clientes de diversos setores, desde startups até grandes corporações, sempre mantendo nosso compromisso com a excelência e a satisfação do cliente.</p>
          </div>
          <div className="about-image">
            <div className="placeholder-image"></div>
          </div>
        </div>
      </section>

      <section className="section about-mission">
        <div className="mission-vision-grid">
          <div className="mission-vision-card">
            <h2>Missão</h2>
            <p>Desenvolver soluções tecnológicas inovadoras que potencializam o crescimento dos nossos clientes, gerando valor através da transformação digital.</p>
          </div>
          <div className="mission-vision-card">
            <h2>Visão</h2>
            <p>Ser reconhecida como referência em inovação tecnológica, contribuindo para um mundo mais conectado e eficiente.</p>
          </div>
          <div className="mission-vision-card">
            <h2>Valores</h2>
            <ul>
              <li>Inovação constante</li>
              <li>Excelência técnica</li>
              <li>Compromisso com resultados</li>
              <li>Foco no cliente</li>
              <li>Trabalho em equipe</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section team-section">
        <h2 className="section-title">Nossa Equipe</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-avatar"></div>
            <h3>João Silva</h3>
            <p className="member-role">CEO & Fundador</p>
          </div>
          <div className="team-member">
            <div className="member-avatar"></div>
            <h3>Maria Oliveira</h3>
            <p className="member-role">CTO</p>
          </div>
          <div className="team-member">
            <div className="member-avatar"></div>
            <h3>Pedro Santos</h3>
            <p className="member-role">Lead Developer</p>
          </div>
          <div className="team-member">
            <div className="member-avatar"></div>
            <h3>Ana Costa</h3>
            <p className="member-role">UX/UI Designer</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;