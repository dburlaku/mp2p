import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/chatroom.css';

const DEMO_MESSAGES = {
  a1b2c3d4: [
    { id: 1, from: 'them', text: 'Привет, проверяешь новый билд?', time: '14:28', status: 'delivered' },
    { id: 2, from: 'me', text: 'Да, сейчас смотрю. Соединение стабильное', time: '14:29', status: 'read' },
    { id: 3, from: 'them', text: 'Отлично. Relay-ноды подключены, латенси ~45ms', time: '14:30', status: 'delivered' },
    { id: 4, from: 'me', text: 'Неплохо для P2P через NAT traversal', time: '14:31', status: 'read' },
    { id: 5, from: 'them', text: 'Проверь новый релиз', time: '14:32', status: 'delivered' },
  ],
  e5f6g7h8: [
    { id: 1, from: 'them', text: 'Отправляю файл через relay-ноду', time: '13:12', status: 'delivered' },
    { id: 2, from: 'me', text: 'Принято, расшифровка прошла', time: '13:14', status: 'read' },
    { id: 3, from: 'them', text: 'Файл отправлен через relay', time: '13:15', status: 'delivered' },
  ],
};

const CONTACT_NAMES = {
  a1b2c3d4: { name: 'Алексей', online: true },
  e5f6g7h8: { name: 'Мария', online: true },
  i9j0k1l2: { name: 'Дмитрий', online: false },
  m3n4o5p6: { name: 'Елена', online: false },
};

export default function ChatRoom({ identity }) {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState(DEMO_MESSAGES[contactId] || []);
  const [input, setInput] = useState('');
  const messagesEnd = useRef(null);
  const contact = CONTACT_NAMES[contactId] || { name: 'Неизвестный', online: false };

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: 'me',
      text: input.trim(),
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      status: 'sending',
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Simulate delivery
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, status: 'delivered' } : m))
      );
    }, 800);

    // Simulate read
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, status: 'read' } : m))
      );
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const statusIcon = (status) => {
    switch (status) {
      case 'sending': return '○';
      case 'delivered': return '◉';
      case 'read': return '◉◉';
      default: return '';
    }
  };

  return (
    <div className="chatroom">
      <header className="chat-header">
        <button className="back-btn" onClick={() => navigate('/chat')}>←</button>
        <div className="chat-contact-info">
          <div className="chat-avatar">{contact.name[0]}</div>
          <div>
            <div className="chat-contact-name">{contact.name}</div>
            <div className="chat-contact-status">
              <span className={`status-dot ${contact.online ? 'online' : 'offline'}`} />
              {contact.online ? 'В сети — прямое соединение' : 'Не в сети — сообщения через relay'}
            </div>
          </div>
        </div>
        <div className="chat-header-actions">
          <button className="icon-btn" title="Голосовой вызов">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
          </button>
          <button className="icon-btn" title="Информация о соединении">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </button>
        </div>
      </header>

      <div className="encryption-banner">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        Сообщения зашифрованы сквозным шифрованием E2E
      </div>

      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.from}`}>
            <div className="message-bubble">
              <span className="message-text">{msg.text}</span>
              <span className="message-meta">
                {msg.time}
                {msg.from === 'me' && (
                  <span className={`msg-status ${msg.status}`}>{statusIcon(msg.status)}</span>
                )}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEnd} />
      </div>

      <div className="chat-input-area">
        <div className="input-wrapper">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Сообщение..."
            rows={1}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22,2 15,22 11,13 2,9" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
