import React, { useEffect, useState } from 'react';
import {getFees} from "./apiGetFees";


export const BitcoinNetworkFees = ({ onSelect }) => {
    const [fees, setFees] = useState([]);
    const [selectedFee, setSelectedFee] = useState('');

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const feesData = await getFees();
                const filteredFees = Object.entries(feesData)
                    .filter(([key]) => key !== 'minimumFee' && key !== 'halfHourFee')
                    .map(([key, value]) => {
                        let label;
                        if (key === 'fastestFee') {
                            label = 'Приоритет';
                        } else if (key === 'hourFee') {
                            label = 'Средняя';
                        } else if (key === 'economyFee') {
                            label = 'Обычная';
                        }
                        return {
                            label,
                            value,
                            satPerByte: value,
                        };
                    });
                setFees(filteredFees);
                setSelectedFee(filteredFees[0]); // Устанавливаем первое значение по умолчанию
            } catch (error) {
                console.error('Error fetching fees:', error);
            }
        };

        fetchFees();
    }, []);

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedFee(selectedValue);
        onSelect(selectedValue === '' ? '' : selectedValue);
    };


    return (
        <div>
            <label htmlFor="fee">Выберите комиссию:</label>
            <select id="fee" value={selectedFee} onChange={handleSelectChange}>
                <option value="">Выберите комиссию</option>
                {fees.map(({ label, value, satPerByte }, index) => (
                    <option key={index} value={satPerByte}>
                        {label} - {satPerByte} sat/b
                    </option>
                ))}
                <option value="">Установить свою</option>
            </select>
        </div>
    );
};
