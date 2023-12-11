// BitcoinInput.js
import React from 'react';

export const BitcoinInput = ({ bitcoinAmount, handleBitcoinAmountChange, bitcoinAddress, handleBitcoinAddressChange, isValidAddress, balanceToBtc }) => {
    return (
        <>
            <div>
                <input
                    className={'input'}
                    type="number"
                    id="bitcoinAmount"
                    value={bitcoinAmount}
                    min="0.000001"
                    max={balanceToBtc}
                    placeholder="Сумма минимум 0.000001"
                    onChange={handleBitcoinAmountChange}
                />
            </div>
            <div>
                <input
                    className={`input ${!isValidAddress ? 'invalid-text' : ''}`}
                    type="text"
                    id="bitcoinAddress"
                    value={bitcoinAddress}
                    placeholder="Адрес"
                    onChange={handleBitcoinAddressChange}
                />
            </div>
        </>
    );
};

