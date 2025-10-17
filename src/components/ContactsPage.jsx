import React from 'react';

function ContactsPage() {
  return (
    <div className="container">
      <h2 className="contacts-title">Контакты</h2>
      
      <h3 className="section-title">Социальные сети</h3>
      <ul className="contacts-list">
        <li className="contacts-item">
          ВКонтакте: <a className="contacts-link" href="https://vk.com/waliripsy" target="_blank" rel="noopener noreferrer">https://vk.com/waliripsy</a>
        </li>
        <li className="contacts-item">
          Телеграм: <a className="contacts-link" href="https://t.me/waliripsy" target="_blank" rel="noopener noreferrer">https://t.me/waliripsy</a>
        </li>
      </ul>
      
      <h3 className="section-title">Электронная почта</h3>
      <p className="email">waliripsy@example.com</p>
      
      <h3 className="section-title">Отдел заботы</h3>
      <p className="care-department">отдел заботы работает с 9:00 до 18:00 по будням.</p>
    </div>
  );
}

export default ContactsPage;