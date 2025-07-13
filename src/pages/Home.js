import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Transforme Suas Ideias em Realidade Digital</h1>
          <p>
            AhnurInc One oferece soluções tecnológicas inovadoras para impulsionar
            seu negócio para o próximo nível.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Começar Agora</Link>
            <Link to="/services" className="btn btn-outline-primary">Conheça Nossos Serviços</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="image-placeholder"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="section-header">
          <h2>Por que escolher AhnurInc One?</h2>
          <p>Descubra como podemos ajudar você a alcançar seus objetivos</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Alto Desempenho</h3>
            <p>Nossas soluções são otimizadas para oferecer o melhor desempenho, garantindo rapidez e eficiência.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Segurança Avançada</h3>
            <p>Implementamos as melhores práticas de segurança para proteger seus dados e informações sensíveis.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>100% Responsivo</h3>
            <p>Todas as nossas soluções funcionam perfeitamente em qualquer dispositivo, do desktop ao smartphone.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Atualizações Constantes</h3>
            <p>Mantemos nossas tecnologias sempre atualizadas, garantindo compatibilidade e recursos modernos.</p>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="section services-preview">
        <div className="section-header">
          <h2>Nossos Serviços</h2>
          <p>Soluções completas para atender às necessidades do seu negócio</p>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-laptop-code"></i>
            </div>
            <h3>Desenvolvimento Web</h3>
            <p>Sites e aplicações web modernos e responsivos, com foco em experiência do usuário e performance.</p>
            <Link to="/services#web" className="service-link">Saiba mais <i className="fas fa-arrow-right"></i></Link>
          </div>
          
          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-mobile-alt"></i>
            </div>
            <h3>Aplicativos Mobile</h3>
            <p>Aplicativos nativos e híbridos para iOS e Android, com design intuitivo e funcionalidades avançadas.</p>
            <Link to="/services#mobile" className="service-link">Saiba mais <i className="fas fa-arrow-right"></i></Link>
          </div>
          
          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-cloud"></i>
            </div>
            <h3>Cloud & DevOps</h3>
            <p>Infraestrutura em nuvem escalável e segura, com automação de processos e integração contínua.</p>
            <Link to="/services#cloud" className="service-link">Saiba mais <i className="fas fa-arrow-right"></i></Link>
          </div>
        </div>

        <div className="services-cta">
          <Link to="/services" className="btn btn-primary">Ver Todos os Serviços</Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section testimonials-section">
        <div className="section-header">
          <h2>O Que Nossos Clientes Dizem</h2>
          <p>Depoimentos de quem confia em nossa qualidade</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"A equipe da AhnurInc One entregou nosso projeto antes do prazo e com qualidade excepcional. Estamos muito satisfeitos com os resultados."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <h4>Carlos Silva</h4>
                <p>CEO, TechSolutions</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"Nosso aplicativo móvel desenvolvido pela AhnurInc One aumentou nossas conversões em 45%. Recomendo fortemente!"</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <h4>Ana Ferreira</h4>
                <p>Marketing Director, InnovateCorp</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"Migrar nossa infraestrutura para a nuvem com a AhnurInc One foi uma decisão que transformou nossa operação, reduzindo custos e aumentando a eficiência."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <h4>Roberto Mendes</h4>
                <p>CTO, GlobalTech</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="cta-content">
          <h2>Pronto para transformar sua ideia em realidade?</h2>
          <p>Entre em contato conosco hoje mesmo e descubra como podemos ajudar.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary">Fale Conosco</Link>
            <Link to="/register" className="btn btn-outline-primary">Criar Conta</Link>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="section updates-section">
        <div className="section-header">
          <h2>Últimas Atualizações</h2>
          <p>Confira as novidades da AhnurInc One</p>
        </div>

        <div className="updates-grid">
          <div className="update-card">
            <div className="update-image"></div>
            <div className="update-date">13 Jul, 2025</div>
            <h3>Lançamento da Plataforma AhnurInc One</h3>
            <p>Nossa nova plataforma está no ar com recursos inovadores para facilitar seu desenvolvimento.</p>
            <a href="#" className="update-link">Leia mais <i className="fas fa-arrow-right"></i></a>
          </div>
          
          <div className="update-card">
            <div className="update-image"></div>
            <div className="update-date">10 Jul, 2025</div>
            <h3>Novos Recursos de Cloud Computing</h3>
            <p>Adicionamos suporte a novas tecnologias de nuvem para melhorar a escalabilidade.</p>
            <a href="#" className="update-link">Leia mais <i className="fas fa-arrow-right"></i></a>
          </div>
          
          <div className="update-card">
            <div className="update-image"></div>
            <div className="update-date">5 Jul, 2025</div>
            <h3>Parceria com Líderes do Mercado</h3>
            <p>Anunciamos novas parcerias estratégicas para ampliar nosso portfólio de soluções.</p>
            <a href="#" className="update-link">Leia mais <i className="fas fa-arrow-right"></i></a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;