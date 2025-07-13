# AhnurInc One

Um aplicativo web completo construído com React e Firebase.

## Descrição

AhnurInc One é uma plataforma de gerenciamento de projetos que permite aos usuários criar, organizar e acompanhar seus projetos e tarefas. O aplicativo oferece recursos como autenticação de usuários, gerenciamento de projetos, atribuição de tarefas e muito mais.

## Tecnologias Utilizadas

- React 18
- React Router 6
- Firebase (Authentication, Firestore, Storage, Hosting)
- Formik & Yup para formulários
- CSS puro para estilização

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/AhnurInc/One.git
cd One
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`
   - Preencha as variáveis com as suas credenciais do Firebase

4. Inicie o servidor de desenvolvimento:
```bash
npm start
```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── contexts/       # Context API para gerenciamento de estado
  ├── layouts/        # Layouts para diferentes partes do app
  ├── pages/          # Páginas do aplicativo
  │   ├── auth/       # Páginas de autenticação
  │   └── dashboard/  # Páginas do dashboard
  ├── firebase.js     # Configuração do Firebase
  └── App.js          # Componente principal com rotas
```

## Funcionalidades

- **Autenticação:** Login, registro, recuperação de senha
- **Dashboard:** Visão geral dos projetos e tarefas
- **Gerenciamento de Projetos:** Criar, editar, excluir projetos
- **Gerenciamento de Tarefas:** Adicionar, atualizar status, excluir tarefas
- **Perfil do Usuário:** Atualizar dados pessoais, foto de perfil
- **Configurações:** Alterar senha, preferências de notificação

## Deployment

O aplicativo está configurado para ser implantado automaticamente no Firebase Hosting quando houver push para a branch main.

### Implantação Manual

```bash
npm run build
firebase deploy
```

## Informações do Projeto

- **Última Atualização:** 2025-07-13 05:58:00
- **Autor:** AhnurIncContinue
- **Versão:** 1.0.0

## Licença

Este projeto está licenciado sob a Licença MIT.