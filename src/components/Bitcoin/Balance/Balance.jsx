import React from 'react';
import './Balance.css'
import '../../../App.css'
import {Link} from "react-router-dom";

export const Balance = ({balanceToBtc, balanceToRub}) => {
    return (
        <div className={'body_second'}>
            {/*<h2 className={'h2'}>Баланс:</h2>*/}
            <div className={'balance'}>{balanceToBtc} BTC</div>
            <div className={'balance'}>{balanceToRub} ₽</div>
            <div className={'button_balance'}>
                <Link to="/send-bitcoin">
                    <button className={'button'} onClick={() => {
                    }}>Отправить
                    </button>
                </Link>
                <Link to="/bitcoin-address">
                    <button className={'button'} onClick={() => {
                    }}>Получить
                    </button>
                </Link>
            </div>
        </div>
    );
};