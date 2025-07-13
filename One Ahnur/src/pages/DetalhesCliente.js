import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import DashboardMenu from '../components/DashboardMenu';
import UploadDocumento from '../components/UploadDocumento';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs, query, where, updateDoc, arrayUnion } from 'firebase/firestore';
import '../styles/DetalhesStyle.css';

export default function DetalhesCliente() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [servico, setServico] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const clienteDoc = await getDoc(doc(db, 'clientes', id));
        if (clienteDoc.exists()) {
          const clienteData = clienteDoc.data();
          setCliente(clienteData);
          
          // Buscar serviço associado
          if (clienteData.servico) {
            const servicoDoc = await getDoc(doc(db, 'servicos', clienteData.servico));
            if (servicoDoc.exists()) {
              setServico(servicoDoc.data());
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
      }
    };
    
    fetchCliente();
  }, [id]);

  const handleUploadSuccess = async (url, nome) => {
    try {
      // Adicionar referência do documento ao cliente
      await updateDoc(doc(db, 'clientes', id), {
        documentos: arrayUnion({
          nome,
          url,
          dataUpload: new Date().toISOString()
        })
      });
      
      // Atualizar cliente na tela
      const clienteAtualizado = await getDoc(doc(db, 'clientes', id));
      setCliente(clienteAtualizado.data());
    } catch (error) {
      console.error("Erro ao salvar documento:", error);
    }
  };

  return (
    <>
      <TopBar onMenuClick={() => setMenuOpen(true)} />
      <DashboardMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="detalhes-bg" style={{paddingTop:'72px'}}>
        <div className="detalhes-card">
          <h2 className="detalhes-title"><span className="material-icons">person</span> Detalhes do Cliente</h2>
          {cliente ? (
            <div id="clienteDetalhes">
              <div><b>Nome:</b> {cliente.nome}</div>
              <div><b>Email:</b> {cliente.email}</div>
              <div><b>Telefone:</b> {cliente.telefone}</div>
              <div><b>Nacionalidade:</b> {cliente.nacionalidade}</div>
              <div><b>Tipo Doc.:</b> {cliente.tipoDocumento} - <b>Número:</b> {cliente.numeroDocumento}</div>
              <div><b>Serviço:</b> {servico ? servico.nome : cliente.servico}</div>
              <div><b>Observações:</b> {cliente.observacoes}</div>
              <div><b>Cadastrado em:</b> {new Date(cliente.dataCadastro).toLocaleString()}</div>
              
              <h3 style={{marginTop: '20px'}}>Documentos</h3>
              {cliente.documentos && cliente.documentos.length > 0 ? (
                <ul>
                  {cliente.documentos.map((doc, idx) => (
                    <li key={idx}>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.nome}</a> 
                      ({new Date(doc.dataUpload).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              ) : (
                <div>Nenhum documento anexado</div>
              )}
              
              <div style={{marginTop: '20px'}}>
                <h3>Adicionar Documento</h3>
                <UploadDocumento clienteId={id} onUploadSuccess={handleUploadSuccess} />
              </div>
              
              <div style={{marginTop: '30px'}}>
                <button className="btn-cadastro" onClick={()=>navigate(`/editar-cliente/${id}`)}>
                  <span className="material-icons">edit</span> Editar Cliente
                </button>
              </div>
            </div>
          ) : (
            <div>Carregando...</div>
          )}
        </div>
      </div>
    </>
  );
}