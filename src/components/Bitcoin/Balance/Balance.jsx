import React from 'react';
import './Balance.css';
import CountUp from 'react-countup'; // Default export, no curly braces needed

export const Balance = ({ balanceToBtc, balanceToRub }) => {
    return (
        <div className='body_second'>
            <div className='balance'>
                <CountUp end={parseFloat(balanceToBtc)} decimals={8} duration={1} /> BTC
            </div>
            <div className='balance'>
                <CountUp end={parseFloat(balanceToRub)} decimals={2} duration={1} /> ₽
            </div>
        </div>
    );
};