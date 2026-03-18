import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateKeyPair, generateNodeId } from '../utils/crypto';
import '../styles/create.css';

export default function RestoreIdentity({ onRegister }) {
  const navigate = useNavigate();
  const [seedInput, setSeedInput] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState('');

  const wordCount = seedInput.trim().split(/\s+/).filter(Boolean).length;

  const handleRestore = async () => {
    if (wordCount !== 12) {
      setError('Фраза должна содержать ровно 12 слов');
      return;
    }
    if (!displayName.trim()) {
      setError('Введите имя');
      return;
    }

    setRestoring(true);
    setError('');
    try {
      const keys = await generateKeyPair();
      const nodeId = generateNodeId();
      const identity = {
        displayName: displayName.trim(),
        publicKey: keys.publicKey,
        shortId: keys.shortId,
        nodeId,
        seedPhrase: seedInput.trim(),
        createdAt: Date.now(),
      };
      onRegister(identity);
      navigate('/chat');
    } catch (err) {
      setError('Ошибка восстановления: ' + err.message);
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="create-page">
      <div className="create-container">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Назад
        </button>

        <div className="step-content">
          <h2>Восстановление</h2>
          <p className="step-desc">
            Введите вашу сид-фразу из 12 слов для восстановления идентичности.
          </p>

          <div className="input-group">
            <label>Отображаемое имя</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ваше имя"
              maxLength={32}
            />
          </div>

          <div className="input-group">
            <label>Сид-фраза</label>
            <textarea
              value={seedInput}
              onChange={(e) => { setSeedInput(e.target.value); setError(''); }}
              placeholder="Введите 12 слов через пробел..."
              rows={4}
            />
            <span className="char-count">{wordCount}/12 слов</span>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button
            className="btn btn-primary"
            disabled={restoring || wordCount !== 12 || !displayName.trim()}
            onClick={handleRestore}
          >
            {restoring ? 'Восстановление...' : 'Восстановить идентичность'}
          </button>
        </div>
      </div>
    </div>
  );
}
