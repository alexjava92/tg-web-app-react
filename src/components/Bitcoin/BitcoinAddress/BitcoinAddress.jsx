import React, {useCallback, useEffect, useState} from 'react';
import './BitcoinAddress.css';
import '../../../GlobalStyle.css';
import {useTelegram} from '../../../hooks/useTelegram';
import {useNavigate} from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CopyToClipboard from 'react-copy-to-clipboard';


const BitcoinAddress = () => {
    const {tg, chatId} = useTelegram();
    const backButton = tg.BackButton;
    const navigate = useNavigate();
    const [address, setAddress] = useState('');

    const handleCopyAddress = () => {

        // Показываем уведомление об успешном копировании
        toast.success('Адрес скопирован', {
            position: 'top-center',
            autoClose: 300, // Закрытие через 3 секунды
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: {
                background: 'var(--tg-theme-secondary-bg-color)', // Задайте цвет фона
                color: 'var(--tg-theme-text-color)', // Задайте цвет текста
            },
        });

    };

    useEffect(async () => {

        try {
            const response = await fetch('https://e4f6-62-33-234-17.ngrok-free.app/web-new-bitcoin-address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({chatId}),
            });

            if (response.ok) {
                const responseData = await response.json();
                const newAddress = responseData.address.newAddress;
                setAddress(newAddress);
                console.log('Получен адрес:', newAddress);
            } else {
                console.error('Server returned an error:', response.status);
            }
        } catch (error) {
            console.error('Error fetching data from the server:', error);
        }
    }, [chatId]);


    backButton.onClick(() => {
        navigate(-1);
    });

    backButton.show();


    return (
        <div className={'body'}>
            <h3>Новый адрес биткоина:</h3>
            <p><code>{address}</code></p>
            <CopyToClipboard text={address}>
                <button className={'button'} onClick={handleCopyAddress}>Копировать</button>
            </CopyToClipboard>
            <ToastContainer/>
        </div>
    );
};

export default BitcoinAddress;
