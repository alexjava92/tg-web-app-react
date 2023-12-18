import React, {useEffect, useState} from 'react';
import {sendReplaceByFee} from "../../../api/replaceByFee";
import './IncreaseFeeComponent.css'

export const IncreaseFeeComponent = ({txHash, onClose, commission, satByte, chatId}) => {
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
            setStatusMessage(newTxHash);
        }
    }, [newTxHash]);

    useEffect(() => {
        if (error) {
            setStatusMessage(error);
        }
    }, [error]);


    return (
        <div>
            <h3>Повысить комиссию за транзакцию</h3>
            <input className={'input'}
                   type="number"
                   value={newFee}
                   placeholder={'Новая комиссия sat/b'}
                   onChange={handleFeeChange}/>
            <button onClick={handleSubmit}>Отправить</button>
            <button onClick={onClose}>Отменить</button>
            {statusMessage && <div>{statusMessage}</div>}
        </div>
    );
};

