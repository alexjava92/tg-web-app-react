import React from 'react';

export const Balance = ({ balanceToBtc, balanceToRub }) => {
    return (
        <div>
            <h2>Баланс:</h2>
            <div>{balanceToBtc} BTC</div>
            <div>{balanceToRub} ₽</div>
        </div>
    );
};