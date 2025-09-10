FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Criar arquivos necessários se não existirem
RUN touch /app/sessions.json && touch /app/conversas.json

# Expor porta
EXPOSE 8081

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
