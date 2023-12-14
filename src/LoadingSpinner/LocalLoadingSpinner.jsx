import React from 'react';
import './LocalLoadingSpinner.css'; // Убедитесь, что вы создали этот CSS файл

const LocalLoadingSpinner = () => {
    return (
        <div className="local-loading-spinner">
            {/* Здесь ваша логика отображения индикатора загрузки */}
            <div className="spinner">Загрузка...</div>
        </div>
    );
};

export default LocalLoadingSpinner;