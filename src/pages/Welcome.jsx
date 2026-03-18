import { useNavigate } from 'react-router-dom';
import '../styles/welcome.css';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome">
      <div className="welcome-content">
        <div className="welcome-logo">
          <div className="logo-ring">
            <div className="logo-ring-inner" />
          </div>
        </div>

        <h1 className="welcome-title">mp2p</h1>
        <p className="welcome-subtitle">
          Связь, которая не обрывается
        </p>

        <div className="welcome-features">
          <div className="feature">
            <span className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="6" cy="12" r="3" /><circle cx="18" cy="6" r="3" /><circle cx="18" cy="18" r="3" />
                <path d="M8.7 10.7L15.3 7.3M8.7 13.3L15.3 16.7" />
              </svg>
            </span>
            <div>
              <div className="feature-title">Прямое соединение</div>
              <div className="feature-desc">Peer-to-peer без посредников</div>
            </div>
          </div>
          <div className="feature">
            <span className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </span>
            <div>
              <div className="feature-title">Сквозное шифрование</div>
              <div className="feature-desc">Ваши ключи — ваши сообщения</div>
            </div>
          </div>
          <div className="feature">
            <span className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L3 7l9 5 9-5-9-5z" /><path d="M3 17l9 5 9-5" /><path d="M3 12l9 5 9-5" />
              </svg>
            </span>
            <div>
              <div className="feature-title">Устойчивая доставка</div>
              <div className="feature-desc">Сообщение дойдёт, что бы ни блокировали</div>
            </div>
          </div>
        </div>

        <div className="welcome-actions">
          <button className="btn btn-primary" onClick={() => navigate('/create')}>
            Создать идентичность
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/restore')}>
            Восстановить из фразы
          </button>
        </div>
      </div>
    </div>
  );
}
