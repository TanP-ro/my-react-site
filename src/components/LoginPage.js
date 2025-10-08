import React, { useState } from 'react';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // состояние для прелоадера

  const handleLoginClick = () => {
    setIsLoading(true); // показываем прелоадер
    setError('');

    // Можно добавить небольшую задержку для эффекта
    setTimeout(() => {
      if (username === 'admin' && password === 'password123') {
        onLogin(true); // Админ
      } else if (username === 'user' && password === 'userpass') {
        onLogin(false); // обычный пользователь
      } else {
        setError('Неверное имя пользователя или пароль');
      }
      setIsLoading(false); // скрываем прелоадер
    }, 1000); // задержка 1 секунда для видимости прелоадера
  };

  return (
    <div className="login-page">
      {isLoading && (
        <div className="preloader">
          <div className="spinner"></div>
        </div>
      )}
      <div className="login-box">
        <h2>Вход в личный кабинет</h2>
        <input
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLoginClick} disabled={isLoading}>Войти</button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;