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
            }
        };
        window.requestAnimationFrame(step);
    };

    useEffect(() => {
        animateValue(0, balanceToBtc, 1000, setAnimatedBtc); // 1000ms для анимации
        animateValue(0, balanceToRub, 1000, setAnimatedRub);
    }, [balanceToBtc, balanceToRub]);

    return (
        <div className='body_second'>
            <div className='balance'>{animatedBtc.toFixed(3)} BTC</div>
            <div className='balance'>{animatedRub.toFixed(2)} ₽</div>
        </div>
    );
};
