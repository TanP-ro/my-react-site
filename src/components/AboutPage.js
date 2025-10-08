import React from 'react';

const AboutPage = () => {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Заголовок */}
      <h2 style={{ textAlign: 'center', fontFamily: 'Imperial Script, cursive', fontSize: '28px', marginBottom: '20px' }}>О психологе</h2>
      
      {/* Фото с слоганом */}
      <div style={{ position: 'relative', width: '500px', margin: '0 auto 30px' }}>
        <img
          src="image/image-2.jpeg"
          alt="Фото на кресле Валерия Леонэль"
          style={{
            width: '100%',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            display: 'block'
          }}
        />
        {/* Слоган в правом нижнем углу */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '14px',
          maxWidth: '80%',
          textAlign: 'right'
        }}>
          Помогу быть честным с собой, слушать себя и свое тело
        </div>
      </div>

      {/* Секция: Биография */}
      <section  className="about-biography" style={{ marginBottom: '30px' }}>
        <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: '22px', marginBottom: '10px' }}>Биография</h3>
        
        <p>
          Валерия использует индивидуальный подход к каждому клиенту, сочетая современные техники и классические методы психотерапии. Ее цель — помочь вам понять себя глубже и обрести новые силы для решения жизненных задач.
        </p>
      </section>

      {/* Секция: Образование и квалификация */}
      <section className="about-education" style={{ marginBottom: '30px' }}>
        <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: '22px', marginBottom: '10px' }}>Образование и квалификация</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Магистр психологии, Московский государственный университет</li>
          <li>Курс телесно-ориентированной терапии, Институт психотерапии</li>
          <li>Сертификация по мультимодальному подходу, Академия психотерапии</li>
        </ul>
      </section>

      {/* Секция: Подходы и методы работы */}
      <section className="about-methods" style={{ marginBottom: '30px' }}>
        <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: '22px', marginBottom: '10px' }}>Подходы и методы работы</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Телесно-ориентированная терапия</li>
          <li>Мультимодальный подход</li>
          <li>Когнитивно-поведенческая терапия</li>
          <li>Гештальт-терапия</li>
        </ul>
      </section>

      {/* Секция: Опыт */}
      <section className="about-test">
        <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: '22px', marginBottom: '10px' }}>Опыт</h3>
        <p>
          Более 10 лет практики в области психотерапии. Работала с клиентами разных возрастов и с разными проблемами, включая тревожные состояния, депрессию, межличностные конфликты и профессиональные трудности.
        </p>
      </section>

    </div>
  );
};

export default AboutPage;