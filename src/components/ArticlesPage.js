import React, { useState, useEffect } from 'react'; // из 'react'
import { ref, onValue, push, set, get } from 'firebase/database'; // из 'firebase/database'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app, db } from './firebase';
const storage = getStorage(app);

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
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    files: [],
  });

  const [existingImages, setExistingImages] = useState([]);

  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpeg', 'jpg', 'gif', 'png'].includes(ext)) return 'images';
    if (['mp4', 'webm', 'ogg'].includes(ext)) return 'videos';
    return 'files';
  };

  const uploadFile = async (file, folder) => {
    const fileRef = storageRef(storage, `${folder}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const newFiles = [];

    for (const file of files) {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const previewUrl = URL.createObjectURL(file);
      newFiles.push({ file, url: previewUrl, type: isImage ? 'images' : isVideo ? 'videos' : 'files' });
    }

    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
    }));

    // Загружаем файлы на сервер и обновляем их URL
    for (const f of newFiles) {
      const uploadUrl = await uploadFile(f.file, f.type === 'images' ? 'images' : f.type === 'videos' ? 'videos' : 'files');
      setFormData((prev) => {
        const updatedFiles = prev.files.map((item) => {
          if (item === f) {
            return { ...item, url: uploadUrl };
          }
          return item;
        });
        return { ...prev, files: updatedFiles };
      });
    }
  };

  useEffect(() => {
    console.log('useEffect triggered');
    const articlesRef = ref(db, 'articles');
    const unsubscribe = onValue(
      articlesRef,
      (snapshot) => {
        const data = snapshot.val();
        console.log('Snapshot data:', data);
        if (data) {
          const articlesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          const filtered = isAdmin
            ? articlesArray
            : articlesArray.filter((a) => a.published);
          setArticles(filtered.reverse());
        } else {
          setArticles([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Firebase error:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [isAdmin]);

  const handleAddClick = () => {
    setFormData({ title: '', content: '', files: [] });
    setExistingImages([]); // при добавлении очищаем
    setIsAdding(true);
    setEditArticleId(null);
  };

  const handleEditClick = (article) => {
    setEditArticleId(article.id);
    setFormData({
      title: article.title,
      content: article.content,
      files: [], // файлы не загружаем заново
    });
    setExistingImages([... (article.images || [])]);
    setIsAdding(false);
  };

  const handleDeleteFile = async (fileObj, isExisting = false) => {
    if (isExisting) {
      const fileRef = storageRef(storage, fileObj);
      await deleteObject(fileRef);
      setExistingImages((prev) => prev.filter((item) => item !== fileObj));
    } else {
      setFormData((prev) => ({
        ...prev,
        files: prev.files.filter((item) => item !== fileObj),
      }));
    }
  };

  const handleDeleteArticle = (id) => {
    const refToDelete = ref(db, `articles/${id}`);
    set(refToDelete, null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditArticleId(null);
    setFormData({ title: '', content: '', files: [] });
    setExistingImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Объединяем существующие и новые изображения
    const imageUrls = existingImages; // существующие изображения
    const newImageUrls = formData.files
      .filter(f => !f.isUploading && f.type === 'images')
      .map(f => f.url);
    const allImages = [...imageUrls, ...newImageUrls];

    const newArticle = {
      title: formData.title,
      content: formData.content,
      images: allImages,
      videos: formData.files.filter(f => f.type === 'videos' && !f.isUploading).map(f => f.url),
      audios: formData.files.filter(f => f.type === 'files' && !f.isUploading).map(f => f.url),
      published: isAdmin ? true : false,
    };

    if (isAdding) {
      await set(push(ref(db, 'articles')), newArticle);
      setIsAdding(false);
    } else if (editArticleId) {
      await set(ref(db, `articles/${editArticleId}`), newArticle);
      setEditArticleId(null);
    }

    setFormData({ title: '', content: '', files: [] });
    setExistingImages([]);
  };

  // Удаление изображения из статьи
  const handleRemoveImageFromArticle = async (articleId, imageUrl) => {
    try {
      const articleRef = ref(db, `articles/${articleId}`);
      const snapshot = await get(articleRef);
      const articleData = snapshot.val();

      if (!articleData) return;

      const updatedImages = (articleData.images || []).filter((img) => img !== imageUrl);

      await set(articleRef, {
        ...articleData,
        images: updatedImages,
      });

      // Обновляем локально
      setArticles((prevArticles) => {
        return prevArticles.map((a) =>
          a.id === articleId ? { ...a, images: updatedImages } : a
        );
      });
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="article__title">Статьи</h1>

      {isAdmin && (
        <div className="addButtonContainer">
          {!isAdding && !editArticleId && (
            <button className="btn btn-primary" onClick={handleAddClick}>
              Добавить новую статью
            </button>
          )}
        </div>
      )}

      {(isAdding || editArticleId !== null) && (
        <form onSubmit={handleSubmit} className="form">
          <h2 className="formTitle">{isAdding ? 'Новая статья' : 'Редактировать статью'}</h2>
          {/* Заголовок */}
          <input
            type="text"
            placeholder="Заголовок"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            required
            className="form-input"
          />
          {/* Контент */}
          <textarea
            placeholder="Контент"
            value={formData.content}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            required
            rows={4}
            className="form-textarea"
          ></textarea>

          {/* Прикрепление файла */}
          <div className="file-upload">
            <label className="file-label" title="Прикрепить файл">
              📎
              <input
                type="file"
                accept="image/*,video/*,application/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </label>
            {/* Предпросмотр */}
            {formData.files.length > 0 && (
              <div className="previewContainer">
                {formData.files.map((f, index) => (
                  <div key={index} className="filePreview">
                    {f.type === 'images' ? (
                      <img src={f.url} alt="img" className="imagePreview" />
                    ) : f.type === 'videos' || (f.url && f.url.match(/\.(mp4|webm|ogg)$/)) ? (
                      <video src={f.url} controls className="videoPreview" />
                    ) : (
                      <div className="fileBox">Файл</div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(f)}
                      className="deleteButton"
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Для редактируемых статей: отображение существующих изображений с возможностью удаления */}
          {editArticleId && existingImages.length > 0 && (
            <div className="existingImagesContainer">
              <h4>Прикрепленные изображения</h4>
              {existingImages.map((imgUrl, index) => (
                <div key={index} className="existingImageItem">
                  <img src={imgUrl} alt="existing" className="existingImage" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImageFromArticle(editArticleId, imgUrl)}
                    className="deleteExistingImage"
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Кнопки */}
          <div className="buttonsGroup">
            <button type="submit" className="btn btn-success">
              Сохранить
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Отмена
            </button>
          </div>
        </form>
      )}

      {/* Карточки статей */}
      <div className="articlesList">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div
              key={article.id}
              className={`articleCard ${!article.images || article.images.length === 0 ? 'full-width' : ''}`}
            >
              <div className="articleContent">
                <h3 className="articleContent__title">{article.title}</h3>
                <p className="articleContent__content">{article.content}</p>
                <div className='adminButtons__wrap'>
                  {isAdmin && (
                    <div className="adminButtons">
                      <button className="btn btn-primary" onClick={() => handleEditClick(article)}>
                        Редактировать
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDeleteArticle(article.id)}>
                        Удалить
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {article.images && article.images.length > 0 ? (
                <div className="articleImageContainer">
                  {/* показываем первое изображение */}
                  <img
                    src={article.images[0]}
                    alt="Фото"
                    style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                  />
                </div>
              ) : (
                <div className="noPhotoBox">Нет фото</div>
              )}
            </div>
          ))
        ) : (
          <p className="noArticles">Нет статей для отображения</p>
        )}
      </div>
    </div>
  );
}

export default ArticlesPage;