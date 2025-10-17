import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';

import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import ArticlesPage from './components/ArticlesPage';
import ReviewsRealtime from './components/ReviewsRealtime';
import LoginPage from './components/LoginPage'; // Ваша страница входа
import ContactsPage from './components/ContactsPage';

import './styles.css';

// Компонент прелоадера
function Preloader() {
  return (
    <div className="preloader">
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // для прелоадера

  const navigate = useNavigate();

  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    const storedAdmin = localStorage.getItem('isAdmin');

    if (storedLogin === 'true') {
      setIsLoggedIn(true);
      setIsAdmin(storedAdmin === 'true');
    }
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
    navigate('/'); // Возврат на главную
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    navigate('/'); // После выхода
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
      <header className="header" >
        <div className="container " style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Логотип */}
          <div className='header-wrapper'>

            {/* Логотип как отдельная ссылка */}
            <Link to="/" className="logo-link">
              <img src="/my-react-site/image/logo-black.png" alt="Логотип" width="150" height="150" />
            </Link>




            {/* Название и список */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0' }}>
              <div className='header__admin'>
                <div className="header-title" style={{ color: 'gold', fontSize: '1.5em' }}>
                  ПСИХОЛОГ | ВАЛЕРИЯ ЛЕОНЭЛЬ
                  {/* Меню или действия */}
                  {!isLoggedIn ? (
                    <li>
                      <Link className="header__link header__link--admin" to="/login" onClick={toggleMenu}></Link>
                    </li>
                  ) : (
                    <li>
                      <button className="header__link header__link--admin" onClick={handleLogout}>Выйти</button>
                    </li>
                  )}
                </div>
              </div>
              {/* Список ссылок */}
              <ul className='header-list' >
                {/* <a className="header-link" href="/#" onClick={(e) => { e.preventDefault(); toggleMenu(); }}></a> */}
                {/* <li><Link className="menu__link" to="/#" onClick={toggleMenu}>Главная</Link></li> */}
                <li><Link className="header__link" to="/about" onClick={toggleMenu}>Об эксперте</Link></li>
                <li><Link className="header__link" to="/services" onClick={toggleMenu}>Польза</Link></li>
                <li><Link className="header__link" to="/articles" onClick={toggleMenu}>Статьи</Link></li>
                <li><Link className="header__link" to="/reviews" onClick={toggleMenu}>Отзывы</Link></li>
                <li><Link className="header__link" to="/contacts" onClick={toggleMenu}>Контакты</Link></li>

                {/* <li>
                <a
                  className="header-link"
                  href="#contacts"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleMenu();
                    document.getElementById('header').scrollIntoView({ behavior: 'smooth' });
                  }}
                >
             
                </a>
              </li> */}
              </ul>
            </div>

            {/* Контакты */}
            {/* <div className="header__wrap">
              <h3 className="header__wrap-title">Контакты</h3>
              <div className="header-contacts" style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                <a className='hearer-vk'
                  href="https://vk.com/waliripsy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/my-react-site/image/logo-vk-z.png" alt="ВКонтакте" width="44" height="44" />
                </a>
                <a className='header-tg'
                  href="https://t.me/waliripsy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/my-react-site/image/icons8-телеграм-64.png" alt="Телеграм" width="44" height="44" />
                </a>
              </div>
            </div> */}
          </div>
        </div>

      </header >

      {/* Основной контент */}
      < div style={{ flex: 1 }
      }>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* Баннер */}
                <section className="blog-section">
                  {/* Левая часть: заголовок, описание, кнопка */}
                  <div className="blog-left">
                    <h2 className="blog-title">Валерия Леонэль</h2>
                    <p className="blog-description">
                      Психолог, психотерапевт, полиграфолог
                    </p>
                    <button
                      className="askPsychologist"
                      onClick={() => window.open('https://vk.com/waliripsy', '_blank')}
                    >
                      Записаться к специалисту
                    </button>
                  </div>
                  {/* Правая часть: фотография */}
                  <div className="blog-right">
                    <img className="profile-image"
                      src="/my-react-site/image/photo-glav.jpeg"
                      alt="Фотография Валерии Леонэль"

                    />
                  </div>
                </section>
              </>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/articles" element={<ArticlesPage isAdmin={isAdmin} />} />
          <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />
            }

          />
          <Route path="/reviews" element={<ReviewsRealtime />} />
          <Route path="/contacts" element={<ContactsPage />} />
        </Routes>
      </div >

      {/* Футер */}
      < footer id="footer" className="footer" >
        <div className='container' >
          <div className="footer__wrapper" >
            <p className="footer__title" >ПСИХОЛОГ | ВАЛЕРИЯ ЛЕОНЭЛЬ</p>

            <div className="footer__social">
              <h3 className="footer__wrap-title">Социальные сети</h3>
              <div className="footer__social-wrap" >
                <a className='footer-vk'
                  href="https://vk.com/waliripsy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/my-react-site/image/logo-vk-z.png" alt="ВКонтакте" width="44" height="44" />
                </a>
                <a className='footer-tg'
                  href="https://t.me/waliripsy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/my-react-site/image/icons8-телеграм-64.png" alt="Телеграм" width="44" height="44" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer >
    </div >
  );
}

export default function Main() {
  return (
    <Router>
      <App />
    </Router>
  );
}