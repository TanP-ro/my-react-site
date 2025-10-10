
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import app from './firebase';
import { ref, onValue, push, set } from 'firebase/database';
import { db } from './firebase'; // Убедитесь, что путь правильный и что файл экспортирует db

function ArticlesPage({ isAdmin }) {
  const getUserId = () => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', userId);
    }
    return userId;
  };

  const userId = getUserId();

  const [articles, setArticles] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editArticleId, setEditArticleId] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);

  // Загрузка статей
  useEffect(() => {
    const articlesRef = ref(db, 'articles');
    const unsubscribe = onValue(articlesRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Обновление данных из Firebase:', data);
      if (data) {
        const articlesArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        const filteredArticles = isAdmin
          ? articlesArray
          : articlesArray.filter(article => article.published);
        // Новые статьи сверху
        setArticles(filteredArticles.slice().reverse());
      } else {
        setArticles([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isAdmin]);

  const handleAddClick = () => {
    setFormData({ title: '', content: '' });
    setIsAdding(true);
  };

  const handleEditClick = (article) => {
    setEditArticleId(article.id);
    setFormData({ title: article.title, content: article.content });
  };

  const handleDelete = (id) => {
    const deleteRef = ref(db, `articles/${id}`);
    set(deleteRef, null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditArticleId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const articleData = {
      title: formData.title,
      content: formData.content,
    };

    if (isAdmin) {
      articleData.published = true;
    } else {
      articleData.published = false;
    }

    if (isAdding) {
      const newRef = push(ref(db, 'articles'));
      set(newRef, articleData).then(() => {
        setIsAdding(false);
      });
    } else if (editArticleId !== null) {
      const editRef = ref(db, `articles/${editArticleId}`);
      set(editRef, articleData).then(() => {
        setEditArticleId(null);
      });
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        {/* Прелоадер, можно заменить на любой другой компонент */}
        <p>Загрузка...</p>
      </div>
    );
  }

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
        {articles.length > 0 ? (
          articles.map((article) => (
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
              {isAdmin && (
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
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
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>Нет статей для отображения</p>
        )}
      </div>
    </div>
  );
}

export default ArticlesPage;