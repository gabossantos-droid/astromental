# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Production stage
FROM nginx:alpine

# Instalar openssl para gerar certificados
RUN apk add --no-cache openssl

# Gerar certificados auto-assinados
RUN mkdir -p /etc/ssl/certs && \
    openssl req -x509 -newkey rsa:4096 -keyout /etc/ssl/certs/key.pem -out /etc/ssl/certs/cert.pem -days 365 -nodes -subj "/C=BR/ST=Estado/L=Cidade/O=Organizacao/CN=app.saudemental.icu"

# Copiar build para nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor portas
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
