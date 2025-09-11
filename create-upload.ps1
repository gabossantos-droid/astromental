# Criar package para upload

# Criar diretório temporário
New-Item -ItemType Directory -Force -Path "astro-upload"

# Copiar docker-compose.yml
Copy-Item "docker-compose.yml" "astro-upload/"

# Criar estrutura backend
New-Item -ItemType Directory -Force -Path "astro-upload/backend"
Copy-Item "backend/Dockerfile" "astro-upload/backend/"
Copy-Item "backend/.dockerignore" "astro-upload/backend/"
Copy-Item "backend/package.json" "astro-upload/backend/"
Copy-Item "backend/server.js" "astro-upload/backend/"
Copy-Item "backend/.env" "astro-upload/backend/"
Copy-Item "backend/sessions.json" "astro-upload/backend/"
Copy-Item "backend/conversas.json" "astro-upload/backend/"

# Criar estrutura frontend
New-Item -ItemType Directory -Force -Path "astro-upload/frontend"
Copy-Item "frontend/Dockerfile" "astro-upload/frontend/"
Copy-Item "frontend/.dockerignore" "astro-upload/frontend/"
Copy-Item "frontend/nginx.conf" "astro-upload/frontend/"
Copy-Item "frontend/package.json" "astro-upload/frontend/"
Copy-Item -Recurse "frontend/public" "astro-upload/frontend/"
Copy-Item -Recurse "frontend/src" "astro-upload/frontend/"

# Criar ZIP
Compress-Archive -Path "astro-upload/*" -DestinationPath "astro-project.zip" -Force

# Limpar diretório temporário
Remove-Item -Recurse -Force "astro-upload"

Write-Host "✅ Arquivo astro-project.zip criado com sucesso!"
Write-Host "📁 Faça upload deste arquivo no Portainer"
