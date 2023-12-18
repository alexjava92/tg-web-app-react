import React, {useEffect, useState} from 'react';
import {sendReplaceByFee} from "../../../api/replaceByFee";
import './IncreaseFeeComponent.css'


export const IncreaseFeeComponent = ({txHash, onClose, commission, satByte, chatId, onNewTxHash}) => {
    const [newFee, setNewFee] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [newTxHash, setNewTxHash] = useState('');
    const [error, setError] = useState('');

    const handleFeeChange = (e) => {
        setNewFee(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            await sendReplaceByFee(chatId, parseFloat(newFee), txHash, setNewTxHash, setError);
            setStatusMessage(newTxHash || error);
        } catch (e) {
            setStatusMessage('Произошла ошибка');
        }
    };
    useEffect(() => {
        if (newTxHash) {
            onNewTxHash();
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
            <h3 className={'h3_fee'}>Введите новое значение комиссии, комиссия должна быть больше {satByte} sat/b</h3>
            <input className={'input_fee'}
                   type="number"
                   value={newFee}
                   placeholder={'Комиссия sat/b'}
                   onChange={handleFeeChange}/>
            <button className={'button_fee'} onClick={handleSubmit}>Отправить</button>
            <button className={'button_fee'} onClick={onClose}>Отменить</button>
            {statusMessage && <div>{statusMessage}</div>}
        </div>
    );
};

