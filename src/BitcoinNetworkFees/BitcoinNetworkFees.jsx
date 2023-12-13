import React, { useEffect, useState } from 'react';
import { getFees } from "./apiGetFees";
import {convertBtcToRub, convertSatoshisToBitcoin} from "../calculator/convertSatoshisToBitcoin.mjs";
import './BitcoinNetworkFees.css'
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";

export const BitcoinNetworkFees = ({ onSelect, virtualSize }) => {
    const [fees, setFees] = useState([]);
    const [selectedFee, setSelectedFee] = useState('');
    const [amountRubFinal, setAmountRubFinal] = useState('');
    const [isLoadingCommission, setIsLoadingCommission] = useState(false);


    useEffect(() => {
        const fetchFeesAndRates = async () => {
            try {
                const feesData = await getFees();
                console.log(feesData)

                // Создаем массив промисов
                const feesPromises = Object.entries(feesData)
                    .filter(([key]) => key !== 'minimumFee' && key !== 'halfHourFee')
                    .map(async ([key, value]) => {
                        let label;
                        if (key === 'fastestFee') {
                            label = 'Приоритет';
                        } else if (key === 'hourFee') {
                            label = 'Средняя';
                        } else if (key === 'economyFee') {
                            label = 'Обычная';
                        }
                        const btcValue = convertSatoshisToBitcoin(value * virtualSize);
                        const amountRub = await convertBtcToRub(btcValue);
                        console.log(btcValue)
                        console.log(amountRub)
                        return {
                            label,
                            value,
                            satPerByte: value,
                            amountRub: Math.round(amountRub)
                        };
                    });

                // Ожидаем выполнения всех промисов
                const filteredFees = await Promise.all(feesPromises);
                setFees(filteredFees);
            } catch (error) {
                console.error('Error fetching fees and rates:', error);
            }
        };

        fetchFeesAndRates();
    }, [virtualSize]);


    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedFee(selectedValue);
        onSelect(selectedValue === 'custom' ? '' : selectedValue);
        setIsLoadingCommission(true);
    };

    const updateAmountRubFinal = async () => {
        const test = convertSatoshisToBitcoin(selectedFee * virtualSize);
        const amountRub = await convertBtcToRub(test);
        setAmountRubFinal(amountRub);
        setIsLoadingCommission(false);
    };

    useEffect(() => {
        if (selectedFee && virtualSize) {
            updateAmountRubFinal();
        }
    }, [selectedFee, virtualSize]);


    return (
        <div>
            <select id="fee" value={selectedFee} onChange={handleSelectChange} className={'select'}>
                <option value="" disabled hidden>Выберите комиссию</option>
                {fees.map(({ label, satPerByte, amountRub }, index) => (
                    <option key={index} value={satPerByte}>
                        {label} - {satPerByte} sat/b {/*- {amountRub} руб*/}
                    </option>
                ))}
                <option value="custom">Установить свою</option>
            </select>
            <div className="loading-or-result">
                {isLoadingCommission ? (
                    <div className="loading-container">
                        <LoadingSpinner />
                    </div>
                ) : (
                    amountRubFinal !== '' ? amountRubFinal : ''
                )}
            </div>
        </div>
    );
};
