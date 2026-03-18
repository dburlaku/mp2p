import { useState } from 'react';
import '../styles/search.css';

const DIRECTORY = [
  { id: 'q1w2e3r4', name: 'Иван Петров', shortId: '3a7f2d1e...8c4b9a0f', online: true },
  { id: 't5y6u7i8', name: 'Ольга Сидорова', shortId: '5e1c8a3f...2d7b4f0e', online: false },
  { id: 'o9p0a1s2', name: 'Артём Козлов', shortId: '8f4d2a7e...1c9b3e0a', online: true },
  { id: 'd3f4g5h6', name: 'Наталья Волкова', shortId: '1a9e3c7f...4d2b8f0c', online: false },
  { id: 'j7k8l9z0', name: 'Сергей Новиков', shortId: '6c2f8a1d...3e7b9d0f', online: true },
];

export default function SearchContacts({ onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState('name');

  const filtered = DIRECTORY.filter((c) => {
    const q = query.toLowerCase();
    if (!q) return true;
    if (searchMode === 'name') return c.name.toLowerCase().includes(q);
    return c.shortId.includes(q);
  });

  return (
    <div className="search-overlay">
      <div className="search-panel">
        <div className="search-header">
          <h3>Поиск контактов</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="search-mode-toggle">
          <button
            className={searchMode === 'name' ? 'active' : ''}
            onClick={() => setSearchMode('name')}
          >
            По имени
          </button>
          <button
            className={searchMode === 'id' ? 'active' : ''}
            onClick={() => setSearchMode('id')}
          >
            По Node ID
          </button>
        </div>

        <div className="search-input-wrap">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchMode === 'name' ? 'Имя контакта...' : 'Вставьте Node ID...'}
            autoFocus
          />
        </div>

        <div className="search-results">
          {filtered.length === 0 ? (
            <div className="no-results">
              <p>Контакты не найдены</p>
              <p className="no-results-hint">Попробуйте другой запрос или добавьте контакт по Node ID</p>
            </div>
          ) : (
            filtered.map((contact) => (
              <div
                key={contact.id}
                className="search-result-item"
                onClick={() => onSelect(contact)}
              >
                <div className="search-avatar">
                  {contact.name[0]}
                  <span className={`status-dot ${contact.online ? 'online' : 'offline'}`} />
                </div>
                <div className="search-result-info">
                  <span className="search-result-name">{contact.name}</span>
                  <span className="search-result-id">{contact.shortId}</span>
                </div>
                <button className="add-contact-btn">Добавить</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
