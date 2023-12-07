import React, { useState } from 'react';
import './BitcoinAddress.css';
import '../../../GlobalStyle.css';
import { useTelegram } from '../../../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const address = 'bc1q84xfmq02lz9tqlndq24gqrxydgtya8er2dxxjf';

const BitcoinAddress = () => {
    const { tg } = useTelegram();
    const backButton = tg.BackButton;
    const navigate = useNavigate();
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(address)
            .then(() => {
                console.log('Address copied to clipboard:', address);
                setIsButtonDisabled(false);
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
                setIsButtonDisabled(false);
            });
    };

    backButton.onClick(() => {
        // Возвращаемся назад при нажатии кнопки "BackButton"
        navigate(-1);
    });

    // Отображаем кнопку "BackButton"
    backButton.show();

    tg.MainButton.show();
    tg.MainButton.setParams({
        text: `Скопировать адрес`,
    });

    // Устанавливаем обработчик события onClick
    tg.MainButton.onClick(handleCopyAddress);

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
            <ToastContainer />
        </div>
    );
};

export default BitcoinAddress;
