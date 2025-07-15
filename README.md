# Ahnur - Sistema de Consultoria de Imigração

Sistema web de consultoria de imigração desenvolvido com Firebase Authentication e Material Design.

## 🎯 Funcionalidades

- ✅ **Tela de Login** com Material Design
- ✅ **Autenticação Firebase** integrada
- ✅ **Dashboard** com informações do sistema
- ✅ **Design Responsivo** (Desktop, Tablet, Mobile)
- ✅ **Validação de Formulários** em tempo real
- ✅ **Redirecionamento Automático** baseado em autenticação

## 🎨 Design

- **Cor Principal**: #2196F3 (Azul)
- **Cor Secundária**: #666666 (Cinza)
- **Estilo**: Material Design
- **Fontes**: Roboto, Material Icons
- **Responsivo**: Suporte completo para mobile

## 🚀 Como Usar

### 1. Clone o repositório
```bash
git clone https://github.com/AhnurInc/One.git
cd One
```

### 2. Sirva os arquivos localmente
```bash
# Usando Python 3
python3 -m http.server 8000

# Ou usando Node.js
npx serve .
```

### 3. Acesse no navegador
```
http://localhost:8000
```

## 📁 Estrutura do Projeto

```
/
├── index.html          # Página de login
├── dashboard.html      # Dashboard principal
├── css/
│   └── style.css      # Estilos Material Design
├── js/
│   ├── auth.js        # Lógica de autenticação
│   └── main.js        # Aplicação principal
└── assets/
    └── images/        # Recursos visuais
```

## 🔐 Configuração Firebase

O projeto já está configurado com Firebase Authentication:

- **Projeto**: ahnur-inc
- **Domínio**: ahnur-inc.firebaseapp.com
- **Autenticação**: Email/Senha

## 🔧 Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Autenticação**: Firebase Auth
- **Design**: Material Design
- **Icons**: Material Design Icons
- **Fonts**: Google Fonts (Roboto)

## 📱 Funcionalidades Implementadas

### Tela de Login
- Validação em tempo real de email e senha
- Feedback visual de erros
- Loading state no botão
- Redirecionamento automático após login

### Dashboard
- Informações do sistema
- Botão de logout
- Área para futuras funcionalidades
- Layout responsivo

### Autenticação
- Proteção de rotas
- Estado persistente
- Tratamento de erros
- Logout seguro

## 🌐 GitHub Pages

O projeto está configurado para deployment automático via GitHub Pages:
- URL: `https://ahnurinc.github.io/One/`
- Atualizações automáticas a cada push

## 🔮 Próximas Funcionalidades

- [ ] Gestão de Clientes
- [ ] Upload de Documentos
- [ ] Sistema de Agenda
- [ ] Relatórios e Analytics
- [ ] Notificações
- [ ] Multi-idioma

## 📝 Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

- **Ahnur Inc** - Desenvolvimento e Design

---

© 2024 Ahnur Inc. Todos os direitos reservados.