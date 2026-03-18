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
            <span className="feature-icon">◈</span>
            <div>
              <div className="feature-title">Прямое соединение</div>
              <div className="feature-desc">Peer-to-peer без посредников</div>
            </div>
          </div>
          <div className="feature">
            <span className="feature-icon">◇</span>
            <div>
              <div className="feature-title">Сквозное шифрование</div>
              <div className="feature-desc">Ваши ключи — ваши сообщения</div>
            </div>
          </div>
          <div className="feature">
            <span className="feature-icon">○</span>
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
