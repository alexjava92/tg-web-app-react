// BitcoinInput.js
import React, {useEffect, useState} from 'react';
import '../../../App.css';
import './BitcoinInput.css';
import '../../Bitcoin/SendBitcoin/SendBitcoin.css'
import {isValidBitcoinAddress} from "../../../api/ValidAddress/ValidAddres.mjs";

export const BitcoinInput = ({
                                 index,
                                 bitcoinAmount,
                                 setBitcoinAmount,
                                 bitcoinAddress,
                                 setBitcoinAddress,
                                 setIsValidAddress,
                                 isValidAddress,
                                 balanceToBtc,
                                 addInput,
                                 removeInput,
                                 canRemove,

                             }) => {

    const handleBitcoinAmountChange = (e) => {
        const inputValue = e.target.value;
        // Разрешаем вводить только цифры, точки и запятые
        const validInput = inputValue.match(/^[\d.,]*$/);

        if (validInput) {
            const formattedInput = validInput[0].replace(',', '.'); // Заменяем запятые на точки
            // Ограничиваем количество цифр после запятой до 8
            const finalInput = formattedInput.match(/^-?\d*(\.\d{0,8})?/)[0];

            const amount = parseFloat(finalInput); // Преобразование введенного значения в число

            // Проверка на NaN и сравнение с балансом
            if (!isNaN(amount) && amount <= balanceToBtc) {
                setBitcoinAmount(amount);
            } else if (isNaN(amount)) {
                setBitcoinAmount(''); // Очистить поле, если введено некорректное значение
            } else {
                setBitcoinAmount(balanceToBtc); // Установка значения равного балансу, если введенное значение больше
            }
        } else {
            e.target.value = e.target.value.slice(0, -1); // Удаляем последний символ, если он недопустим
        }
    };

    const handleBitcoinAddressChange = async (e) => {
        const address = e.target.value;
        setBitcoinAddress(address);
        const isValid = await isValidBitcoinAddress(address);
        setIsValidAddress(isValid);
        setBitcoinAddress(address);

    };

        console.log("Address: ", bitcoinAddress, "Is Valid: ", isValidAddress);



    return (
        <div className={'body_second'}>
            <div>
                <input
                    className={'input'}
                    type="number"
                    id="bitcoinAmount"
                    value={bitcoinAmount}
                    min="0.000001"
                    max={balanceToBtc}
                    placeholder="Сумма минимум 0.000001"
                    onChange={handleBitcoinAmountChange}
                />
            </div>
            <div>
                <input
                    className={`input ${!isValidAddress ? 'invalid-text' : ''}`}
                    type="text"
                    id="bitcoinAddress"
                    value={bitcoinAddress}
                    placeholder="Адрес"
                    onChange={handleBitcoinAddressChange}
                />
            </div>
            {canRemove && (
                <span className={'span_delete'} onClick={() => removeInput(index)}>Удалить этот ввод</span>
            )}
            <span className={'span_add'} onClick={addInput}>Добавить еще один адрес</span>
        </div>
    );
};

