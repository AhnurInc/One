import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Auth.css';

const registerSchema = Yup.object().shape({
  username: Yup.string()
    .required('Nome de usuário é obrigatório')
    .min(3, 'Nome de usuário deve ter pelo menos 3 caracteres')
    .max(20, 'Nome de usuário não pode ter mais de 20 caracteres'),
  email: Yup.string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
  password: Yup.string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'As senhas devem ser iguais')
    .required('Confirme sua senha'),
  terms: Yup.boolean()
    .required('Você deve concordar com os termos')
    .oneOf([true], 'Você deve concordar com os termos'),
});

function Register() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setError('');
      setLoading(true);
      await signup(values.email, values.password, values.username);
      navigate('/dashboard');
    } catch (error) {
      setError('Falha ao criar conta. ' + (error.message || ''));
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      setError('Falha ao entrar com Google.');
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Criar Conta</h2>
          <p>Crie sua conta para começar a usar o AhnurInc One</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            terms: false,
          }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="username">Nome de Usuário</label>
                <Field type="text" id="username" name="username" className="form-control" />
                <ErrorMessage name="username" component="div" className="form-error" />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <Field type="email" id="email" name="email" className="form-control" />
                <ErrorMessage name="email" component="div" className="form-error" />
              </div>

              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <Field type="password" id="password" name="password" className="form-control" />
                <ErrorMessage name="password" component="div" className="form-error" />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Senha</label>
                <Field type="password" id="confirmPassword" name="confirmPassword" className="form-control" />
                <ErrorMessage name="confirmPassword" component="div" className="form-error" />
              </div>

              <div className="form-group">
                <div className="checkbox-container">
                  <label className="checkbox-label">
                    <Field type="checkbox" name="terms" />
                    <span>Concordo com os <Link to="/terms">Termos de Serviço</Link> e <Link to="/privacy">Política de Privacidade</Link></span>
                  </label>
                  <ErrorMessage name="terms" component="div" className="form-error" />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="auth-divider">
          <span>ou</span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="btn btn-outline-primary btn-block social-login google-login"
          disabled={loading}
        >
          <i className="fab fa-google"></i> Cadastrar com Google
        </button>

        <div className="auth-footer">
          <p>
            Já tem uma conta?{' '}
            <Link to="/login" className="auth-link">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;