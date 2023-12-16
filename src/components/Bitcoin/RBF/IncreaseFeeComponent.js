import React, { useState } from 'react';

export const IncreaseFeeComponent = ({ txHash, onClose, commission }) => {
    const [newFee, setNewFee] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const handleFeeChange = (e) => {
        setNewFee(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            // Здесь логика отправки новой комиссии используя txHash и newFee
            // Например: await sendNewFee(txHash, newFee);

            setStatusMessage('Комиссия успешно отправлена.');
        } catch (error) {
            setStatusMessage('Ошибка при отправке комиссии.');
        }
    };

    return (
        <div>
            <h3>Повысить комиссию за транзакцию</h3>
            <input type="number" value={newFee} onChange={handleFeeChange} />
            <button onClick={handleSubmit}>Отправить</button>
            <button onClick={onClose}>Отменить</button>
            {statusMessage && <div>{statusMessage}</div>}
        </div>
    );
};

