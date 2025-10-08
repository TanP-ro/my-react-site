import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';

import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import ArticlesPage from './components/ArticlesPage';

import LoginPage from './components/LoginPage'; // Ваша страница входа

import './styles.css';

// Компонент прелоадера
function Preloader() {
  return (
    <div className="preloader">
      <div className="spinner"></div>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // для прелоадера

  const navigate = useNavigate();

  // при монтировании читаем из localStorage
  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    const storedAdmin = localStorage.getItem('isAdmin');

    if (storedLogin === 'true') {
      setIsLoggedIn(true);
      setIsAdmin(storedAdmin === 'true');
    }
    // Имитируем задержку загрузки - 1 секунда
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (adminStatus) => {
    setIsAdmin(adminStatus);
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isAdmin', adminStatus ? 'true' : 'false');
    navigate('/'); // После входа возвращаемся на главную
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    navigate('/'); // После выхода на главную
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Хедер */}
      <header className="header">
        <div className="container" style={{ flex: 1 }}>
          {/* Бургер */}
          <div className="burger-container">
            <button className="burger" onClick={toggleMenu} aria-label="Меню">☰</button>
            <h1 className="main-title">Psychological Help Studio</h1>
            <div className="header__logo-wrapper">
              <img src="image/attachment (2).jpg" alt="Логотип" width="84" height="84" />
            </div>
          </div>
          {/* Навигация */}
          <nav className={`menu ${menuOpen ? 'show' : ''}`}>
            <button className="menu__close" onClick={toggleMenu} aria-label="Закрыть меню">&times;</button>
            <ul className="menu__list">
              <li><Link className="menu__link" to="/" onClick={toggleMenu}>Главная</Link></li>
              <li><Link className="menu__link" to="/about" onClick={toggleMenu}>О психологе</Link></li>
              <li><Link className="menu__link" to="/services" onClick={toggleMenu}>Польза</Link></li>
              <li><Link className="menu__link" to="/articles" onClick={toggleMenu}>Статьи</Link></li>
              <li>
                <a
                  className="menu__link"
                  href="#contacts"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleMenu();
                    // прокрутка к футеру
                    document.getElementById('footer').scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Контакты
                </a>
              </li>
              {!isLoggedIn ? (
                <li>
                  <Link className="menu__link" to="/login" onClick={toggleMenu}>Войти как админ</Link>
                </li>
              ) : (
                <li>
                  <button className="menu__link" onClick={handleLogout}>Выйти</button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Основной контент */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={
            <>
              {/* Баннер */}
              <section  className="banner">
                <img src="image/image-1 2.png" style={{height: '100%'}} alt="Фото баннера" className="banner__photo" />
                <button
                  className="askPsychologist"
                  onClick={() => window.open('https://vk.com/waliripsy', '_blank')}
                >
                  Задать вопрос психологу
                </button>
                {/* Текст под баннером */}
                <div className="banner__bottom-text">
                  <p>
                    Валерия Леонель! <br />
                    Практикующий психолог, полиграфолог, телесно-ориентированный психотерапевт, специалист по работе с психологическими травмами, мультимодальный супервизор.
                  </p>
                </div>
              </section>
              {/* Остальной контент */}
              <section className="banner__wrapper">
                <h2 id="banner__wrapper-title">Валерия Леонэль</h2>
                <p id="banner__wrapper-text">
                  Практикующий психолог, полиграфолог, телесно-ориентированный психотерапевт, специалист по работе с психологическими травмами, мультимодальный супервизор.
                </p>
              </section>
            </>
          } />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/articles" element={<ArticlesPage isAdmin={isAdmin} />} />
          {/* Страница логина */}
          <Route path="/login" element={
            isLoggedIn ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />
          } />
        </Routes>
      </div>

      {/* Футер */}
      <footer id="footer" className="footer">
        <div className="footer__wrapper">
          <p className="footer__title">ПСИХОЛОГ | ВАЛЕРИЯ ЛЕОНЭЛЬ</p>
          {/* Добавляем надпись "Контакты" */}


          <div className="footer__social">
            <h3 className="footer__contacts-title">Контакты</h3>
                <div className="footer__social-wrap">
            <a
              href="https://vk.com/waliripsy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="image/logo-vk-z.png" alt="ВКонтакте" width="64" height="64" />
            </a>
            <a
              href="https://t.me/freeleoness"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="image/icons8-телеграм-64.png" alt="Телеграм" width="64" height="64" />
            </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Main() {
  return (
    <Router>
      <App />
    </Router>
  );
}