import React from 'react';
import './BouncingLoader.css'; // Убедитесь, что этот файл стилей подключен

export const BouncingLoader = () => {
    return (
        <div className="loader">
            <div className="tile"></div>
            <div className="tile" style={{ animationDelay: '0.2s' }}></div>
            <div className="tile" style={{ animationDelay: '0.4s' }}></div>
        </div>
    );
};

