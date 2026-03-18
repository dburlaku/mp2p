import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSeedPhrase, generateKeyPair, generateNodeId } from '../utils/crypto';
import '../styles/create.css';

export default function CreateIdentity({ onRegister }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [keyData, setKeyData] = useState(null);
  const [creating, setCreating] = useState(false);

  const handleStart = () => {
    const seed = generateSeedPhrase();
    setSeedPhrase(seed);
    setStep(1);
  };

  const handleConfirmSeed = () => {
    setStep(2);
  };

  const handleFinish = async () => {
    if (!displayName.trim()) return;
    setCreating(true);
    try {
      const keys = await generateKeyPair();
      const nodeId = generateNodeId();
      const identity = {
        displayName: displayName.trim(),
        publicKey: keys.publicKey,
        shortId: keys.shortId,
        nodeId,
        seedPhrase,
        createdAt: Date.now(),
      };
      setKeyData(keys);
      onRegister(identity);
      setStep(3);
    } catch (err) {
      console.error('Key generation failed:', err);
    } finally {
      setCreating(false);
    }
  };

  const steps = ['Имя', 'Фраза', 'Подтверждение', 'Готово'];

  return (
    <div className="create-page">
      <div className="create-container">
        <button className="back-btn" onClick={() => step === 0 ? navigate('/') : setStep(step - 1)}>
          ← Назад
        </button>

        <div className="steps-indicator">
          {steps.map((s, i) => (
            <div key={s} className={`step-dot ${i <= step ? 'active' : ''} ${i === step ? 'current' : ''}`}>
              <span className="step-num">{i + 1}</span>
            </div>
          ))}
          <div className="step-line" />
        </div>

        {step === 0 && (
          <div className="step-content">
            <h2>Создание идентичности</h2>
            <p className="step-desc">
              Ваше имя будет видно контактам. Его можно изменить позже.
            </p>
            <div className="input-group">
              <label>Отображаемое имя</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Как вас будут видеть"
                maxLength={32}
                autoFocus
              />
              <span className="char-count">{displayName.length}/32</span>
            </div>
            <button
              className="btn btn-primary"
              disabled={!displayName.trim()}
              onClick={handleStart}
            >
              Сгенерировать ключи
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="step-content">
            <h2>Сид-фраза</h2>
            <p className="step-desc">
              Запишите эти 12 слов в надёжное место. Это единственный способ
              восстановить вашу идентичность.
            </p>
            <div className="seed-grid">
              {seedPhrase.split(' ').map((word, i) => (
                <div key={i} className="seed-word">
                  <span className="seed-num">{i + 1}</span>
                  <span className="seed-text">{word}</span>
                </div>
              ))}
            </div>
            <div className="warning-box">
              <span className="warning-icon">!</span>
              <span>Никому не показывайте эту фразу. Потеряв её, вы потеряете доступ к идентичности.</span>
            </div>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              Я записал(а) сид-фразу в безопасное место
            </label>
            <button
              className="btn btn-primary"
              disabled={!confirmed}
              onClick={handleConfirmSeed}
            >
              Продолжить
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h2>Подтверждение</h2>
            <p className="step-desc">
              Будут сгенерированы криптографические ключи для вашего P2P-узла.
            </p>
            <div className="identity-preview">
              <div className="preview-row">
                <span className="preview-label">Имя</span>
                <span className="preview-value">{displayName}</span>
              </div>
              <div className="preview-row">
                <span className="preview-label">Протокол</span>
                <span className="preview-value">ECDSA P-256</span>
              </div>
              <div className="preview-row">
                <span className="preview-label">Шифрование</span>
                <span className="preview-value">End-to-end AES-256</span>
              </div>
            </div>
            <button
              className="btn btn-primary"
              disabled={creating}
              onClick={handleFinish}
            >
              {creating ? 'Генерация ключей...' : 'Создать идентичность'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h2>Идентичность создана</h2>
            <p className="step-desc">
              Ваш P2P-узел готов к работе.
            </p>
            <div className="identity-card">
              <div className="id-avatar">{displayName[0]?.toUpperCase()}</div>
              <div className="id-name">{displayName}</div>
              <div className="id-key">{keyData?.shortId || '...'}</div>
              <div className="id-status">
                <span className="status-dot online" />
                Узел активен
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/chat')}>
              Перейти к мессенджеру
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
