import React, { useEffect, useState } from 'react';
import {getFees} from "./apiGetFees";


export const BitcoinNetworkFees = ({ onSelect }) => {
    const [fees, setFees] = useState([]);
    const [selectedFee, setSelectedFee] = useState('');

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const feesData = await getFees();
                // Выбираем только необходимые комиссии и переименовываем их
                const filteredFees = {
                    Приоритет: feesData.fastestFee,
                    Средняя: feesData.hourFee,
                    Обычная: feesData.economyFee,
                };
                setFees(Object.values(filteredFees));
                setSelectedFee(Object.values(filteredFees)[0]); // Устанавливаем первое значение по умолчанию
            } catch (error) {
                console.error('Error fetching fees:', error);
            }
        };

        fetchFees();
    }, []);

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedFee(selectedValue);
        onSelect(selectedValue);
    };

    return (
        <div>
            <label htmlFor="fee">Выберите комиссию:</label>
            <select id="fee" value={selectedFee} onChange={handleSelectChange}>
                {fees.map((fee, index) => (
                    <option key={index} value={fee}>
                        {fee} sat/b
                    </option>
                ))}
            </select>
        </div>
    );
};
