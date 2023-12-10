import React, { useEffect, useState } from 'react';
import { getFees } from "./apiGetFees";
import {fetchBitcoinPrices} from "../api/Blockchain/BlockchainRate.mjs";
import {convertSatoshisToBitcoin} from "../calculator/convertSatoshisToBitcoin.mjs";


export const BitcoinNetworkFees = ({ onSelect }) => {
    const [fees, setFees] = useState([]);
    const [selectedFee, setSelectedFee] = useState('');
    const [btcToRubRate, setBtcToRubRate] = useState(null);

    useEffect(() => {
        const fetchFeesAndRates = async () => {
            try {
                const feesData = await getFees();
                const ratesData = await fetchBitcoinPrices(); // Получаем текущий курс BTC к RUB
                setBtcToRubRate(ratesData.RUB.last);

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
                        const btcValue = convertSatoshisToBitcoin(value);
                        console.log('btcValue', btcValue)
                        const amountRub = btcValue * ratesData.RUB.last;
                        console.log('amountRub', amountRub)
                        return {
                            label,
                            value,
                            satPerByte: value,
                            amountRub: Math.round(amountRub)
                        };
                    });
                setFees(filteredFees);
            } catch (error) {
                console.error('Error fetching fees and rates:', error);
            }
        };

        fetchFeesAndRates();
    }, []);

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedFee(selectedValue);
        onSelect(selectedValue === 'custom' ? '' : selectedValue);
    };

    return (
        <div>
            <select id="fee" value={selectedFee} onChange={handleSelectChange} className="select">
                <option value="" disabled hidden>Выберите комиссию</option>
                {fees.map(({ label, satPerByte, amountRub }, index) => (
                    <option key={index} value={satPerByte}>
                        {label} - {satPerByte} sat/b - {amountRub} руб
                    </option>
                ))}
                <option value="custom">Установить свою</option>
            </select>
        </div>
    );
};
