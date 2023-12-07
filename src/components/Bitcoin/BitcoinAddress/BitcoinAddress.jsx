import React, {useCallback, useEffect, useState} from 'react';
import './BitcoinAddress.css';
import '../../../GlobalStyle.css';
import {useTelegram} from '../../../hooks/useTelegram';
import {useNavigate} from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const address = 'bc1q84xfmq02lz9tqlndq24gqrxydgtya8er2dxxjf';

const BitcoinAddress = () => {
    const {tg, chatId} = useTelegram();
    const backButton = tg.BackButton;
    const navigate = useNavigate();

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(address)
            .then(() => {
                console.log('Address copied to clipboard:', address);

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
            })
            .catch((error) => {
                console.error('Error copying address to clipboard:', error);
            });
    };

    useEffect(() => {
        const data = {
            chatId: chatId
        }
        fetch('https://e4f6-62-33-234-17.ngrok-free.app/web-new-bitcoin-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data) // Убедитесь, что передаете правильные данные
        })

    }, [chatId])

    useEffect(() => {
        tg.MainButton.onClick(handleCopyAddress);

        return () => {
            tg.MainButton.offClick(handleCopyAddress);
            tg.MainButton.hide();
        };
    }, [tg.MainButton, handleCopyAddress]);

    backButton.onClick(() => {
        navigate(-1);
    });

    backButton.show();

    tg.MainButton.show();
    tg.MainButton.setParams({
        text: 'Скопировать адрес',
    });
    return (
        <div className={'body'}>
            <h3>Новый адрес биткоина:</h3>
            <p>{address}</p>
            <ToastContainer/>
        </div>
    );
};

export default BitcoinAddress;
