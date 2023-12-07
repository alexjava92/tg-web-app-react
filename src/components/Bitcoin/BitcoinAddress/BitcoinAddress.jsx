import React from 'react';
import ClipboardJS from 'clipboard';
import './BitcoinAddress.css';

const address = 'bc1q84xfmq02lz9tqlndq24gqrxydgtya8er2dxxjf';

const BitcoinAddress = () => {
    const handleCopyAddress = () => {
        const clipboard = new ClipboardJS('.copy-button', {
            text: function () {
                return address;
            },
        });

        clipboard.on('success', function (e) {
            console.log('Address copied to clipboard:', e.text);
        });

        clipboard.on('error', function (e) {
            console.error('Error copying address to clipboard:', e.text);
        });

        clipboard.destroy();
    };

    return (
        <div className={'body'}>
            <h3>Новый адрес биткоина:</h3>
            <p>{address}</p>
            <button className="copy-button" onClick={handleCopyAddress}>
                Копировать
            </button>
        </div>
    );
};

export default BitcoinAddress;
