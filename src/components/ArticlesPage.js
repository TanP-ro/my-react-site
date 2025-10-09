import React, { useState, useRef, useEffect } from 'react';

function ArticlesPage({ isAdmin }) {
  const [articles, setArticles] = useState([]);
  const [newArticleText, setNewArticleText] = useState('');
  const [reactionCounts, setReactionCounts] = useState({});
  const [userReactions, setUserReactions] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [tempAttachments, setTempAttachments] = useState([]);

  const fileInputRef = useRef(null);

  // Загрузка данных из localStorage
  useEffect(() => {
    const storedArticles = localStorage.getItem('articles');
    console.log('Загруженные статьи из localStorage:', storedArticles);
    if (storedArticles) {
      try {
        const parsedArticles = JSON.parse(storedArticles);
        setArticles(parsedArticles);
      } catch (e) {
        console.error('Ошибка парсинга articles:', e);
      }
    }
    const storedReactions = localStorage.getItem('reactionCounts');
    if (storedReactions) {
      try {
        setReactionCounts(JSON.parse(storedReactions));
      } catch (e) {
        console.error('Ошибка парсинга reactionCounts:', e);
      }
    }
    const storedUserReactions = localStorage.getItem('userReactions');
    if (storedUserReactions) {
      try {
        setUserReactions(JSON.parse(storedUserReactions));
      } catch (e) {
        console.error('Ошибка парсинга userReactions:', e);
      }
    }
  }, []);

  const saveToLocalStorage = (articlesArray) => {
    console.log('Сохраняем статьи:', articlesArray);
    localStorage.setItem('articles', JSON.stringify(articlesArray));
  };

  // Открытие диалога выбора файла
  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Обработка выбранных файлов для новой статьи
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

  // Добавление новой статьи
  const handleAddArticle = () => {
    if (newArticleText.trim() !== '') {
      const newArticle = {
        text: newArticleText,
        attachments: tempAttachments,
        attachmentsCount: tempAttachments.length
      };
      const newArticles = [...articles, newArticle];
      setArticles(newArticles);
      // Обновляем localStorage
      saveToLocalStorage(newArticles);
      
      // Обновляем реакции для новой статьи
      const newIndex = newArticles.length - 1;
      setReactionCounts(prev => ({ ...prev, [newIndex]: { '❤️': 0 } }));
      setNewArticleText('');
      setTempAttachments([]);
    }
  };

  // Удаление статьи
  const handleDeleteArticle = (index) => {
    const newArticles = [...articles];
    newArticles.splice(index, 1);
    setArticles(newArticles);
    saveToLocalStorage(newArticles);
    // Обновляем реакции
    const newReactionCounts = { ...reactionCounts };
    delete newReactionCounts[index];
    setReactionCounts(newReactionCounts);
    const newUserReactions = { ...userReactions };
    delete newUserReactions[index];
    setUserReactions(newUserReactions);
  };

  // Редактирование статьи
  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditText(articles[index].text);
  };

  // Сохранение редактированной статьи
  const handleSaveEdit = (index) => {
    const newArticles = [...articles];
    newArticles[index] = { ...newArticles[index], text: editText };
    setArticles(newArticles);
    saveToLocalStorage(newArticles);
    setEditingIndex(null);
  };

  // Обработка прикрепления файлов при редактировании
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
      if (!newArticles[index].attachments) {
        newArticles[index].attachments = [];
      }
      newArticles[index].attachments = [...newArticles[index].attachments, ...newFiles];
      newArticles[index].attachmentsCount = newArticles[index].attachments.length;
      setArticles(newArticles);
      saveToLocalStorage(newArticles);
    });
  };

  // Удаление вложений
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

  // Обработка реакции (лайка/дизлайка)
  const handleReaction = (index, reaction) => {
    const userReactsForArticle = userReactions[index] || [];
    const isReacted = userReactsForArticle.includes(reaction);
    const prevCount = reactionCounts[index] || { '❤️': 0 };
    const newCounts = { ...prevCount };
    let updatedReacts;

    if (isReacted) {
      // Удаление реакции
      updatedReacts = userReactsForArticle.filter(r => r !== reaction);
      newCounts[reaction] = Math.max((newCounts[reaction] || 1) - 1, 0);
    } else {
      // Добавление реакции
      updatedReacts = [...userReactsForArticle, reaction];
      newCounts[reaction] = (newCounts[reaction] || 0) + 1;
    }

    const newReactionCounts = { ...reactionCounts, [index]: newCounts };
    const newUserReactions = { ...userReactions, [index]: updatedReacts };

    setReactionCounts(newReactionCounts);
    setUserReactions(newUserReactions);

    // Сохраняем в localStorage
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
        {/* миниатюры изображений */}
        {images.length > 0 && (
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {images.map((img, idx) => (
              <img key={idx} src={img.data} alt={img.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
            ))}
          </div>
        )}
        {/* галерея для остальных файлов */}
        {otherFiles.length > 0 && (
          <ImageSlider images={otherFiles} />
        )}
      </div>
    );
  };

  // основной JSX
  return (
    <div style={{ padding: '20px' }}>
      <h1>Статьи</h1>

      {isAdmin && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Добавить новую статью</h2>
          <input
            type="text"
            placeholder="Введите текст статьи"
            value={newArticleText}
            onChange={(e) => setNewArticleText(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />

          {/* Файл + кнопка */}
          <button
            onClick={handleOpenFileDialog}
            style={{ fontSize: '24px', cursor: 'pointer', marginRight: '10px' }}
            title="Прикрепить файлы"
          >
            📎
          </button>
          <input
            type="file"
            multiple
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={(e) => handleAttachFileForNew(e.target.files)}
          />

          {/* выбранные файлы */}
          {tempAttachments.length > 0 && (
            <div>
              <h4>Выбранные файлы:</h4>
              <ul>
                {tempAttachments.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={handleAddArticle} style={{ padding: '8px 16px' }}>Добавить</button>
        </div>
      )}

      {/* Отображение статей */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {articles.map((article, index) => (
          <div key={index} style={{
            width: '300px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            background: '#fff'
          }}>
            {/* Верхняя часть — изображение или слайдер без кнопок */}
            <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
              {article.attachments && article.attachments.length > 0 ? (
                (() => {
                  const images = article.attachments.filter(f => f.data && f.data.startsWith('data:image'));
                  const otherFiles = article.attachments.filter(f => !(f.data && f.data.startsWith('data:image')));
                  if (images.length > 1) {
                    return <ImageSlider images={images} interval={3000} />;
                  } else if (images.length === 1) {
                    return (
                      <img
                        src={images[0].data}
                        alt="img"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    );
                  } else if (otherFiles.length > 0) {
                    return (
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {otherFiles.map((f, idx) => (
                          <img key={idx} src={f.data} alt={f.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                        ))}
                      </div>
                    );
                  } else {
                    return <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Нет изображений</div>;
                  }
                })()
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Нет изображений</div>
              )}
            </div>

            {/* Нижняя часть — текст и реакции/редактирование */}
            <div style={{ padding: '10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {editingIndex === index ? (
                <>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={4}
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                  {isAdmin && (
                    <div style={{ marginTop: '10px' }}>
                      <button
                        onClick={() => document.getElementById(`editFileInput-${index}`).click()}
                        style={{ fontSize: '20px', cursor: 'pointer' }}
                        title="Прикрепить файлы"
                      >
                        📎
                      </button>
                      <input
                        type="file"
                        multiple
                        style={{ display: 'none' }}
                        id={`editFileInput-${index}`}
                        onChange={(e) => handleAttachFileForEdit(index, e.target.files)}
                      />
                    </div>
                  )}
                  {/* список вложений с удалением */}
                  <div style={{ marginTop: '10px' }}>
                    <h4>Прикреплённые файлы:</h4>
                    {articles[index].attachments && articles[index].attachments.length > 0 ? (
                      <ul>
                        {articles[index].attachments.map((file, fileIdx) => (
                          <li key={fileIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {getFileIcon(file.name)} {file.name}
                            <button
                              onClick={() => handleRemoveAttachment(index, fileIdx)}
                              style={{
                                background: 'red',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                padding: '2px 8px'
                              }}
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
                  <div style={{ marginTop: '10px' }}>
                    <button onClick={() => handleSaveEdit(index)} style={{ marginRight: '10px' }}>Сохранить</button>
                    <button onClick={() => setEditingIndex(null)}>Отмена</button>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ margin: 0 }}>{article.text}</p>
                  {/* Реакции */}
                  {!isAdmin && (
                    <button
                      onClick={() => handleReaction(index, '❤️')}
                      style={{
                        marginTop: '10px',
                        fontSize: '20px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: userReactions[index]?.includes('❤️') ? 'red' : 'black',
                        outline: 'none',
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      ❤️ {reactionCounts[index]?.['❤️'] || 0}
                    </button>
                  )}

                  {isAdmin && (
                    <div style={{ marginTop: '10px' }}>
                      <button onClick={() => handleEditClick(index)} style={{ marginRight: '10px' }}>Редактировать</button>
                      <button onClick={() => handleDeleteArticle(index)}>Удалить</button>
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

export default ArticlesPage;