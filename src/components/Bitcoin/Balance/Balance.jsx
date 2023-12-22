import React, {useState, useEffect} from 'react';
import './Balance.css';
import {convertBtcToUsd, formatNumberWithSpaces} from "../../../calculator/convertSatoshisToBitcoin.mjs";

export const Balance = ({balanceToBtc, balanceToRub, balanceToUsd}) => {
    const [animatedBtc, setAnimatedBtc] = useState(0);
    const [animatedRub, setAnimatedRub] = useState(0);
    const [animatedUsd, setAnimatedUsd] = useState(0);
    const [showUsd, setShowUsd] = useState(false);
    console.log('balanceToUsd', balanceToUsd)

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
        const usdValue = parseFloat(String(balanceToUsd).replace(/ /g, '')) || 0;
        animateValue(0, btcValue, 1000, setAnimatedBtc);
        animateValue(0, rubValue, 1000, setAnimatedRub);
        animateValue(0, usdValue, 1000, setAnimatedUsd);
    }, [balanceToBtc, balanceToRub, balanceToUsd]);


    const toggleCurrency = () => {
        setShowUsd(!showUsd);
    };

    return (
        <div className={'body_second'}>
            <div className={'balance'}>{animatedBtc.toFixed(8)} ₿</div>
            <div className={'balance'} onClick={toggleCurrency}>
                {showUsd ? `${formatNumberWithSpaces(animatedUsd.toFixed(2))} $`
                    : `${formatNumberWithSpaces(animatedRub.toFixed(2))} ₽`}
            </div>
        </div>
    );
};
