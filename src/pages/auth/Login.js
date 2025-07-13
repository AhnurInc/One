import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Auth.css';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
  password: Yup.string()
    .required('Senha é obrigatória'),
});

function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (values) => {
    try {
      setError('');
      setLoading(true);
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (error) {
      setError('Falha ao fazer login. Verifique seu e-mail e senha.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (error) {
      setError('Falha ao fazer login com Google.');
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Entrar</h2>
          <p>Entre na sua conta para acessar o dashboard</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <Field type="email" id="email" name="email" className="form-control" />
                <ErrorMessage name="email" component="div" className="form-error" />
              </div>

              <div className="form-group">
                <div className="password-label-container">
                  <label htmlFor="password">Senha</label>
                  <Link to="/forgot-password" className="forgot-password">
                    Esqueceu a senha?
                  </Link>
                </div>
                <Field type="password" id="password" name="password" className="form-control" />
                <ErrorMessage name="password" component="div" className="form-error" />
              </div>

              <div className="form-group">
                <div className="remember-me">
                  <label>
                    <input type="checkbox" /> Lembrar-me
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting ? 'Entrando...' : 'Entrar'}
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
          <i className="fab fa-google"></i> Entrar com Google
        </button>

        <div className="auth-footer">
          <p>
            Não tem uma conta?{' '}
            <Link to="/register" className="auth-link">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;