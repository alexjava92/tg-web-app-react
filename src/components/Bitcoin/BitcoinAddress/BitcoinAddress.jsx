import React, { useCallback, useEffect, useState } from 'react';
import './BitcoinAddress.css';
import '../../../GlobalStyle.css';
import { useTelegram } from '../../../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CopyToClipboard from 'react-copy-to-clipboard';

// Хук для работы с сервером
const useFetchBitcoinAddress = (chatId, setAddress) => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://e4f6-62-33-234-17.ngrok-free.app/web-new-bitcoin-address', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ chatId }),
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
        };

        fetchData();
    }, [chatId, setAddress]);
};

// Хук для работы с уведомлениями
const useCopyToClipboard = (text) => {
    const handleCopyAddress = useCallback(() => {
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
    }, []);

    return { handleCopyAddress };
};

const BitcoinAddress = () => {
    const { tg, chatId } = useTelegram();
    const backButton = tg.BackButton;
    const navigate = useNavigate();
    const [address, setAddress] = useState('');

    // Используем хуки для работы с сервером и уведомлениями
    useFetchBitcoinAddress(chatId, setAddress);
    const { handleCopyAddress } = useCopyToClipboard(address);

    useEffect(() => {
        // Показываем кнопку назад после загрузки данных
        backButton.show();
    }, [backButton]);

    backButton.onClick(() => {
        navigate(-1);
    });

    return (
        <div className={'body'}>
            <h3>Новый адрес биткоина:</h3>
            <p><code style={{ fontFamily: 'monospace' }}>{address}</code></p>
            <CopyToClipboard text={address}>
                <button className={'button'} onClick={handleCopyAddress}>
                    Скопировать адрес bitcoin
                </button>
            </CopyToClipboard>
            <ToastContainer />
        </div>
    );
};

export default BitcoinAddress;
