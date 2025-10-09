import React, { useState, useRef, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';

function ArticlesPage({ isAdmin }) {
  const initialArticles = [
    {
      id: 1,
      title: 'Как справляться со стрессом',
      content: 'Советы по управлению стрессом и тревогой...',
    },
    {
      id: 2,
      title: 'Психология отношений',
      content: 'Разбираемся в основах здоровых отношений...',
    },
  ];

  const getUserId = () => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', userId);
    }
    return userId;
  };

  const userId = getUserId();

  // Объявляем состояние для статей
  const [articles, setArticles] = useState(initialArticles);

  const [isAdding, setIsAdding] = useState(false);
  const [editArticleId, setEditArticleId] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const handleAddClick = () => {
    setFormData({ title: '', content: '' });
    setIsAdding(true);
  };

  const handleEditClick = (article) => {
    setEditArticleId(article.id);
    setFormData({ title: article.title, content: article.content });
  };

  const handleDelete = (id) => {
    setArticles(articles.filter((article) => article.id !== id));
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditArticleId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAdding) {
      const newArticle = {
        id: Date.now(),
        title: formData.title,
        content: formData.content,
      };
      setArticles([newArticle, ...articles]);
      setIsAdding(false);
    } else if (editArticleId !== null) {
      setArticles(
        articles.map((article) =>
          article.id === editArticleId
            ? { ...article, title: formData.title, content: formData.content }
            : article
        )
      );
      setEditArticleId(null);
    }
    setFormData({ title: '', content: '' });
  };

  // Убрали весь код лайков

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Статьи</h1>

      {isAdmin && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          {!isAdding && !editArticleId && (
            <button className="btn btn-primary" onClick={handleAddClick}>
              Добавить новую статью
            </button>
          )}
        </div>
      )}

      {(isAdding || editArticleId !== null) && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#f0f0f0',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px',
          }}
        >
          <h2>{isAdding ? 'Новая статья' : 'Редактировать статью'}</h2>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Заголовок"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <textarea
              placeholder="Контент"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={4}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            ></textarea>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-success">
              Сохранить
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Отмена
            </button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gap: '20px' }}>
        {articles.map((article) => (
          <div
            key={article.id}
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ marginBottom: '10px' }}>{article.title}</h3>
            <p>{article.content}</p>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* Удалили кнопку лайка */}
              {isAdmin && (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditClick(article)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(article.id)}
                  >
                    Удалить
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArticlesPage;