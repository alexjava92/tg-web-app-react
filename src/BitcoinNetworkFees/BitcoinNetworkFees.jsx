import React, {useContext, useEffect, useState} from 'react';
import { getFees } from "./apiGetFees";
import {convertBtcToRub, convertBtcToUsd, convertSatoshisToBitcoin} from "../calculator/convertSatoshisToBitcoin.mjs";
import './BitcoinNetworkFees.css'
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import LocalLoadingSpinner from "../LoadingSpinner/LocalLoadingSpinner";
import {CurrencyContext} from "../App";

export const BitcoinNetworkFees = ({ onSelect, virtualSize }) => {
    const [fees, setFees] = useState([]);
    const [selectedFee, setSelectedFee] = useState('');
    const [amountRubFinal, setAmountRubFinal] = useState('');
    const [isLoadingCommission, setIsLoadingCommission] = useState(false);
    const {showUsd} = useContext(CurrencyContext);

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
                        const amountUsd = await convertBtcToUsd(btcValue);
                        console.log(btcValue)
                        console.log(amountRub)
                        return {
                            label,
                            value,
                            satPerByte: value,
                            amountRub: Math.round(amountRub),
                            amountUsd: Math.round(amountUsd)
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

/*    const updateAmountRubFinal = async () => {
        const test = convertSatoshisToBitcoin(selectedFee * virtualSize);
        const amountRub = await convertBtcToRub(test);
        setAmountRubFinal(amountRub);
        setIsLoadingCommission(false);
    };

    useEffect(() => {
        if (selectedFee && virtualSize) {
            updateAmountRubFinal();
        }
    }, [selectedFee, virtualSize]);*/


    return (
        <div>
            <select id="fee" value={selectedFee} onChange={handleSelectChange} className={'select'}>
                <option value="" disabled hidden>Выберите комиссию</option>
                {fees.map(({ label, satPerByte, amountRub, amountUsd }, index) => (
                    <option key={index} value={satPerByte}>
                        {label} - {satPerByte} sat/b - {showUsd ? `${amountUsd} usd` : `${amountRub} руб`}
                    </option>
                ))}
                <option value="custom">Установить свою</option>
            </select>
           {/* <div className="your-specific-container">
                {isLoadingCommission ? <LocalLoadingSpinner /> : (amountRubFinal !== '' ? amountRubFinal : '')}
            </div>*/}
        </div>
    );
};
