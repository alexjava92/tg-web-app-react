import React, {useEffect, useState} from 'react';
import {sendReplaceByFee} from "../../../api/replaceByFee";
import './IncreaseFeeComponent.css'
import LocalLoadingSpinner from "../../../LoadingSpinner/LocalLoadingSpinner";


export const IncreaseFeeComponent = ({txHash, onClose, commission, satByte, chatId, onNewTxHash}) => {
    const [newFee, setNewFee] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [newTxHash, setNewTxHash] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFeeChange = (e) => {
        setNewFee(e.target.value);
    };

    const handleSubmit = async () => {
        setIsLoading(true); // Включаем индикатор загрузки
        try {
            await sendReplaceByFee(chatId, parseFloat(newFee), txHash, setNewTxHash, setError);
            setStatusMessage(newTxHash || error);
        } catch (e) {
            setStatusMessage('Произошла ошибка');
        } finally {
            setIsLoading(false); // Выключаем индикатор загрузки
        }
    };

    useEffect(() => {
        if (newTxHash) {
            // Установка таймера на 3 секунды
            const timer = setTimeout(() => {
                onNewTxHash();
            }, 3000);

            // Очистка таймера при размонтировании компонента
            return () => clearTimeout(timer);
        }
    }, [newTxHash]);


    useEffect(() => {
        if (newTxHash) {
            setStatusMessage(newTxHash);
        }
    }, [newTxHash]);

    useEffect(() => {
        if (error) {
            setStatusMessage(error);
        }
    }, [error]);


    return (
        <div className={'container_fee'}>

            {isLoading ? (
                <LocalLoadingSpinner /> // Отображаем индикатор загрузки
            ) : (
                <>
                    <h3 className={'h3_fee'}>Введите новое значение комиссии, комиссия должна быть больше {satByte} sat/b</h3>
                    <input className={'input_fee'}
                           type="number"
                           value={newFee}
                           placeholder={'Комиссия sat/b'}
                           onChange={handleFeeChange}/>
                    <button className={'button_fee'} onClick={handleSubmit}>Отправить</button>
                    <button className={'button_fee'} onClick={onClose}>Отменить</button>
                </>
            )}

            {statusMessage && <div className={'transaction-id'}>{statusMessage}</div>}
        </div>
    );
};

