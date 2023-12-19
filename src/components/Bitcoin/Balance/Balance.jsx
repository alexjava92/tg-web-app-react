import React, { useState, useEffect } from 'react';
import './Balance.css';

export const Balance = ({ balanceToBtc, balanceToRub }) => {
    const [animatedBtc, setAnimatedBtc] = useState(0);
    const [animatedRub, setAnimatedRub] = useState(0);

    const animateValue = (start, end, duration, setFunction, decimals) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const animatedValue = start + progress * (end - start);
            setFunction(Number(animatedValue.toFixed(decimals))); // Округляем до необходимого количества знаков после запятой
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    useEffect(() => {
        const btcValue = parseFloat(balanceToBtc) || 0;
        const rubValue = parseFloat(balanceToRub) || 0;
        animateValue(0, btcValue, 1000, setAnimatedBtc, 8); // Указываем 8 знаков после запятой для BTC
        animateValue(0, rubValue, 1000, setAnimatedRub, 2); // Указываем 2 знака после запятой для RUB
    }, [balanceToBtc, balanceToRub]);


    return (
        <div className='body_second'>
            <div className='balance'>{animatedBtc.toFixed(8)} BTC</div>
            <div className='balance'>{animatedRub.toFixed(2)} ₽</div>
        </div>
    );
};
