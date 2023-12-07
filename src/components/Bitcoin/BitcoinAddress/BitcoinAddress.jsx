import React, {useEffect, useState} from 'react';
import ClipboardJS from 'clipboard';
import './BitcoinAddress.css';
import '../../../GlobalStyle.css'
import {useTelegram} from "../../../hooks/useTelegram";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        // Возвращаемся назад при нажатии кнопки "BackButton"
        navigate(-1);
    });
    // Отображаем кнопку "BackButton"
    backButton.show();

    tg.MainButton.show()
    tg.MainButton.setParams({
        text: `Скопировать адрес`
    })

    useEffect(() => {
        tg.MainButton.onClick(handleCopyAddress);
        return () => {
            tg.MainButton.offClick(handleCopyAddress);
        };
    }, [handleCopyAddress]);


    return (
        <div className={'body'}>
            <h3>Новый адрес биткоина:</h3>
            <p>{address}</p>
            <button
                className="button"
                onClick={handleCopyAddress}
                disabled={isButtonDisabled}
            >
                Копировать
            </button>
        </div>
    );
};

export default BitcoinAddress;
