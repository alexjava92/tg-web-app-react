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
        console.log("API BTC:", balanceToBtc, "API RUB:", balanceToRub); // Для отладки
        const btcValue = parseFloat(balanceToBtc) || 0;
        const rubValue = parseFloat(balanceToRub) || 0;
        animateValue(0, btcValue, 1000, setAnimatedBtc);
        animateValue(0, rubValue, 1000, setAnimatedRub);
    }, [balanceToBtc, balanceToRub]);

    return (
        <div className='body_second'>
            <div className='balance'>{animatedBtc.toFixed(8)} BTC</div>
            <div className='balance'>{animatedRub.toFixed(2)} ₽</div>
        </div>
    );
};
