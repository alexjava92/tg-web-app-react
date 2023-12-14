import React from 'react';
import './LocalLoadingSpinner.css';
import {LoadingSpinner} from "./LoadingSpinner"; // Убедитесь, что вы создали этот CSS файл

const LocalLoadingSpinner = () => {
    return (
        <div className="local-loading-spinner">

            <div className="spinner">
                Загрузка
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
            </div>
        </div>
    );
};

export default LocalLoadingSpinner;