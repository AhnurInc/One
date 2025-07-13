import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    message: '',
    isError: false,
    isSubmitted: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        message: 'Por favor, preencha todos os campos obrigatórios.',
        isError: true,
        isSubmitted: false
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        message: 'Por favor, forneça um endereço de email válido.',
        isError: true,
        isSubmitted: false
      });
      return;
    }
    
    // Here would be the API call to submit the form
    // For now, we'll simulate a successful submission
    setFormStatus({
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      isError: false,
      isSubmitted: true
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact">
      <section className="section contact-header">
        <h1 className="section-title">Entre em Contato</h1>
        <p className="contact-subtitle">Estamos prontos para ouvir você. Preencha o formulário abaixo e entraremos em contato o mais rápido possível.</p>
      </section>

      <div className="contact-container">
        <div className="contact-info">
          <div className="info-item">
            <h3>Endereço</h3>
            <p>Av. Paulista, 1000</p>
            <p>São Paulo, SP - Brasil</p>
          </div>
          <div className="info-item">
            <h3>Email</h3>
            <p>contato@ahonurinc.com</p>
            <p>suporte@ahonurinc.com</p>
          </div>
          <div className="info-item">
            <h3>Telefone</h3>
            <p>+55 (11) 9999-9999</p>
            <p>+55 (11) 8888-8888</p>
          </div>
          <div className="info-item">
            <h3>Horário de Funcionamento</h3>
            <p>Segunda a Sexta: 9h às 18h</p>
            <p>Sábado e Domingo: Fechado</p>
          </div>
        </div>

        <div className="contact-form-container">
          {formStatus.message && (
            <div className={`form-message ${formStatus.isError ? 'error' : 'success'}`}>
              {formStatus.message}
            </div>
          )}
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Assunto</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Mensagem *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn submit-btn">Enviar Mensagem</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;