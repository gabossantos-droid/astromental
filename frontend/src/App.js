import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import astroImage from './img/astro.jpg';
import API_BASE_URL from './config';

function App() {
  // --- Estados do Componente ---
  const [showInitialScreen, setShowInitialScreen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messageListRef = useRef(null);

  // --- Efeitos ---
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // Função para criar nova sessão
  const createNewSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/new-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setSessionId(data.sessionId);
      return data.sessionId;
    } catch (error) {
      console.error("Erro ao criar nova sessão:", error);
      return null;
    }
  };

  // --- Funções ---
  const sendMessage = async (messageText) => {
    if (!messageText) return;
    
    // Se não há sessão ativa, cria uma nova
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = await createNewSession();
      if (!currentSessionId) return;
    }

    setMessages(prev => [...prev, { type: 'user', text: messageText }]);
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText, sessionId: currentSessionId }),
      });
      if (!response.ok) {
        throw new Error('A resposta do servidor não foi OK');
      }
      const data = await response.json();
      // Adiciona a resposta do Astro
      setMessages(prev => [
        ...prev,
        { type: 'model', text: data.resposta }
      ]);
    } catch (error) {
      console.error("Erro ao contatar o backend:", error);
      setMessages(prev => [...prev, { type: 'model', text: 'Desculpe, tive um probleminha para me conectar. Tente novamente, por favor.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = async () => {
    // Limpa o estado
    setMessages([]);
    setInputValue('');
    setSessionId(null);
    setShowInitialScreen(true);
  };

  const handleInitialChoice = (feeling) => {
    setShowInitialScreen(false);
    const message = feeling === 'happy' ? 'Estou me sentindo bem hoje.' : 'Não estou me sentindo muito bem hoje.';
    sendMessage(message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
    setInputValue('');
  };

  // --- Renderização do Componente ---
  if (showInitialScreen) {
    return (
      <div className="astro-fullscreen">
        <header className="astro-header">
          <img src={astroImage} alt="Mascote Astro" className="astro-mascot" />
          <h1>Astro</h1>
        </header>
        <div className="astro-initial">
          <h2>Como você está se sentindo hoje?</h2>
          <div className="astro-emoji-buttons">
            <button onClick={() => handleInitialChoice('happy')} aria-label="Feliz">
              <span role="img" aria-label="Feliz">🙂</span>
            </button>
            <button onClick={() => handleInitialChoice('sad')} aria-label="Triste">
              <span role="img" aria-label="Triste">😔</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="astro-fullscreen">
      <header className="astro-header">
        <img src={astroImage} alt="Mascote Astro" className="astro-mascot" />
        <h1>Astro</h1>
        {!showInitialScreen && (
          <button 
            className="new-conversation-btn" 
            onClick={startNewConversation}
            title="Iniciar nova conversa"
          >
            🔄 Nova Conversa
          </button>
        )}
      </header>
      <div className="astro-main" ref={messageListRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`astro-msg ${msg.type}`}>{msg.text}</div>
        ))}
        {isLoading && (
          <div className="astro-msg model typing-indicator">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}
      </div>
      <form className="astro-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite sua mensagem..."
          aria-label="Digite sua mensagem"
          disabled={isLoading}
        />
        <button type="submit" disabled={!inputValue.trim() || isLoading} aria-label="Enviar mensagem">
          ➤
        </button>
      </form>
    </div>
  );
}

export default App;
