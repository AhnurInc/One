import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, deleteDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './ProjectDetails.css';

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Configurar ambiente',
      description: 'Instalar dependências e preparar ambiente de desenvolvimento',
      status: 'completed',
      priority: 'high',
      dueDate: new Date(2025, 6, 10),
      assignedTo: 'AhnurIncContinue'
    },
    {
      id: '2',
      title: 'Desenhar interface',
      description: 'Criar mockups e protótipos das telas principais',
      status: 'in-progress',
      priority: 'medium',
      dueDate: new Date(2025, 6, 15),
      assignedTo: 'Designer'
    },
    {
      id: '3',
      title: 'Implementar autenticação',
      description: 'Desenvolver sistema de login e cadastro',
      status: 'pending',
      priority: 'high',
      dueDate: new Date(2025, 6, 20),
      assignedTo: 'AhnurIncContinue'
    }
  ]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!currentUser) return;

        const projectDoc = await getDoc(doc(db, 'projects', id));
        
        if (!projectDoc.exists()) {
          setError('Projeto não encontrado');
          return;
        }
        
        const projectData = { id: projectDoc.id, ...projectDoc.data() };
        
        // Check if the project belongs to the current user
        if (projectData.userId !== currentUser.uid) {
          setError('Você não tem permissão para acessar este projeto');
          return;
        }
        
        setProject(projectData);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Erro ao carregar o projeto');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, currentUser]);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) return;
    
    try {
      // In a real app, you would save the task to Firestore
      // For demonstration, we'll just add it to local state
      const taskData = {
        id: `task-${Date.now()}`,
        title: newTask.title,
        description: newTask.description || '',
        status: 'pending',
        priority: newTask.priority,
        dueDate: new Date(2025, 6, 25),
        assignedTo: currentUser.displayName || 'Não atribuído',
        createdAt: new Date()
      };
      
      setTasks([...tasks, taskData]);
      setNewTask({ title: '', description: '', priority: 'medium' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleTaskStatusChange = (taskId, status) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    );
    setTasks(updatedTasks);
  };

  const updateProgress = async () => {
    try {
      if (!project) return;
      
      // Calculate project progress based on completed tasks
      const totalTasks = tasks.length;
      if (totalTasks === 0) return;
      
      const completedTasks = tasks.filter(task => task.status === 'completed').length;
      const progress = Math.round((completedTasks / totalTasks) * 100);
      
      // Update project in Firestore
      await updateDoc(doc(db, 'projects', project.id), {
        progress,
        updatedAt: serverTimestamp()
      });
      
      // Update local state
      setProject({ ...project, progress });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  useEffect(() => {
    if (project && tasks.length > 0) {
      updateProgress();
    }
  }, [tasks]);

  const handleDeleteProject = async () => {
    try {
      await deleteDoc(doc(db, 'projects', project.id));
      navigate('/dashboard/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  if (error) {
    return (
      <div className="project-error">
        <h2>Erro</h2>
        <p>{error}</p>
        <Link to="/dashboard/projects" className="btn btn-primary">Voltar para Projetos</Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-error">
        <h2>Projeto não encontrado</h2>
        <Link to="/dashboard/projects" className="btn btn-primary">Voltar para Projetos</Link>
      </div>
    );
  }

  return (
    <div className="project-details-page">
      <div className="project-details-header">
        <div className="header-title">
          <Link to="/dashboard/projects" className="back-link">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <h1>{project.name}</h1>
          <span className={`status-badge status-${project.status || 'active'}`}>
            {getStatusLabel(project.status)}
          </span>
        </div>
        <div className="header-actions">
          <Link to={`/dashboard/projects/${project.id}/edit`} className="btn btn-outline-primary">
            <i className="fas fa-edit"></i> Editar
          </Link>
          <button className="btn btn-outline-danger" onClick={() => setShowDeleteModal(true)}>
            <i className="fas fa-trash-alt"></i> Excluir
          </button>
        </div>
      </div>

      <div className="project-progress-bar">
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${project.progress || 0}%` }}
          ></div>
        </div>
        <span className="progress-text">{project.progress || 0}% Completo</span>
      </div>

      <div className="project-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-info-circle"></i> Visão Geral
        </button>
        <button 
          className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <i className="fas fa-tasks"></i> Tarefas
        </button>
        <button 
          className={`tab-button ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => setActiveTab('files')}
        >
          <i className="fas fa-file"></i> Arquivos
        </button>
        <button 
          className={`tab-button ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          <i className="fas fa-users"></i> Equipe
        </button>
      </div>

      <div className="project-content">
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Detalhes do Projeto</h3>
                <div className="project-details">
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={`detail-value status-text-${project.status || 'active'}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Data de Criação:</span>
                    <span className="detail-value">
                      {project.createdAt ? formatDate(project.createdAt.toDate()) : 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Última Atualização:</span>
                    <span className="detail-value">
                      {project.updatedAt ? formatDate(project.updatedAt.toDate()) : 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Criado por:</span>
                    <span className="detail-value">{currentUser?.displayName || 'Usuário'}</span>
                  </div>
                </div>
              </div>

              <div className="overview-card">
                <h3>Descrição</h3>
                <p className="project-description">
                  {project.description || 'Este projeto não possui uma descrição.'}
                </p>
              </div>

              <div className="overview-card">
                <h3>Progresso de Tarefas</h3>
                <div className="task-stats">
                  <div className="stat-item">
                    <div className="stat-value">{tasks.filter(t => t.status === 'completed').length}</div>
                    <div className="stat-label">Concluídas</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{tasks.filter(t => t.status === 'in-progress').length}</div>
                    <div className="stat-label">Em Andamento</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{tasks.filter(t => t.status === 'pending').length}</div>
                    <div className="stat-label">Pendentes</div>
                  </div>
                </div>
              </div>

              <div className="overview-card">
                <h3>Notas</h3>
                <div className="notes-container">
                  <div className="note">
                    <div className="note-header">
                      <span className="note-author">AhnurIncContinue</span>
                      <span className="note-date">2025-07-13 05:58:00</span>
                    </div>
                    <div className="note-content">
                      Reunião inicial realizada. Definidos os principais requisitos e prazos.
                    </div>
                  </div>
                </div>
                <div className="add-note">
                  <textarea 
                    placeholder="Adicionar uma nota..." 
                    className="form-control"
                    rows="3"
                  ></textarea>
                  <button className="btn btn-primary btn-sm">Adicionar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="tab-content">
            <div className="tasks-header">
              <h3>Tarefas</h3>
              <button className="btn btn-primary btn-sm" data-toggle="collapse" data-target="#newTaskForm">
                <i className="fas fa-plus"></i> Nova Tarefa
              </button>
            </div>

            <div id="newTaskForm" className="new-task-form">
              <form onSubmit={handleTaskSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <input 
                      type="text" 
                      placeholder="Título da tarefa" 
                      className="form-control"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <select 
                      className="form-control"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                      <option value="low">Baixa Prioridade</option>
                      <option value="medium">Média Prioridade</option>
                      <option value="high">Alta Prioridade</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <textarea 
                    placeholder="Descrição (opcional)" 
                    className="form-control"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows="2"
                  ></textarea>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Adicionar Tarefa</button>
                </div>
              </form>
            </div>

            <div className="tasks-container">
              {tasks.length > 0 ? (
                <div className="tasks-columns">
                  <div className="task-column">
                    <h4 className="column-header">Pendentes</h4>
                    <div className="tasks-list">
                      {tasks
                        .filter(task => task.status === 'pending')
                        .map(task => (
                          <div className="task-card" key={task.id}>
                            <div className={`task-priority priority-${task.priority}`}></div>
                            <h5 className="task-title">{task.title}</h5>
                            <p className="task-description">{task.description}</p>
                            <div className="task-meta">
                              <span className="task-assignee">
                                <i className="far fa-user"></i> {task.assignedTo}
                              </span>
                              <span className="task-due">
                                <i className="far fa-calendar"></i> {formatDate(task.dueDate)}
                              </span>
                            </div>
                            <div className="task-actions">
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleTaskStatusChange(task.id, 'in-progress')}
                              >
                                Iniciar
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="task-column">
                    <h4 className="column-header">Em Andamento</h4>
                    <div className="tasks-list">
                      {tasks
                        .filter(task => task.status === 'in-progress')
                        .map(task => (
                          <div className="task-card" key={task.id}>
                            <div className={`task-priority priority-${task.priority}`}></div>
                            <h5 className="task-title">{task.title}</h5>
                            <p className="task-description">{task.description}</p>
                            <div className="task-meta">
                              <span className="task-assignee">
                                <i className="far fa-user"></i> {task.assignedTo}
                              </span>
                              <span className="task-due">
                                <i className="far fa-calendar"></i> {formatDate(task.dueDate)}
                              </span>
                            </div>
                            <div className="task-actions">
                              <button 
                                className="btn btn-sm btn-success"
                                onClick={() => handleTaskStatusChange(task.id, 'completed')}
                              >
                                Concluir
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="task-column">
                    <h4 className="column-header">Concluídas</h4>
                    <div className="tasks-list">
                      {tasks
                        .filter(task => task.status === 'completed')
                        .map(task => (
                          <div className="task-card" key={task.id}>
                            <div className={`task-priority priority-${task.priority}`}></div>
                            <h5 className="task-title completed">{task.title}</h5>
                            <p className="task-description">{task.description}</p>
                            <div className="task-meta">
                              <span className="task-assignee">
                                <i className="far fa-user"></i> {task.assignedTo}
                              </span>
                              <span className="task-due">
                                <i className="far fa-calendar"></i> {formatDate(task.dueDate)}
                              </span>
                            </div>
                            <div className="task-actions">
                              <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handleTaskStatusChange(task.id, 'in-progress')}
                              >
                                Reabrir
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fas fa-tasks"></i>
                  <h3>Nenhuma tarefa encontrada</h3>
                  <p>Adicione tarefas para organizar seu trabalho neste projeto</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="tab-content">
            <div className="files-header">
              <h3>Arquivos do Projeto</h3>
              <button className="btn btn-primary btn-sm">
                <i className="fas fa-upload"></i> Enviar Arquivo
              </button>
            </div>

            <div className="files-container">
              <div className="empty-state">
                <i className="fas fa-file"></i>
                <h3>Nenhum arquivo encontrado</h3>
                <p>Envie arquivos para compartilhar com a equipe do projeto</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="tab-content">
            <div className="team-header">
              <h3>Equipe do Projeto</h3>
              <button className="btn btn-primary btn-sm">
                <i className="fas fa-user-plus"></i> Adicionar Membro
              </button>
            </div>

            <div className="team-container">
              <div className="team-member">
                <div className="member-avatar">
                  <div className="avatar-placeholder">A</div>
                </div>
                <div className="member-info">
                  <h4>{currentUser?.displayName || 'AhnurIncContinue'}</h4>
                  <p>Proprietário</p>
                </div>
                <div className="member-actions">
                  <span className="owner-badge">Proprietário</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Confirmar Exclusão</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Tem certeza que deseja excluir o projeto <strong>{project.name}</strong>? Esta ação não pode ser desfeita.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={handleDeleteProject}>
                Excluir Projeto
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="project-details-footer">
        <p>Última atualização: 2025-07-13 05:58:00</p>
        <p>Usuário: AhnurIncContinue</p>
      </div>
    </div>
  );
}

// Helper functions
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
      return 'Ativo';
  }
}

function formatDate(date) {
  if (!date) return 'N/A';
  return date.toLocaleDateString();
}

export default ProjectDetails;