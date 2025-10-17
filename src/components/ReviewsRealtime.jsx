import React, { useState, useEffect } from 'react';
import { ref, onValue, push, serverTimestamp, set, remove } from 'firebase/database';
import { db } from './firebase';

const currentUserId = 'user123'; // Идентификатор текущего пользователя

const ReviewsRealtime = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewText, setEditReviewText] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [newRating, setNewRating] = useState(0);

  const reviewsRef = ref(db, 'reviews');

  useEffect(() => {
    const unsubscribe = onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const reviewsArray = Object.entries(data).map(([id, review]) => ({ id, ...review }));
      setReviews(reviewsArray);
    });
    return () => {
      // Очистка слушателя
    };
  }, []);

  const handleAddReview = () => {
    if (newReview.trim() === '') return;

    const newReviewRef = push(reviewsRef);
    set(newReviewRef, {
      text: newReview,
      rating: newRating,
      userId: currentUserId, // добавляем ID текущего пользователя
      timestamp: serverTimestamp(),
    }).then(() => {
      setNewReview('');
      setNewRating(0);
    });
  };

  const handleDeleteReview = (id) => {
    const review = reviews.find(r => r.id === id);
    if (review.userId !== currentUserId) return; // только владелец
    const reviewRef = ref(db, `reviews/${id}`);
    remove(reviewRef);
  };

  const handleStartEdit = (review) => {
    if (review.userId !== currentUserId) return; // только владелец
    setEditReviewId(review.id);
    setEditReviewText(review.text);
    setEditRating(review.rating || 0);
  };

  const handleCancelEdit = () => {
    setEditReviewId(null);
    setEditReviewText('');
    setEditRating(0);
  };

  const handleSaveEdit = () => {
    const reviewRef = ref(db, `reviews/${editReviewId}`);
    set(reviewRef, {
      text: editReviewText,
      rating: editRating,
      userId: reviews.find(r => r.id === editReviewId).userId, // сохраняем авторство
      timestamp: serverTimestamp(),
    }).then(() => {
      handleCancelEdit();
    });
  };

  const handleUpdateRating = (id, rating) => {
    const review = reviews.find(r => r.id === id);
    if (review.userId !== currentUserId) return; // только владелец
    const reviewRef = ref(db, `reviews/${id}`);
    set(reviewRef, {
      text: review.text,
      rating,
      userId: review.userId,
      timestamp: serverTimestamp(),
    });
  };

  const handleStarClick = (id, star) => {
    handleUpdateRating(id, star);
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Форма добавления */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Добавить отзыв</h2>
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: '10px' }}
          placeholder="Оставьте свой отзыв..."
        />
        <div style={{ marginTop: '10px' }}>
          <span>Рейтинг: </span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setNewRating(star)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: star <= newRating ? 'gold' : 'gray',
              }}
            >
              ★
            </button>
          ))}
        </div>
        <button onClick={handleAddReview} style={{ marginTop: '10px' }}>Отправить отзыв</button>
      </div>

      {/* Список отзывов */}
      <div style={{ marginTop: '20px', flex: 1, overflowY: 'auto' }}>
        {reviews.length === 0 ? (
          <p>Нет отзывов пока.</p>
        ) : (
          [...reviews]
            .slice()
            .reverse()
            .map((review) => (
              <div
                key={review.id}
                style={{
                  marginBottom: '10px',
                  border: '1px solid #ccc',
                  padding: '10px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                {editReviewId === review.id ? (
                  // Режим редактирования
                  <div>
                    <textarea
                      value={editReviewText}
                      onChange={(e) => setEditReviewText(e.target.value)}
                      rows={3}
                      style={{ width: '100%', padding: '10px' }}
                    />
                    {/* Рейтинг для редактирования */}
                    <div style={{ marginTop: '10px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setEditRating(star)}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            color: star <= editRating ? 'gold' : 'gray',
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <button onClick={handleSaveEdit} style={{ marginRight: '10px', marginTop: '10px' }}>Сохранить</button>
                    <button onClick={handleCancelEdit} style={{ marginTop: '10px' }}>Отмена</button>
                  </div>
                ) : (
                  // Обычный просмотр
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        {review.text}
                        <div>
                          Рейтинг: {'★'.repeat(review.rating || 0)}{'☆'.repeat(5 - (review.rating || 0))}
                        </div>
                      </div>
                      <div>
                        {/* Можно ставить рейтинг только владельцу */}
                        {review.userId === currentUserId && (
                          <div>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleStarClick(review.id, star)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  fontSize: '20px',
                                  cursor: 'pointer',
                                  color: star <= (review.rating || 0) ? 'gold' : 'gray',
                                }}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Показывать кнопки только автору */}
                    {review.userId === currentUserId && (
                      <div style={{ marginTop: '10px' }}>
                        <button onClick={() => handleStartEdit(review)} style={{ marginRight: '10px' }}>Редактировать</button>
                        <button onClick={() => handleDeleteReview(review.id)} style={{ color: 'red' }}>Удалить</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ReviewsRealtime;