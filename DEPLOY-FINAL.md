# 🚀 Deploy Astro Mental no Portainer

## Repositório GitHub
**URL**: https://github.com/gabossantos-droid/astromental.git

## Passos para Deploy

### 1. Preparar o Repositório
Primeiro, faça push de todos os arquivos para o GitHub:

```powershell
# No diretório do projeto
cd "C:\Users\gabri\Documents\mental"
git init
git add .
git commit -m "Deploy inicial do Astro Mental"
git remote add origin https://github.com/gabossantos-droid/astromental.git
git push -u origin main
```

### 2. No Portainer da VPS

#### Opção A - Repository (RECOMENDADO)
1. **Stacks** → **Add Stack**
2. **Name**: `astro-mental`
3. **Build method**: **Repository**
4. **Repository URL**: `https://github.com/gabossantos-droid/astromental`
5. **Compose path**: `docker-compose.yml`
6. **Environment variables**:
   ```
   OPENAI_API_KEY=sk-proj-sua_chave_da_openai_aqui
   ```
7. **Deploy the stack**

#### Opção B - Web Editor (ALTERNATIVA)
1. **Stacks** → **Add Stack**
2. **Name**: `astro-mental`
3. **Build method**: **Web editor**
4. Cole o conteúdo do arquivo `docker-compose-github.yml`
5. **Environment variables**:
   ```
   OPENAI_API_KEY=sk-proj-sua_chave_da_openai_aqui
   ```
6. **Deploy the stack**

### 3. Verificar Deploy
- **Build**: Pode demorar 5-10 minutos
- **Logs**: Acompanhe pelo Portainer
- **Health**: Backend deve ficar "healthy"

### 4. Acesso
- **App**: https://app.saudemental.icu
- **API**: https://app.saudemental.icu/api/status

### 5. Troubleshooting

#### Se der erro de build:
- Verifique se todos os arquivos estão no GitHub
- Confirme que os Dockerfiles estão corretos
- Veja logs detalhados no Portainer

#### Se der erro de SSL:
- Aguarde alguns minutos para o Let's Encrypt
- Verifique se o DNS está correto:
  ```
  nslookup app.saudemental.icu
  ```

#### Se der erro de rede:
- Confirme que existe a rede `traefik`
- Verifique se o Traefik está rodando

### 6. Atualizações Futuras
Para atualizar o app:
1. Faça push das mudanças no GitHub
2. No Portainer: **Stacks** → **astro-mental** → **Update**
3. Clique em **Update the stack**

## 📋 Checklist Final
- [ ] Código no GitHub
- [ ] DNS configurado
- [ ] Traefik funcionando
- [ ] Chave OpenAI válida
- [ ] Deploy realizado
- [ ] App acessível via HTTPS

## 🎯 Resultado Esperado
- ✅ Frontend React funcionando
- ✅ Backend Node.js respondendo
- ✅ SSL automático pelo Traefik
- ✅ Chat com IA funcionando
- ✅ Sessões sendo salvas
