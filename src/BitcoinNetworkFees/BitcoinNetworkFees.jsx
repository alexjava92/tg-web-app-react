import React, { useState, useEffect } from 'react';
import { getFees } from './apiGetFees'; // Укажите правильный путь к вашему файлу с API-запросом

export const BitcoinNetworkFees = ({ onSelect }) => {
    const [fees, setFees] = useState([]);
    const [selectedCommission, setSelectedCommission] = useState('');

    useEffect(() => {
        // Вызывайте ваш API-запрос при монтировании компонента
        getFees()
            .then(data => {
                // Обновляем состояние с полученными данными
                setFees(data);
                // Если еще не выбрана комиссия, выберите первую из полученных
                if (!selectedCommission && data.length > 0) {
                    setSelectedCommission(data[0].satPerByte.toString());
                    onSelect(data[0].satPerByte.toString());
                }
            })
            .catch(error => {
                console.error('Error fetching fees:', error);
            });
    }, [onSelect, selectedCommission]);

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedCommission(selectedValue);
        onSelect(selectedValue);
    };

    return (
        <div>
            <label htmlFor="commission">Выберите комиссию:</label>
            <select id="commission" value={selectedCommission} onChange={handleSelectChange}>
                {fees.map(fee => (
                    <option key={fee.satPerByte} value={fee.satPerByte.toString()}>
                        {`${fee.name} (${fee.satPerByte} sat/b)`}
                    </option>
                ))}
            </select>
        </div>
    );
};
