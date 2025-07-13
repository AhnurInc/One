import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import './Profile.css';

const profileSchema = Yup.object().shape({
  displayName: Yup.string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome não pode ter mais de 50 caracteres'),
  email: Yup.string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
  bio: Yup.string()
    .max(200, 'Bio não pode ter mais de 200 caracteres'),
  company: Yup.string()
    .max(50, 'Nome da empresa não pode ter mais de 50 caracteres'),
  location: Yup.string()
    .max(50, 'Localização não pode ter mais de 50 caracteres'),
  website: Yup.string()
    .url('URL inválida')
});

function Profile() {
  const { currentUser, userProfile, updateUserProfile, updateUserEmail, getUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (currentUser?.photoURL && !avatarPreview) {
      setAvatarPreview(currentUser.photoURL);
    }
  }, [currentUser, avatarPreview]);

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      setMessage({ text: '', type: '' });
      
      // Update profile photo if changed
      let photoURL = currentUser?.photoURL || null;
      if (avatarFile) {
        const storageRef = ref(storage, `profile_photos/${currentUser.uid}`);
        await uploadBytes(storageRef, avatarFile);
        photoURL = await getDownloadURL(storageRef);
      }

      // Update user profile in Firebase Auth
      const profileUpdate = {
        displayName: values.displayName,
      };
      
      if (photoURL) {
        profileUpdate.photoURL = photoURL;
      }
      
      await updateUserProfile(profileUpdate);

      // Update email if changed
      if (values.email !== currentUser.email) {
        await updateUserEmail(values.email);
      }

      // Update additional profile data in Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        username: values.displayName,
        email: values.email,
        bio: values.bio || null,
        company: values.company || null,
        location: values.location || null,
        website: values.website || null,
        updatedAt: new Date()
      });

      // Refresh user profile data
      await getUserProfile();

      setMessage({
        text: 'Perfil atualizado com sucesso!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        text: `Erro ao atualizar perfil: ${error.message}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="profile-page">
      <header className="page-header">
        <h1>Meu Perfil</h1>
        <p>Atualize suas informações pessoais</p>
      </header>

      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message.text}
        </div>
      )}

      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile" className="avatar-image" />
              ) : (
                <div className="avatar-placeholder">
                  {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="avatar-overlay">
                <label htmlFor="avatar-upload" className="avatar-upload-label">
                  <i className="fas fa-camera"></i>
                </label>
                <input 
                  type="file" 
                  id="avatar-upload" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="avatar-upload-input" 
                />
              </div>
            </div>
          </div>
          <div className="profile-info">
            <h3>{currentUser?.displayName || 'Usuário'}</h3>
            <p>{currentUser?.email}</p>
            <p className="membership-info">
              <span className="membership-badge">Membro desde</span> {currentUser?.metadata.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        <div className="profile-main">
          <div className="profile-card">
            <h2>Informações Pessoais</h2>

            <Formik
              initialValues={{
                displayName: currentUser?.displayName || '',
                email: currentUser?.email || '',
                bio: userProfile?.bio || '',
                company: userProfile?.company || '',
                location: userProfile?.location || '',
                website: userProfile?.website || ''
              }}
              validationSchema={profileSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form className="profile-form">
                  <div className="form-group">
                    <label htmlFor="displayName">Nome Completo</label>
                    <Field type="text" id="displayName" name="displayName" className="form-control" />
                    <ErrorMessage name="displayName" component="div" className="form-error" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <Field type="email" id="email" name="email" className="form-control" />
                    <ErrorMessage name="email" component="div" className="form-error" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <Field as="textarea" id="bio" name="bio" className="form-control" rows="3" />
                    <ErrorMessage name="bio" component="div" className="form-error" />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="company">Empresa</label>
                      <Field type="text" id="company" name="company" className="form-control" />
                      <ErrorMessage name="company" component="div" className="form-error" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="location">Localização</label>
                      <Field type="text" id="location" name="location" className="form-control" />
                      <ErrorMessage name="location" component="div" className="form-error" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="website">Website</label>
                    <Field type="url" id="website" name="website" className="form-control" />
                    <ErrorMessage name="website" component="div" className="form-error" />
                  </div>

                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={loading || isSubmitting}
                    >
                      {loading || isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <div className="profile-footer">
        <p>Última atualização: 2025-07-13 05:53:54</p>
        <p>Usuário: AhnurIncContinue</p>
      </div>
    </div>
  );
}

export default Profile;