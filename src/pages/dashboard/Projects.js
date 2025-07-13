import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs, query, where, orderBy, doc, deleteDoc } from 'firebase/firestore';
import './Projects.css';

function Projects() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!currentUser) return;

        const projectsQuery = query(
          collection(db, 'projects'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        
        const projectsSnapshot = await getDocs(projectsQuery);
        const projectsList = [];
        
        projectsSnapshot.forEach((doc) => {
          projectsList.push({ id: doc.id, ...doc.data() });
        });
        
        setProjects(projectsList);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentUser]);

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    
    try {
      await deleteDoc(doc(db, 'projects', projectToDelete));
      setProjects(projects.filter(project => project.id !== projectToDelete));
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const openDeleteModal = (projectId) => {
    setProjectToDelete(projectId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Filter and sort projects
  const filteredProjects = projects.filter(project => {
    // Filter by status
    if (filter !== 'all' && project.status !== filter) {
      return false;
    }
    
    // Filter by search term
    if (search && !project.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by selected criteria
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt?.toDate()) - new Date(a.createdAt?.toDate());
      case 'oldest':
        return new Date(a.createdAt?.toDate()) - new Date(b.createdAt?.toDate());
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'progress':
        return (b.progress || 0) - (a.progress || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Projetos</h1>
        <Link to="/dashboard/projects/new" className="btn btn-primary">
          <i className="fas fa-plus"></i> Novo Projeto
        </Link>
      </div>

      <div className="projects-filters">
        <div className="search-box">
          <input 
            type="text"
            placeholder="Buscar projetos..."
            value={search}
            onChange={handleSearchChange}
          />
          <i className="fas fa-search"></i>
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="filter-status">Status:</label>
            <select 
              id="filter-status" 
              value={filter} 
              onChange={handleFilterChange}
              className="form-control"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="completed">Concluídos</option>
              <option value="on-hold">Em Espera</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sort-by">Ordenar por:</label>
            <select 
              id="sort-by" 
              value={sortBy} 
              onChange={handleSortChange}
              className="form-control"
            >
              <option value="newest">Mais Recentes</option>
              <option value="oldest">Mais Antigos</option>
              <option value="name-asc">Nome (A-Z)</option>
              <option value="name-desc">Nome (Z-A)</option>
              <option value="progress">Progresso</option>
            </select>
          </div>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <div className="project-card" key={project.id}>
              <div className={`project-status status-${project.status || 'active'}`}></div>
              <div className="project-header">
                <h3 className="project-title">{project.name}</h3>
                <div className="project-dropdown">
                  <button className="project-menu-btn">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                  <div className="project-dropdown-menu">
                    <Link to={`/dashboard/projects/${project.id}`} className="dropdown-item">
                      <i className="fas fa-eye"></i> Ver Detalhes
                    </Link>
                    <Link to={`/dashboard/projects/${project.id}/edit`} className="dropdown-item">
                      <i className="fas fa-edit"></i> Editar
                    </Link>
                    <button 
                      className="dropdown-item text-danger" 
                      onClick={() => openDeleteModal(project.id)}
                    >
                      <i className="fas fa-trash-alt"></i> Excluir
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="project-description">{project.description || 'Sem descrição'}</div>
              
              <div className="project-progress">
                <div className="progress-label">
                  <span>Progresso</span>
                  <span>{project.progress || 0}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="project-meta">
                <div className="meta-item">
                  <i className="far fa-calendar-alt"></i>
                  <span>{formatDate(project.createdAt?.toDate())}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-tasks"></i>
                  <span>{project.tasksCount || 0} tarefas</span>
                </div>
              </div>
              
              <Link to={`/dashboard/projects/${project.id}`} className="project-link">
                Ver Projeto
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <i className="fas fa-folder-open"></i>
          <h3>Nenhum projeto encontrado</h3>
          <p>
            {search || filter !== 'all'
              ? 'Tente ajustar os filtros de busca'
              : 'Crie seu primeiro projeto para começar'}
          </p>
          <Link to="/dashboard/projects/new" className="btn btn-primary">
            Criar Projeto
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Confirmar Exclusão</h3>
              <button className="modal-close" onClick={closeDeleteModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={closeDeleteModal}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="projects-footer">
        <p>Mostrando {filteredProjects.length} de {projects.length} projetos</p>
        <p>Última atualização: 2025-07-13 05:53:54</p>
        <p>Usuário: AhnurIncContinue</p>
      </div>
    </div>
  );
}

// Helper function
function formatDate(date) {
  if (!date) return 'N/A';
  return date.toLocaleDateString();
}

export default Projects;