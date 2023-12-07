import React, {useEffect, useState} from 'react';
import ClipboardJS from 'clipboard';
import './BitcoinAddress.css';
import {useTelegram} from "../../../hooks/useTelegram";
import { useNavigate } from 'react-router-dom';

const address = 'bc1q84xfmq02lz9tqlndq24gqrxydgtya8er2dxxjf';

const BitcoinAddress = () => {
    const {tg} = useTelegram();
    const backButton = tg.BackButton
    const navigate  = useNavigate();
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleCopyAddress = () => {
        const clipboard = new ClipboardJS('.copy-button', {
            text: function () {
                return address;
            },
        });

        setIsButtonDisabled(true);

        clipboard.on('success', function (e) {
            console.log('Address copied to clipboard:', e.text);
            setIsButtonDisabled(false);
        });

        clipboard.on('error', function (e) {
            console.error('Error copying address to clipboard:', e.text);
            setIsButtonDisabled(false);
        });

        clipboard.destroy();
    };

    backButton.onClick(() => {
        console.log('BackButton clicked!');
        // Дополнительные действия при нажатии на кнопку "BackButton"
    });

    backButton.onClick(() => {
        console.log('BackButton clicked!');
        // Возвращаемся назад при нажатии кнопки "BackButton"
        navigate(-1);
    });
    // Отображаем кнопку "BackButton"
    backButton.show();

    return (
        <div className={'body'}>
            <h3>Новый адрес биткоина:</h3>
            <p>{address}</p>
            <button
                className="copy-button"
                onClick={handleCopyAddress}
                disabled={isButtonDisabled}
            >
                Копировать
            </button>
        </div>
    );
};

export default BitcoinAddress;
