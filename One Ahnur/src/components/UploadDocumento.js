import React, { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function UploadDocumento({ clienteId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const storageRef = ref(storage, `documentos/${clienteId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      if (onUploadSuccess) {
        onUploadSuccess(downloadURL, file.name);
      }

      setFile(null);
    } catch (err) {
      setError('Erro ao fazer upload: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="input-group-file">
        <input type="file" onChange={handleFileChange} disabled={uploading} />
        <button 
          className="btn-cadastro" 
          onClick={handleUpload}
          disabled={!file || uploading}
          style={{marginLeft: '10px'}}
        >
          <span className="material-icons">upload</span> Upload
        </button>
      </div>
      {uploading && <div>Enviando...</div>}
      {error && <div style={{color: 'red'}}>{error}</div>}
    </div>
  );
}