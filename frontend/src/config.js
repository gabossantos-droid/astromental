// Configuração de URLs baseada no ambiente
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Em produção, usa proxy do nginx
  : 'http://localhost:8081/api';  // Em desenvolvimento

export default API_BASE_URL;
