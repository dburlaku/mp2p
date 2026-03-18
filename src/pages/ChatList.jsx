import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadContacts, saveContacts } from '../utils/store';
import SearchContacts from '../components/SearchContacts';
import '../styles/chatlist.css';

const DEMO_CONTACTS = [
  { id: 'a1b2c3d4', name: 'Алексей', shortId: '7f3a9b2c...e4d1f08a', online: true, lastMsg: 'Проверь новый релиз', lastTime: '14:32' },
  { id: 'e5f6g7h8', name: 'Мария', shortId: '2c8e4f1a...b7d3a09e', online: true, lastMsg: 'Файл отправлен через relay', lastTime: '13:15' },
  { id: 'i9j0k1l2', name: 'Дмитрий', shortId: '9a1d7e3f...c2b8f04d', online: false, lastMsg: 'Соединение восстановлено', lastTime: 'Вчера' },
  { id: 'm3n4o5p6', name: 'Елена', shortId: '4f2a8c1e...d7b3e09a', online: false, lastMsg: 'Голосовой через TURN', lastTime: 'Вчера' },
];

export default function ChatList({ identity, onLogout }) {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [contacts] = useState(() => {
    const stored = loadContacts();
    return stored.length > 0 ? stored : DEMO_CONTACTS;
  });

  const handleSelectContact = (contact) => {
    navigate(`/chat/${contact.id}`);
  };

  return (
    <div className="chatlist-page">
      <header className="chatlist-header">
        <div className="header-left">
          <div className="my-avatar">{identity.displayName[0]?.toUpperCase()}</div>
          <div className="header-info">
            <span className="header-name">{identity.displayName}</span>
            <span className="header-status">
              <span className="status-dot online" />
              P2P-узел активен
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => setShowSearch(true)} title="Поиск контактов">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <button className="icon-btn" onClick={onLogout} title="Выйти">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      {showSearch && (
        <SearchContacts
          onClose={() => setShowSearch(false)}
          onSelect={(c) => { setShowSearch(false); handleSelectContact(c); }}
        />
      )}

      <div className="contact-list">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="contact-item"
            onClick={() => handleSelectContact(contact)}
          >
            <div className="contact-avatar">
              {contact.name[0]}
              <span className={`status-dot ${contact.online ? 'online' : 'offline'}`} />
            </div>
            <div className="contact-info">
              <div className="contact-top">
                <span className="contact-name">{contact.name}</span>
                <span className="contact-time">{contact.lastTime}</span>
              </div>
              <div className="contact-bottom">
                <span className="contact-last-msg">{contact.lastMsg}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="node-info-bar">
        <span className="node-label">Node ID:</span>
        <span className="node-id">{identity.shortId}</span>
        <span className="node-peers">4 peers connected</span>
      </div>
    </div>
  );
}
