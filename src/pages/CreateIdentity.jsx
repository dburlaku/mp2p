import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateKeyPair, generateNodeId, encryptIdentity, downloadFile, getPassphraseStrength } from '../utils/crypto';
import '../styles/create.css';

export default function CreateIdentity({ onRegister }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [passphraseConfirm, setPassphraseConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [creating, setCreating] = useState(false);

  const strength = getPassphraseStrength(passphrase);
  const passValid = passphrase.length >= 8;
  const passMatch = passphrase === passphraseConfirm;

  const handleFinish = async () => {
    setCreating(true);
    try {
      const keys = await generateKeyPair();
      const nodeId = generateNodeId();
      const identity = {
        displayName: displayName.trim(),
        publicKey: keys.publicKey,
        shortId: keys.shortId,
        nodeId,
        createdAt: Date.now(),
      };

      const encrypted = await encryptIdentity(identity, passphrase);
      downloadFile(encrypted, 'identity.mp2p');

      onRegister(identity);
    } catch (err) {
      console.error('Key generation failed:', err);
    } finally {
      setCreating(false);
    }
  };

  const steps = ['Имя', 'Секретная фраза', 'Подтверждение'];

  return (
    <div className="create-page">
      <div className="create-container">
        <button className="back-btn" onClick={() => step === 0 ? navigate('/') : setStep(step - 1)}>
          ← Назад
        </button>

        <div className="steps-indicator">
          {steps.map((s, i) => (
            <div key={s} className={`step-dot ${i < step ? 'done' : ''} ${i === step ? 'current' : ''} ${i > step ? 'future' : ''}`}>
              {i < step ? (
                <span className="step-check">✓</span>
              ) : (
                <span className="step-num">{i + 1}</span>
              )}
            </div>
          ))}
          <div className="step-line">
            <div className="step-line-progress" style={{ width: `${(step / (steps.length - 1)) * 100}%` }} />
          </div>
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
              onClick={() => setStep(1)}
            >
              Продолжить
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="step-content">
            <h2>Придумайте секретную фразу</h2>
            <p className="step-desc">
              Это ваш единственный ключ. Минимум 8 символов. Запомните её или запишите — мы не сможем её восстановить.
            </p>
            <div className="input-group">
              <label>Секретная фраза</label>
              <div className="password-wrapper">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Минимум 8 символов"
                  autoFocus
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass(!showPass)}
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {passphrase.length > 0 && (
                <div className={`strength-indicator strength-${strength.level}`}>
                  <div className="strength-bar">
                    <div className="strength-fill" />
                  </div>
                  <span className="strength-label">{strength.label}</span>
                </div>
              )}
            </div>
            <div className="input-group">
              <label>Повторите фразу</label>
              <input
                type={showPass ? 'text' : 'password'}
                value={passphraseConfirm}
                onChange={(e) => setPassphraseConfirm(e.target.value)}
                placeholder="Введите фразу ещё раз"
              />
              {passphraseConfirm && !passMatch && (
                <span className="inline-error">Фразы не совпадают</span>
              )}
            </div>
            <button
              className="btn btn-primary"
              disabled={!passValid || !passMatch || !passphraseConfirm}
              onClick={() => setStep(2)}
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
                <span className="preview-value">AES-256-GCM + PBKDF2</span>
              </div>
            </div>
            <div className="warning-box">
              <span className="warning-icon">!</span>
              <span>Ваша идентичность будет сохранена в файл <strong>identity.mp2p</strong> — храните его как пароль.</span>
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
      </div>
    </div>
  );
}
