# Explicação do Projeto Mental

## Visão Geral
O projeto "Mental" é uma aplicação web desenvolvida para ajudar crianças a lidar com emoções difíceis, como ansiedade, tristeza, e questões relacionadas ao TDAH e autismo. O coração da aplicação é um chatbot virtual chamado "Astro", um astronauta mirim de 11 anos que age como um amigo acolhedor e empático. O Astro guia as crianças através de conversas sobre sentimentos, oferecendo validação, exploração emocional e exercícios simples para alívio imediato.

## Tecnologias Utilizadas
- **Backend**: Node.js com Express.js para o servidor, integrado com a API do OpenAI para gerar respostas inteligentes do Astro. Utiliza Socket.io para comunicação em tempo real, CORS para permitir requisições cross-origin, e bibliotecas como Dagre e React Flow para possíveis visualizações de fluxos (ainda em desenvolvimento).
- **Frontend**: Aplicação React criada com Create React App, utilizando React 19 para a interface do usuário. Inclui testes com Jest e React Testing Library.
- **Outros**: Arquivos JSON para armazenar conversas, sessões e definições de funções; Markdown para instruções detalhadas do comportamento do Astro.

## Estrutura do Projeto
O projeto está organizado em duas pastas principais:
- **backend/**: Contém o servidor principal (`server.js`), configurações (`package.json`), instruções do Astro (`instrucoes-astro.md`), e arquivos de dados como `conversas.json` e `sessions.json`. Também inclui uma pasta `public/` com recursos estáticos.
- **frontend/**: Uma aplicação React padrão, com `src/` contendo componentes como `App.js`, estilos em `App.css`, e uma pasta `public/` com ícones e manifestos.

## Funcionalidades Principais
- **Chatbot Astro**: O Astro responde às mensagens das crianças seguindo regras estritas de empatia, exploração emocional e propostas de exercícios curtos. Ele sempre valida sentimentos, explora sensações físicas e contextos, e sugere atividades simples dentro do app.
- **Armazenamento de Conversas**: As interações são salvas em arquivos JSON para manter o histórico e adaptar respostas futuras.
- **Interface Amigável**: O frontend oferece uma experiência simples e infantil, focada na conversa com o Astro.
- **Protocolo de Emergência**: Se detectadas palavras-chave indicando perigo (como "me machucar" ou "suicídio"), o Astro direciona a criança a buscar ajuda de um adulto imediatamente.

## Como Rodar o Projeto
1. **Pré-requisitos**: Certifique-se de ter Node.js instalado. Configure a variável de ambiente `OPENAI_API_KEY` com sua chave da OpenAI.
2. **Backend**:
   - Navegue para a pasta `backend/`.
   - Execute `npm install` para instalar dependências.
   - Execute `node server.js` para iniciar o servidor na porta 8081.
3. **Frontend**:
   - Navegue para a pasta `frontend/`.
   - Execute `npm install` para instalar dependências.
   - Execute `npm start` para iniciar a aplicação React, que será acessível em `http://localhost:3000` (com proxy para o backend).
4. **Acesso**: Abra o navegador e acesse `http://localhost:3000` para interagir com o Astro.

## Regras de Comportamento do Astro
O Astro segue instruções detalhadas para garantir uma interação segura e terapêutica:
- Sempre valida sentimentos e evita positividade tóxica.
- Explora sensações físicas, contextos e pensamentos antes de propor exercícios.
- Sugere apenas atividades simples e executáveis dentro do app.
- Termina cada resposta com uma pergunta aberta e três botões para continuar a conversa.
- Em casos de emergência, prioriza a segurança da criança.

Este projeto visa ser uma ferramenta acessível e amigável para o bem-estar emocional infantil, promovendo empatia e autocuidado de forma lúdica e segura.
