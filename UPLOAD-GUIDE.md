# Arquivos para Upload no Portainer

## Estrutura necessária para o ZIP:

```
astro-project.zip
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── server.js
│   ├── .env (com sua chave OpenAI)
│   ├── sessions.json
│   └── conversas.json
└── frontend/
    ├── Dockerfile
    ├── .dockerignore
    ├── nginx.conf
    ├── package.json
    ├── public/
    │   └── (todos os arquivos)
    └── src/
        └── (todos os arquivos)
```

## IMPORTANTE: 
- NÃO inclua node_modules/
- NÃO inclua .git/
- Coloque sua chave OpenAI real no .env do backend

## Passos para ZIP:
1. Crie uma pasta "astro-project"
2. Copie APENAS os arquivos listados acima
3. Compacte em ZIP
4. Upload no Portainer
