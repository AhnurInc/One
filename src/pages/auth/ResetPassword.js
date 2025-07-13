import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../firebase';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Auth.css';

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'As senhas devem ser iguais')
    .required('Confirme sua senha'),
});

function ResetPassword() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [oobCode, setOobCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract the oobCode from the URL query string
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('oobCode');

    if (!code) {
      setError('Link de redefinição de senha inválido ou expirado.');
      setValidating(false);
      return;
    }

    setOobCode(code);

    // Verify the password reset code
    verifyPasswordResetCode(auth, code)
      .then(() => {
        setValidating(false);
      })
      .catch((error) => {
        console.error('Error verifying reset code:', error);
        setError('Link de redefinição de senha inválido ou expirado.');
        setValidating(false);
      });
  }, [location]);

  const handleSubmit = async (values) => {
    try {
      setError('');
      setLoading(true);
      await confirmPasswordReset(auth, oobCode, values.password);
      navigate('/login', { 
        state: { 
          message: 'Sua senha foi redefinida com sucesso. Você pode fazer login agora.' 
        } 
      });
    } catch (error) {
      setError('Falha ao redefinir a senha. ' + (error.message || ''));
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h2>Redefinir Senha</h2>
            <p>Verificando seu link de redefinição...</p>
          </div>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Redefinir Senha</h2>
          <p>Digite sua nova senha</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {!error ? (
          <Formik
            initialValues={{
              password: '',
              confirmPassword: '',
            }}
            validationSchema={resetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="password">Nova Senha</label>
                  <Field type="password" id="password" name="password" className="form-control" />
                  <ErrorMessage name="password" component="div" className="form-error" />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                  <Field type="password" id="confirmPassword" name="confirmPassword" className="form-control" />
                  <ErrorMessage name="confirmPassword" component="div" className="form-error" />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading || isSubmitting}
                >
                  {loading || isSubmitting ? 'Redefinindo...' : 'Redefinir Senha'}
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="auth-footer">
            <p>
              <Link to="/forgot-password" className="auth-link">
                Solicitar um novo link de redefinição
              </Link>
            </p>
          </div>
        )}

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

export default ResetPassword;