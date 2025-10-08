import React from 'react';

const ServicesPage = () => {
    return (
        <div>
            <div className='serveces-page' style={{
                padding: '50px 20px',
                maxWidth: '1200px',
                margin: '40px auto',
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.6',



            }}>
                <h2 style={{
                    textAlign: 'center',
                    fontFamily: "'Imperial Script', cursive",
                    fontSize: '36px',
                    marginBottom: '30px',
                    color: '#4A5A6A',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                }}>Мои услуги </h2>

                {/* Карточки с услугами */}
                <div style={{ display: 'grid', gridTemplateColumns: "1fr 1fr 1fr", gap: '20px', flexWrap: "wrap" }}>
                    {/* Услуга 1 */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '15px',
                        padding: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                    >
                        <h3 style={{ marginBottom: '10px', color: '#2E3A59' }}>Индивидуальные консультации</h3>
                        <p style={{ color: '#555' }}>Персональные сеансы с психологом, направленные на решение конкретных проблем и развитие личностных ресурсов. Индивидуальный подход и конфиденциальность гарантированы.</p>
                    </div>

                    {/* Услуга 2 */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                    >
                        <h3 style={{ marginBottom: '10px', color: '#2E3A59' }}>Групповые тренинги</h3>
                        <p style={{ color: '#555' }}>Практические занятия в группе, направленные на развитие навыков коммуникации, стресс-менеджмента и эмоциональной устойчивости.</p>
                    </div>

                    {/* Услуга 3 */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                    >
                        <h3 style={{ marginBottom: '10px', color: '#2E3A59' }}>Мастер-классы и семинары</h3>
                        <p style={{ color: '#555' }}>Обучающие мероприятия и лекции по различным темам психологии, проводимые опытными специалистами. Возможность задать вопросы и получить практические советы.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
