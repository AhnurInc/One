import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Auth.css';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
});

function ForgotPassword() {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (values) => {
    try {
      setError('');
      setMessage('');
      setLoading(true);
      await resetPassword(values.email);
      setMessage('Instruções para redefinir sua senha foram enviadas para seu e-mail.');
    } catch (error) {
      setError('Falha ao redefinir senha. Verifique seu e-mail.');
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Esqueceu a Senha?</h2>
          <p>Digite seu e-mail para receber instruções de recuperação</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <Formik
          initialValues={{
            email: '',
          }}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <Field type="email" id="email" name="email" className="form-control" />
                <ErrorMessage name="email" component="div" className="form-error" />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting ? 'Enviando...' : 'Enviar Instruções'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="auth-footer">
          <p>
            <Link to="/login" className="auth-link">
              <i className="fas fa-arrow-left"></i> Voltar para o login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;