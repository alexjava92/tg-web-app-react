import React from 'react';
import './BitcoinAddress.css'

const address = 'bc1q84xfmq02lz9tqlndq24gqrxydgtya8er2dxxjf'

const BitcoinAddress = () => {
    return (
        <div className={'body'}>
            <h3>Новый адрес биткоина:</h3>
            <p>{address}</p>
        </div>
    );
};

export default BitcoinAddress