import React from 'react';

const address = 'bc1q84xfmq02lz9tqlndq24gqrxydgtya8er2dxxjf'

const BitcoinAddress = () => {
    return (
        <div>
            <h3>Новый адрес биткоина:</h3>
            <p>{address}</p>
        </div>
    );
};

export default BitcoinAddress