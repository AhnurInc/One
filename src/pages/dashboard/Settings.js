import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Settings.css';

const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Senha atual é obrigatória'),
  newPassword: Yup.string()
    .required('Nova senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'As senhas devem ser iguais')
    .required('Confirme sua nova senha'),
});

const notificationsSchema = Yup.object().shape({});

function Settings() {
  const { currentUser, updateUserPassword, userProfile } = useAuth();
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('security');

  const handlePasswordUpdate = async (values, { setSubmitting, resetForm }) => {
    try {
      setMessage({ text: '', type: '' });
      
      await updateUserPassword(values.newPassword);
      
      setMessage({
        text: 'Senha atualizada com sucesso!',
        type: 'success'
      });
      
      resetForm();
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({
        text: `Erro ao atualizar senha: ${error.message}`,
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNotificationsUpdate = async (values, { setSubmitting }) => {
    try {
      setMessage({ text: '', type: '' });
      
      // Here would be the API call to update notification preferences
      console.log('Notification preferences updated:', values);
      
      setMessage({
        text: 'Preferências de notificação atualizadas com sucesso!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      setMessage({
        text: `Erro ao atualizar preferências: ${error.message}`,
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="settings-page">
      <header className="page-header">
        <h1>Configurações</h1>
        <p>Gerencie suas preferências e segurança</p>
      </header>

      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message.text}
        </div>
      )}

      <div className="settings-container">
        <div className="settings-sidebar">
          <ul className="settings-tabs">
            <li 
              className={activeTab === 'security' ? 'active' : ''}
              onClick={() => setActiveTab('security')}
            >
              <i className="fas fa-lock"></i>
              <span>Segurança</span>
            </li>
            <li 
              className={activeTab === 'notifications' ? 'active' : ''}
              onClick={() => setActiveTab('notifications')}
            >
              <i className="fas fa-bell"></i>
              <span>Notificações</span>
            </li>
            <li 
              className={activeTab === 'appearance' ? 'active' : ''}
              onClick={() => setActiveTab('appearance')}
            >
              <i className="fas fa-palette"></i>
              <span>Aparência</span>
            </li>
            <li 
              className={activeTab === 'privacy' ? 'active' : ''}
              onClick={() => setActiveTab('privacy')}
            >
              <i className="fas fa-shield-alt"></i>
              <span>Privacidade</span>
            </li>
            <li 
              className={activeTab === 'billing' ? 'active' : ''}
              onClick={() => setActiveTab('billing')}
            >
              <i className="fas fa-credit-card"></i>
              <span>Faturamento</span>
            </li>
            <li 
              className={activeTab === 'data' ? 'active' : ''}
              onClick={() => setActiveTab('data')}
            >
              <i className="fas fa-database"></i>
              <span>Dados</span>
            </li>
          </ul>
        </div>

        <div className="settings-main">
          {activeTab === 'security' && (
            <div className="settings-card">
              <h2>Segurança</h2>
              
              <div className="settings-section">
                <h3>Alterar Senha</h3>
                <Formik
                  initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  }}
                  validationSchema={passwordSchema}
                  onSubmit={handlePasswordUpdate}
                >
                  {({ isSubmitting }) => (
                    <Form className="settings-form">
                      <div className="form-group">
                        <label htmlFor="currentPassword">Senha Atual</label>
                        <Field type="password" id="currentPassword" name="currentPassword" className="form-control" />
                        <ErrorMessage name="currentPassword" component="div" className="form-error" />
                      </div>

                      <div className="form-group">
                        <label htmlFor="newPassword">Nova Senha</label>
                        <Field type="password" id="newPassword" name="newPassword" className="form-control" />
                        <ErrorMessage name="newPassword" component="div" className="form-error" />
                      </div>

                      <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                        <Field type="password" id="confirmPassword" name="confirmPassword" className="form-control" />
                        <ErrorMessage name="confirmPassword" component="div" className="form-error" />
                      </div>

                      <div className="form-actions">
                        <button 
                          type="submit" 
                          className="btn btn-primary" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Atualizando...' : 'Atualizar Senha'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>

              <div className="settings-section">
                <h3>Verificação em Duas Etapas</h3>
                <p className="settings-description">
                  A verificação em duas etapas adiciona uma camada extra de segurança à sua conta.
                </p>

                <div className="two-factor-status">
                  <div className="status-badge disabled">
                    <i className="fas fa-times-circle"></i> Desativado
                  </div>
                  <button className="btn btn-outline-primary">Configurar</button>
                </div>
              </div>

              <div className="settings-section">
                <h3>Sessões Ativas</h3>
                <p className="settings-description">
                  Veja e gerencie os dispositivos onde sua conta está conectada.
                </p>

                <div className="sessions-list">
                  <div className="session-item">
                    <div className="session-info">
                      <div className="device-icon">
                        <i className="fas fa-laptop"></i>
                      </div>
                      <div className="device-details">
                        <h4>Windows 10 - Chrome</h4>
                        <p>São Paulo, Brasil (atual)</p>
                        <span className="session-time">Conectado em 13/07/2025 05:53:54</span>
                      </div>
                    </div>
                    <div className="session-actions">
                      <span className="current-device-badge">Dispositivo Atual</span>
                    </div>
                  </div>
                  
                  <div className="session-item">
                    <div className="session-info">
                      <div className="device-icon">
                        <i className="fas fa-mobile-alt"></i>
                      </div>
                      <div className="device-details">
                        <h4>iPhone - Safari</h4>
                        <p>São Paulo, Brasil</p>
                        <span className="session-time">Conectado em 12/07/2025 14:22:30</span>
                      </div>
                    </div>
                    <div className="session-actions">
                      <button className="btn btn-sm btn-outline-danger">Encerrar</button>
                    </div>
                  </div>
                </div>

                <div className="sessions-actions">
                  <button className="btn btn-danger">Encerrar Todas as Sessões</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-card">
              <h2>Notificações</h2>
              
              <Formik
                initialValues={{
                  emailNotifications: true,
                  projectUpdates: true,
                  securityAlerts: true,
                  marketingEmails: false,
                  taskReminders: true,
                  desktopNotifications: true
                }}
                validationSchema={notificationsSchema}
                onSubmit={handleNotificationsUpdate}
              >
                {({ isSubmitting }) => (
                  <Form className="settings-form">
                    <div className="settings-section">
                      <h3>E-mail</h3>
                      <p className="settings-description">
                        Escolha quais e-mails você deseja receber.
                      </p>

                      <div className="form-group checkbox-group">
                        <label className="checkbox-container">
                          <Field type="checkbox" name="emailNotifications" />
                          <span>Receber notificações por e-mail</span>
                        </label>
                      </div>

                      <div className="form-group checkbox-group">
                        <label className="checkbox-container">
                          <Field type="checkbox" name="projectUpdates" />
                          <span>Atualizações de projetos</span>
                        </label>
                      </div>

                      <div className="form-group checkbox-group">
                        <label className="checkbox-container">
                          <Field type="checkbox" name="securityAlerts" />
                          <span>Alertas de segurança</span>
                        </label>
                      </div>

                      <div className="form-group checkbox-group">
                        <label className="checkbox-container">
                          <Field type="checkbox" name="marketingEmails" />
                          <span>E-mails de marketing e novidades</span>
                        </label>
                      </div>

                      <div className="form-group checkbox-group">
                        <label className="checkbox-container">
                          <Field type="checkbox" name="taskReminders" />
                          <span>Lembretes de tarefas</span>
                        </label>
                      </div>
                    </div>

                    <div className="settings-section">
                      <h3>Aplicativo</h3>
                      <p className="settings-description">
                        Configure as notificações no aplicativo.
                      </p>

                      <div className="form-group checkbox-group">
                        <label className="checkbox-container">
                          <Field type="checkbox" name="desktopNotifications" />
                          <span>Notificações no desktop</span>
                        </label>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Salvando...' : 'Salvar Preferências'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-card">
              <h2>Aparência</h2>
              <div className="settings-section">
                <h3>Tema</h3>
                <p className="settings-description">
                  Escolha o tema da interface.
                </p>
                <div className="theme-selector">
                  <div className="theme-option active">
                    <div className="theme-preview light-theme"></div>
                    <span>Claro</span>
                  </div>
                  <div className="theme-option">
                    <div className="theme-preview dark-theme"></div>
                    <span>Escuro</span>
                  </div>
                  <div className="theme-option">
                    <div className="theme-preview system-theme"></div>
                    <span>Sistema</span>
                  </div>
                </div>
              </div>
              
              <div className="settings-section">
                <h3>Idioma</h3>
                <p className="settings-description">
                  Escolha o idioma da interface.
                </p>
                <div className="form-group">
                  <select className="form-control">
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn-primary">Salvar Preferências</button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="settings-card">
              <h2>Privacidade</h2>
              <div className="settings-section">
                <h3>Visibilidade do Perfil</h3>
                <p className="settings-description">
                  Controle quem pode ver suas informações.
                </p>
                <div className="form-group">
                  <select className="form-control">
                    <option value="public">Público</option>
                    <option value="private">Privado</option>
                    <option value="contacts">Apenas Contatos</option>
                  </select>
                </div>
              </div>

              <div className="settings-section">
                <h3>Dados e Cookies</h3>
                <p className="settings-description">
                  Gerencie como seus dados são utilizados.
                </p>
                <div className="form-group checkbox-group">
                  <label className="checkbox-container">
                    <input type="checkbox" checked />
                    <span>Permitir cookies essenciais</span>
                  </label>
                </div>
                <div className="form-group checkbox-group">
                  <label className="checkbox-container">
                    <input type="checkbox" checked />
                    <span>Permitir cookies de análise</span>
                  </label>
                </div>
                <div className="form-group checkbox-group">
                  <label className="checkbox-container">
                    <input type="checkbox" />
                    <span>Permitir cookies de marketing</span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn-primary">Salvar Preferências</button>
              </div>
            </div>
          )}
          
          {activeTab === 'billing' && (
            <div className="settings-card">
              <h2>Faturamento</h2>
              <div className="settings-section">
                <h3>Plano Atual</h3>
                <div className="plan-info">
                  <div className="plan-badge free">Plano Gratuito</div>
                  <button className="btn btn-outline-primary">Upgrade</button>
                </div>
                <div className="plan-features">
                  <ul>
                    <li><i className="fas fa-check"></i> 5 projetos</li>
                    <li><i className="fas fa-check"></i> 1GB de armazenamento</li>
                    <li><i className="fas fa-check"></i> 1 usuário</li>
                    <li><i className="fas fa-times"></i> Suporte prioritário</li>
                  </ul>
                </div>
              </div>

              <div className="settings-section">
                <h3>Métodos de Pagamento</h3>
                <p className="settings-description">
                  Nenhum método de pagamento cadastrado.
                </p>
                <button className="btn btn-outline-primary">Adicionar Cartão</button>
              </div>
            </div>
          )}
          
          {activeTab === 'data' && (
            <div className="settings-card">
              <h2>Dados</h2>
              <div className="settings-section">
                <h3>Exportar Dados</h3>
                <p className="settings-description">
                  Baixe uma cópia dos seus dados.
                </p>
                <button className="btn btn-outline-primary">
                  <i className="fas fa-download"></i> Exportar Dados
                </button>
              </div>

              <div className="settings-section danger-zone">
                <h3>Zona de Perigo</h3>
                <div className="danger-action">
                  <div>
                    <h4>Excluir Conta</h4>
                    <p>Todos os seus dados serão permanentemente excluídos.</p>
                  </div>
                  <button className="btn btn-danger">Excluir Conta</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="settings-footer">
        <p>Última atualização: 2025-07-13 05:53:54</p>
        <p>Usuário: AhnurIncContinue</p>
      </div>
    </div>
  );
}

export default Settings;