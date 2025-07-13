# AhnurInc/One

## Firebase Hosting

Este projeto está configurado para deploy automático no Firebase Hosting.

### URLs de produção
- https://ahnur-inc.web.app
- https://ahnur-inc.firebaseapp.com

### Workflow de deploy

O deploy é feito automaticamente quando o código é enviado para a branch `main`. O GitHub Actions compila o código e o envia para o Firebase Hosting.

Para desenvolvimento local:
```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento local
npm start

# Construir para produção
npm run build

# Testar build localmente com Firebase
firebase serve
```

### Configuração manual do Firebase

Se você precisar configurar o Firebase manualmente:

1. Instale o Firebase CLI: `npm install -g firebase-tools`
2. Faça login: `firebase login`
3. Execute: `firebase init` na raiz do projeto
4. Selecione Hosting e configure as opções
5. Deploy: `firebase deploy`

Última atualização: 2025-07-13