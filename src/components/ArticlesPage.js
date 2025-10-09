import React, { useState, useRef, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';

// Компонент ImageSlider с автоматической прокруткой, без кнопок навигации
function ImageSlider({ images, interval = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = images.length;

  useEffect(() => {
    if (total === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % total);
    }, interval);
    return () => clearInterval(timer);
  }, [total, interval]);

  if (total === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <img
      src={currentImage.data}
      alt={currentImage.name}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}

function ArticlesPage({ isAdmin }) {
  const [articles, setArticles] = useState([]);
  const [newArticleText, setNewArticleText] = useState('');
  const [reactionCounts, setReactionCounts] = useState({});
  const [userReactions, setUserReactions] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [tempAttachments, setTempAttachments] = useState([]);

  const fileInputRef = useRef(null);

  // Загрузка данных из localStorage при монтировании
  useEffect(() => {
    const storedArticles = localStorage.getItem('articles');
    if (storedArticles) {
      try {
        setArticles(JSON.parse(storedArticles));
      } catch (e) {
        console.error('Ошибка парсинга articles:', e);
      }
    }
    const storedReactions = localStorage.getItem('reactionCounts');
    if (storedReactions) setReactionCounts(JSON.parse(storedReactions));
    const storedUserReactions = localStorage.getItem('userReactions');
    if (storedUserReactions) setUserReactions(JSON.parse(storedUserReactions));
  }, []);

  const saveToLocalStorage = (articlesArray) => {
    localStorage.setItem('articles', JSON.stringify(articlesArray));
  };

  const handleOpenFileDialog = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleAttachFileForNew = (files) => {
    const fileArray = Array.from(files);
    const readerPromises = fileArray.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, data: reader.result });
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readerPromises).then(newFiles => {
      setTempAttachments(prev => [...prev, ...newFiles]);
    });
  };

  const handleAddArticle = () => {
    if (newArticleText.trim() !== '') {
      const newArticle = {
        text: newArticleText,
        attachments: tempAttachments,
      };
      const newArticles = [...articles, newArticle];
      setArticles(newArticles);
      saveToLocalStorage(newArticles);
      setReactionCounts(prev => ({ ...prev, [newArticles.length - 1]: { '❤️': 0 } }));
      setNewArticleText('');
      setTempAttachments([]);
    }
  };

  const handleDeleteArticle = (index) => {
    const newArticles = [...articles];
    newArticles.splice(index, 1);
    setArticles(newArticles);
    saveToLocalStorage(newArticles);
    const newReactionCounts = { ...reactionCounts };
    delete newReactionCounts[index];
    setReactionCounts(newReactionCounts);
    const newUserReactions = { ...userReactions };
    delete newUserReactions[index];
    setUserReactions(newUserReactions);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditText(articles[index].text);
  };

  const handleSaveEdit = (index) => {
    const newArticles = [...articles];
    newArticles[index] = { ...newArticles[index], text: editText };
    setArticles(newArticles);
    saveToLocalStorage(newArticles);
    setEditingIndex(null);
  };

  const handleAttachFileForEdit = (index, files) => {
    const fileArray = Array.from(files);
    const readerPromises = fileArray.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, data: reader.result });
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readerPromises).then(newFiles => {
      const newArticles = [...articles];
      if (!newArticles[index]) return;
      const existingAttachments = newArticles[index].attachments || [];
      newArticles[index] = {
        ...newArticles[index],
        attachments: [...existingAttachments, ...newFiles],
        attachmentsCount: (existingAttachments.length + newFiles.length),
      };
      setArticles(newArticles);
      saveToLocalStorage(newArticles);
    });
  };

  const handleRemoveAttachment = (articleIndex, attachmentIndex) => {
    const newArticles = [...articles];
    const attachments = [...(newArticles[articleIndex].attachments || [])];
    attachments.splice(attachmentIndex, 1);
    newArticles[articleIndex] = {
      ...newArticles[articleIndex],
      attachments,
      attachmentsCount: attachments.length,
    };
    setArticles(newArticles);
    saveToLocalStorage(newArticles);
  };

  const handleReaction = (index, reaction) => {
    const userReactsForArticle = userReactions[index] || [];
    const isReacted = userReactsForArticle.includes(reaction);
    const prevCount = reactionCounts[index] || { '❤️': 0 };
    const newCounts = { ...prevCount };
    let updatedReacts;

    if (isReacted) {
      updatedReacts = userReactsForArticle.filter(r => r !== reaction);
      newCounts[reaction] = Math.max((newCounts[reaction] || 1) - 1, 0);
    } else {
      updatedReacts = [...userReactsForArticle, reaction];
      newCounts[reaction] = (newCounts[reaction] || 0) + 1;
    }

    const newReactionCounts = { ...reactionCounts, [index]: newCounts };
    const newUserReactions = { ...userReactions, [index]: updatedReacts };

    setReactionCounts(newReactionCounts);
    setUserReactions(newUserReactions);

    localStorage.setItem('reactionCounts', JSON.stringify(newReactionCounts));
    localStorage.setItem('userReactions', JSON.stringify(newUserReactions));
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) return '🖼️';
    if (['mp4', 'avi', 'mov', 'wmv'].includes(ext)) return '🎥';
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) return '📄';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return '🗜️';
    return '📎';
  };

  const renderAttachments = (attachments) => {
    if (!attachments || attachments.length === 0) return null;

    const images = attachments.filter(f => f.data && f.data.startsWith('data:image'));
    const otherFiles = attachments.filter(f => !(f.data && f.data.startsWith('data:image')));

    return (
      <div style={{ marginTop: '10px' }}>
        {images.length > 0 && (
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {images.map((img, idx) => (
              <img key={idx} src={img.data} alt={img.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
            ))}
          </div>
        )}
        {otherFiles.length > 0 && (
          <ImageSlider images={otherFiles} />
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Форма добавления статьи — только для админа */}
      {isAdmin && (
        <div style={styles.adminSection}>
          <h2 style={styles.heading}>Добавить статью</h2>
          <textarea
            placeholder="Введите текст статьи..."
            value={newArticleText}
            onChange={(e) => setNewArticleText(e.target.value)}
            rows={3}
            style={styles.textarea}
          />
          <div style={styles.fileSection}>
            <button style={styles.button} onClick={handleOpenFileDialog}>Прикрепить файлы</button>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              style={styles.fileInput}
              onChange={(e) => handleAttachFileForNew(e.target.files)}
            />
            {tempAttachments.length > 0 && (
              <div style={styles.attachmentsPreview}>
                <strong>Прикрепленные файлы:</strong>
                <ul style={styles.attachmentsList}>
                  {tempAttachments.map((file, idx) => (
                    <li key={idx}>{getFileIcon(file.name)} {file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button style={styles.button} onClick={handleAddArticle}>Добавить статью</button>
        </div>
      )}

      {/* Статьи */}
      <h3 style={styles.sectionTitle}>Статьи</h3>
      <div style={styles.articlesContainer}>
        {articles.map((article, index) => (
          <div key={index} style={styles.articleCard}>
            {/* Верхняя часть — изображение или слайдер */}
            <div style={styles.imageContainer}>
              {article.attachments && article.attachments.length > 0 ? (
                (() => {
                  const images = (article.attachments || []).filter(f => f.data && f.data.startsWith('data:image'));
                  const otherFiles = (article.attachments || []).filter(f => !(f.data && f.data.startsWith('data:image')));
                  if (images.length > 1) {
                    return <ImageSlider images={images} interval={3000} />;
                  } else if (images.length === 1) {
                    return (
                      <img
                        src={images[0].data}
                        alt="img"
                        style={styles.image}
                      />
                    );
                  } else if (otherFiles.length > 0) {
                    return (
                      <div style={styles.filesPreview}>
                        {otherFiles.map((f, idx) => (
                          <img key={idx} src={f.data} alt={f.name} style={styles.fileThumbnail} />
                        ))}
                      </div>
                    );
                  } else {
                    return <div style={styles.noImage}>Нет изображений</div>;
                  }
                })()
              ) : (
                <div style={styles.noImage}>Нет изображений</div>
              )}
            </div>

            {/* Текст и реакции/редактирование */}
            <div style={styles.contentSection}>
              {editingIndex === index ? (
                <>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={4}
                    style={styles.editTextarea}
                  />
                  {isAdmin && (
                    <div style={styles.adminButtons}>
                      <button
                        onClick={() => document.getElementById(`editFileInput-${index}`).click()}
                        style={styles.iconButton}
                        title="Прикрепить файлы"
                      >
                        📎
                      </button>
                      <input
                        type="file"
                        multiple
                        style={styles.fileInput}
                        id={`editFileInput-${index}`}
                        onChange={(e) => handleAttachFileForEdit(index, e.target.files)}
                      />
                    </div>
                  )}
                  {/* Вложения с возможностью удаления */}
                  <div style={styles.attachmentsBlock}>
                    <h4>Прикреплённые файлы:</h4>
                    {articles[index].attachments && articles[index].attachments.length > 0 ? (
                      <ul style={styles.attachmentsList}>
                        {articles[index].attachments.map((file, fileIdx) => (
                          <li key={fileIdx} style={styles.attachmentItem}>
                            {getFileIcon(file.name)} {file.name}
                            <button
                              onClick={() => handleRemoveAttachment(index, fileIdx)}
                              style={styles.deleteButton}
                            >
                              Удалить
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Нет вложений</p>
                    )}
                  </div>
                  <div style={styles.editButtons}>
                    <button onClick={() => handleSaveEdit(index)} style={styles.smallButton}>Сохранить</button>
                    <button onClick={() => setEditingIndex(null)} style={styles.smallButton}>Отмена</button>
                  </div>
                </>
              ) : (
                <>
                  <p style={styles.articleText}>{article.text}</p>
                  {/* Реакции — только для пользователей */}
                  {!isAdmin && (
                    <button
                      onClick={() => handleReaction(index, '❤️')}
                      style={{
                        ...styles.reactionButton,
                        color: userReactions[index]?.includes('❤️') ? 'red' : 'black'
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      ❤️ {reactionCounts[index]?.['❤️'] || 0}
                    </button>
                  )}

                  {/* Для админа — кнопки редактировать/удалить */}
                  {isAdmin && (
                    <div style={styles.adminButtons}>
                      <button onClick={() => handleEditClick(index)} style={styles.smallButton}>Редактировать</button>
                      <button onClick={() => handleDeleteArticle(index)} style={styles.smallButton}>Удалить</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Общие стили для адаптивности
const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  adminSection: {
    marginBottom: '30px',
  },
  heading: {
    marginBottom: '10px',
  },
  sectionTitle: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  textarea: {
    width: '100%',
    resize: 'vertical',
    padding: '8px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  fileSection: {
    marginTop: '10px',
  },
  button: {
    padding: '8px 12px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  fileInput: {
    display: 'none',
  },
  attachmentsPreview: {
    marginTop: '10px',
  },
  attachmentsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  attachmentsBlock: {
    marginTop: '10px',
  },
  attachmentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  deleteButton: {
    background: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '2px 8px',
    cursor: 'pointer',
  },
  editButtons: {
    marginTop: '10px',
  },
  smallButton: {
    padding: '6px 12px',
    marginRight: '10px',
    fontSize: '14px',
  },
  articleText: {
    margin: 0,
  },
  reactionButton: {
    marginTop: '10px',
    fontSize: '20px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    outline: 'none',
  },
  adminButtons: {
    marginTop: '10px',
    display: 'flex',
    gap: '10px',
  },
  imageContainer: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  filesPreview: {
    display: 'flex',
    gap: '5px',
    padding: '5px',
  },
  fileThumbnail: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
  },
  noImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: '#f0f0f0',
    fontSize: '14px',
    color: '#555',
  },
  contentSection: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
  },
  editTextarea: {
    width: '100%',
    resize: 'vertical',
    padding: '8px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  articleCard: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '100%',
    border: '1px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  articlesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  // медиазапросы можно добавить через CSS или использовать inline стили с media queries
};

// В этом примере мы используем inline стили для быстрых адаптивных решений.
// Для более профессиональной адаптивности рекомендуется вынести стили в CSS и использовать media queries.

export default ArticlesPage;