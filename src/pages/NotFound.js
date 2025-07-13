import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1>Página Não Encontrada</h1>
        <p>A página que você está procurando não existe ou foi movida.</p>
        <Link to="/" className="btn btn-primary">Voltar para Home</Link>
      </div>
    </div>
  );
}

export default NotFound;