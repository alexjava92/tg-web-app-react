import React, { useState, useEffect } from 'react';
import './Balance.css';
import {formatNumberWithSpaces} from "../../../calculator/convertSatoshisToBitcoin.mjs";

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
        // Преобразуем значение в строку перед заменой
        const btcValue = parseFloat(String(balanceToBtc).replace(/ /g, '')) || 0;
        const rubValue = parseFloat(String(balanceToRub).replace(/ /g, '')) || 0;
        animateValue(0, btcValue, 2000, setAnimatedBtc);
        animateValue(0, rubValue, 2000, setAnimatedRub);
    }, [balanceToBtc, balanceToRub]);


    return (
        <div className={'body_second'}>
            <div className={'balance'}>{animatedBtc.toFixed(8)} ₿</div>
            <div className={'balance'}>{formatNumberWithSpaces(animatedRub.toFixed(2))} ₽</div>
        </div>
    );
};
