import React, {useEffect, useState} from "react";
import {getFees} from "./apiGetFees";

export const BitcoinNetworkFees = ({ onSelect }) => {
    const [fees, setFees] = useState([]);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                // Получаем данные с сервера
                const feesData = await getFees();

                // Преобразуем объект в массив
                const feesArray = Object.entries(feesData).map(([key, value]) => ({
                    label: key,
                    value: value,
                    satPerByte: value,
                }));

                // Устанавливаем данные в state
                setFees(feesArray);
            } catch (error) {
                console.error('Error fetching fees:', error);
            }
        };

        fetchFees();
    }, []);

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        onSelect(selectedValue);
    };

    return (
        <div>
            <label htmlFor="commission">Выберите комиссию:</label>
            <select id="commission" onChange={handleSelectChange}>
                {fees.map((fee) => (
                    <option key={fee.value} value={fee.value}>
                        {fee.label} {fee.satPerByte} sat/b
                    </option>
                ))}
            </select>
        </div>
    );
};

