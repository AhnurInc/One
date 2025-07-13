import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import DashboardMenu from '../components/DashboardMenu';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    clientes: 0, servicos: 0, indicacoes: 0, pagamentos: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const clientes = await getDocs(collection(db, 'clientes'));
        const servicos = await getDocs(collection(db, 'servicos'));
        const indicacoes = await getDocs(collection(db, 'indicacoes'));
        const pagamentos = await getDocs(collection(db, 'pagamentos'));
        
        setStats({
          clientes: clientes.size,
          servicos: servicos.size,
          indicacoes: indicacoes.size,
          pagamentos: pagamentos.size
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    }
    fetchStats();
  }, []);

  return (
    <>
      <TopBar onMenuClick={() => setMenuOpen(true)} />
      <DashboardMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="dashboard-bg" style={{paddingTop:'72px'}}>
        <h2>Dashboard</h2>
        <div className="dashboard-cards">
          <div className="card">
            <span className="material-icons card-icon">person</span>
            <div className="card-title">Clientes</div>
            <div className="card-value">{stats.clientes}</div>
          </div>
          <div className="card">
            <span className="material-icons card-icon">assignment</span>
            <div className="card-title">Serviços</div>
            <div className="card-value">{stats.servicos}</div>
          </div>
          <div className="card">
            <span className="material-icons card-icon">group</span>
            <div className="card-title">Indicações</div>
            <div className="card-value">{stats.indicacoes}</div>
          </div>
          <div className="card">
            <span className="material-icons card-icon">attach_money</span>
            <div className="card-title">Pagamentos</div>
            <div className="card-value">{stats.pagamentos}</div>
          </div>
        </div>
      </div>
    </>
  );
}