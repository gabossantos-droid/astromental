# Deploy Astro - Portainer com Traefik

## Pré-requisitos
- Traefik já instalado e funcionando no Portainer
- DNS do domínio `app.saudemental.icu` apontando para o IP da VPS
- Rede `traefik` criada e configurada

## Passos para Deploy

### 1. Preparar arquivos
- Certifique-se de que todos os arquivos estão no local correto
- Configure sua chave da OpenAI

### 2. No Portainer
1. Vá em **Stacks**
2. Clique em **Add Stack**
3. Nome: `astro-app`
4. Selecione **Upload**
5. Faça upload do arquivo `docker-compose.yml`

### 3. Environment Variables
Adicione esta variável de ambiente:
```
OPENAI_API_KEY=sk-proj-sua_chave_aqui
```

### 4. Deploy
- Clique em **Deploy the stack**
- Aguarde o build (pode demorar alguns minutos)

### 5. Acesso
- **Aplicação**: `https://app.saudemental.icu`
- **Backend API**: `https://app.saudemental.icu/api`

### 6. Configuração DNS
Certifique-se de que o DNS está correto:
```
app.saudemental.icu A [IP_DA_VPS]
```

### 7. Monitoramento
- Veja logs em **Containers**
- Verifique health checks
- Monitore uso de recursos
- SSL será configurado automaticamente pelo Traefik

## Estrutura dos Containers
- **astro-backend**: Node.js (porta interna 8081)
- **astro-frontend**: Nginx (porta interna 80)
- **Volume**: sessions_data para persistir dados
- **Rede**: traefik (externa) + astro-network (interna)

## Labels Traefik Utilizadas
- Frontend: `app.saudemental.icu` (root)
- Backend: `app.saudemental.icu/api/*` (prefixo /api)
- SSL automático via Let's Encrypt
- Redirect HTTP → HTTPS automático

## Troubleshooting
- Se der erro de SSL, aguarde alguns minutos para o Let's Encrypt
- Verifique se o DNS está correto
- Certifique-se de que a rede `traefik` existe
- Verifique logs dos containers no Portainer
- Confirme que o Traefik está rodando e saudável
