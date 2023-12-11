import React from 'react';
import './Balance.css'

export const Balance = ({ balanceToBtc, balanceToRub }) => {
    return (
        <div>
            <h2 className={'h2'}>Баланс:</h2>
            <div>{balanceToBtc} BTC</div>
            <div>{balanceToRub} ₽</div>
        </div>
    );
};