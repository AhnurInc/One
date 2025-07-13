import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CadastroCliente from './pages/CadastroCliente';
import CadastroServico from './pages/CadastroServico';
import CadastroIndicacao from './pages/CadastroIndicacao';
import Pagamentos from './pages/Pagamentos';
import DetalhesCliente from './pages/DetalhesCliente';
import EditarCliente from './pages/EditarCliente';
import Buscar from './pages/Buscar';
import Login from './pages/Login';
import Register from './pages/Register';
import Perfil from './pages/Perfil';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/cadastro-cliente" element={<ProtectedRoute><CadastroCliente /></ProtectedRoute>} />
          <Route path="/cadastro-servico" element={<ProtectedRoute><CadastroServico /></ProtectedRoute>} />
          <Route path="/cadastro-indicacao" element={<ProtectedRoute><CadastroIndicacao /></ProtectedRoute>} />
          <Route path="/pagamentos" element={<ProtectedRoute><Pagamentos /></ProtectedRoute>} />
          <Route path="/detalhes-cliente/:id" element={<ProtectedRoute><DetalhesCliente /></ProtectedRoute>} />
          <Route path="/editar-cliente/:id" element={<ProtectedRoute><EditarCliente /></ProtectedRoute>} />
          <Route path="/buscar" element={<ProtectedRoute><Buscar /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}