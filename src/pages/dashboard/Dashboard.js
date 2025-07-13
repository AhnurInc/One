import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import './Dashboard.css';

function Dashboard() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingTasks: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentUser) return;

        // Fetch projects
        const projectsQuery = query(
          collection(db, 'projects'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        
        const projectsSnapshot = await getDocs(projectsQuery);
        const projectsList = [];
        let activeCount = 0;
        let completedCount = 0;
        
        projectsSnapshot.forEach((doc) => {
          const projectData = { id: doc.id, ...doc.data() };
          projectsList.push(projectData);
          
          if (projectData.status === 'completed') {
            completedCount++;
          } else if (projectData.status === 'active') {
            activeCount++;
          }
        });
        
        setProjects(projectsList);
        setStats({
          totalProjects: projectsSnapshot.size,
          activeProjects: activeCount,
          completedProjects: completedCount,
          pendingTasks: 12 // This would typically be fetched from a tasks collection
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Bem-vindo(a), {currentUser?.displayName || 'Usuário'}</h1>
        <p>Última atualização: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
      </header>

      <section className="dashboard-stats">
        <div className="stat-card">
          <h3>Total de Projetos</h3>
          <div className="value">{stats.totalProjects}</div>
        </div>
        <div className="stat-card">
          <h3>Projetos Ativos</h3>
          <div className="value">{stats.activeProjects}</div>
        </div>
        <div className="stat-card">
          <h3>Projetos Concluídos</h3>
          <div className="value">{stats.completedProjects}</div>
        </div>
        <div className="stat-card">
          <h3>Tarefas Pendentes</h3>
          <div className="value">{stats.pendingTasks}</div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-header-with-action">
          <h2>Projetos Recentes</h2>
          <Link to="/dashboard/projects" className="btn btn-outline-primary">Ver Todos</Link>
        </div>

        {projects.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome do Projeto</th>
                  <th>Status</th>
                  <th>Progresso</th>
                  <th>Data de Criação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.name}</td>
                    <td>
                      <span className={`badge badge-${getStatusClass(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </td>
                    <td>
                      <div className="progress-bar">
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${project.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{project.progress || 0}%</span>
                    </td>
                    <td>{formatDate(project.createdAt?.toDate())}</td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/dashboard/projects/${project.id}`} className="btn btn-sm btn-primary">
                          Ver
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>Você ainda não tem projetos.</p>
            <Link to="/dashboard/projects/new" className="btn btn-primary">Criar Projeto</Link>
          </div>
        )}
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <h2>Tarefas Recentes</h2>
          <div className="tasks-list">
            <div className="task-item">
              <div className="task-checkbox">
                <input type="checkbox" id="task1" />
                <label htmlFor="task1"></label>
              </div>
              <div className="task-content">
                <h4>Finalizar documentação</h4>
                <p>Projeto: Landing Page</p>
                <div className="task-meta">
                  <span className="task-due">Prazo: 15/07/2025</span>
                  <span className="badge badge-warning">Média</span>
                </div>
              </div>
            </div>
            <div className="task-item">
              <div className="task-checkbox">
                <input type="checkbox" id="task2" />
                <label htmlFor="task2"></label>
              </div>
              <div className="task-content">
                <h4>Revisar design do aplicativo</h4>
                <p>Projeto: App Mobile</p>
                <div className="task-meta">
                  <span className="task-due">Prazo: 20/07/2025</span>
                  <span className="badge badge-danger">Alta</span>
                </div>
              </div>
            </div>
            <div className="task-item">
              <div className="task-checkbox">
                <input type="checkbox" id="task3" />
                <label htmlFor="task3"></label>
              </div>
              <div className="task-content">
                <h4>Testar integração API</h4>
                <p>Projeto: E-commerce</p>
                <div className="task-meta">
                  <span className="task-due">Prazo: 18/07/2025</span>
                  <span className="badge badge-primary">Baixa</span>
                </div>
              </div>
            </div>
          </div>
          <div className="section-footer">
            <Link to="/dashboard/tasks" className="btn btn-outline-primary btn-sm">Ver Todas as Tarefas</Link>
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Atividade Recente</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-plus-circle"></i>
              </div>
              <div className="activity-content">
                <p>Você criou um novo projeto <strong>Landing Page</strong></p>
                <span className="activity-time">Hoje, 10:23</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="activity-content">
                <p>Você concluiu a tarefa <strong>Configurar ambiente</strong></p>
                <span className="activity-time">Ontem, 15:45</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-comment"></i>
              </div>
              <div className="activity-content">
                <p>Novo comentário em <strong>App Mobile</strong></p>
                <span className="activity-time">12/07/2025, 09:30</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-edit"></i>
              </div>
              <div className="activity-content">
                <p>Você atualizou <strong>E-commerce</strong></p>
                <span className="activity-time">11/07/2025, 14:15</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Helper functions
function getStatusClass(status) {
  switch (status) {
    case 'active':
      return 'primary';
    case 'completed':
      return 'success';
    case 'on-hold':
      return 'warning';
    case 'cancelled':
      return 'danger';
    default:
      return 'secondary';
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'active':
      return 'Ativo';
    case 'completed':
      return 'Concluído';
    case 'on-hold':
      return 'Em Espera';
    case 'cancelled':
      return 'Cancelado';
    default:
      return 'N/A';
  }
}

function formatDate(date) {
  if (!date) return 'N/A';
  return date.toLocaleDateString();
}

export default Dashboard;