import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { decryptIdentity } from '../utils/crypto';
import '../styles/create.css';

export default function RestoreIdentity({ onRegister }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const readFile = (file) => {
    setError('');
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        JSON.parse(e.target.result);
        setFileContent(e.target.result);
        setStep(1);
      } catch {
        setError('Неверный формат файла');
      }
    };
    reader.readAsText(file);
  };

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  const handleRestore = async () => {
    setRestoring(true);
    setError('');
    try {
      const identity = await decryptIdentity(fileContent, passphrase);
      onRegister(identity);
      navigate('/chat');
    } catch {
      setError('Неверная секретная фраза или повреждённый файл');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="create-page">
      <div className="create-container">
        <button className="back-btn" onClick={() => step === 0 ? navigate('/') : setStep(0)}>
          ← Назад
        </button>

        {step === 0 && (
          <div className="step-content">
            <h2>Восстановление</h2>
            <p className="step-desc">
              Загрузите файл identity.mp2p, который был сохранён при создании идентичности.
            </p>

            <div
              className={`drop-zone ${dragOver ? 'drag-over' : ''} ${fileName ? 'has-file' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".mp2p,application/json"
                onChange={handleFilePick}
                hidden
              />
              {fileName ? (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d9e75" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                  </svg>
                  <span className="drop-zone-file">{fileName}</span>
                </>
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17,8 12,3 7,8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Перетащите файл сюда или нажмите для выбора</span>
                </>
              )}
            </div>

            {error && <div className="error-msg">{error}</div>}
          </div>
        )}

        {step === 1 && (
          <div className="step-content">
            <h2>Введите секретную фразу</h2>
            <p className="step-desc">
              Введите фразу, которую вы использовали при создании идентичности.
            </p>

            <div className="input-group">
              <label>Секретная фраза</label>
              <input
                type="password"
                value={passphrase}
                onChange={(e) => { setPassphrase(e.target.value); setError(''); }}
                placeholder="Ваша секретная фраза"
                autoFocus
              />
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button
              className="btn btn-primary"
              disabled={restoring || !passphrase}
              onClick={handleRestore}
            >
              {restoring ? 'Восстановление...' : 'Восстановить идентичность'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
