import React, { useState, useEffect } from 'react';
import './Balance.css';

export const Balance = ({ balanceToBtc, balanceToRub }) => {
    const [animatedBtc, setAnimatedBtc] = useState(0);
    const [animatedRub, setAnimatedRub] = useState(0);

    const animateValue = (start, end, duration, setFunction) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setFunction(start + progress * (end - start));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setFunction(end); // После завершения анимации устанавливаем конечное значение
            }
        };
        window.requestAnimationFrame(step);
    };

    useEffect(() => {
        // Удаляем пробелы перед преобразованием строки в число
        const btcValue = parseFloat(balanceToBtc.replace(/ /g, '')) || 0;
        const rubValue = parseFloat(balanceToRub.replace(/ /g, '')) || 0;
        animateValue(0, btcValue, 1000, setAnimatedBtc);
        animateValue(0, rubValue, 1000, setAnimatedRub);
    }, [balanceToBtc, balanceToRub]);

    // Округляем только для отображения
    const displayBtc = animatedBtc.toFixed(8);
    const displayRub = animatedRub.toFixed(2);

    return (
        <div className='body_second'>
            <div className='balance'>{displayBtc} BTC</div>
            <div className='balance'>{displayRub} ₽</div>
        </div>
    );
};
