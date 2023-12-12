// BitcoinInput.js
import React, {useEffect, useState} from 'react';
import '../../../App.css';
import './BitcoinInput.css';
import '../../Bitcoin/SendBitcoin/SendBitcoin.css'
import {isValidBitcoinAddress} from "../../../api/ValidAddress/ValidAddres.mjs";
import {convertBtcToRub, convertRubToBtc} from "../../../calculator/convertSatoshisToBitcoin.mjs";

export const BitcoinInput = ({
                                 index,
                                 bitcoinAmount,
                                 setBitcoinAmount,
                                 bitcoinAddress,
                                 setBitcoinAddress,
                                 setIsValidAddress,
                                 isValidAddress,
                                 rubAmount,
                                 setRubAmount,
                                 balanceToBtc,
                                 removeInput,
                                 canRemove,

                             }) => {



    /*const handleBitcoinAmountChange = async (e) => {
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
                const rubEquivalent = await convertBtcToRub(amount);
                setRubAmount(String(rubEquivalent)); // Преобразуем результат в строку для обновления состояния
            } else if (isNaN(amount)) {
                setBitcoinAmount(''); // Очистить поле, если введено некорректное значение
                setRubAmount(''); // Очистить поле для рублей
            } else {
                setBitcoinAmount(balanceToBtc); // Установка значения равного балансу, если введенное значение больше
                const rubEquivalent = await convertBtcToRub(balanceToBtc);
                setRubAmount(String(rubEquivalent)); // Преобразуем результат в строку для обновления состояния
            }
        } else {
            e.target.value = e.target.value.slice(0, -1); // Удаляем последний символ, если он недопустим
        }
    };*/
    const handleBitcoinAmountChange = async (e) => {
        const btcValue = e.target.value;
        if (!isNaN(btcValue) && btcValue.trim() !== '') {
            const rubEquivalent = await convertBtcToRub(btcValue);
            setRubAmount(rubEquivalent);
            console.log(rubEquivalent)
        }
        console.log(btcValue)

        setBitcoinAmount(btcValue);
    };

    const handleRubAmountChange = async (e) => {
        const rubValue = e.target.value;
        if (!isNaN(rubValue) && rubValue.trim() !== '') {
            const btcEquivalent = await convertRubToBtc(rubValue);
            setBitcoinAmount(btcEquivalent);
            console.log(btcEquivalent)
        }
        console.log(rubValue)

        setRubAmount(rubValue);
    };

    const handleBitcoinAddressChange = (e) => {
        const address = e.target.value;
        setBitcoinAddress(address); // Устанавливаем адрес в состояние сразу же
    };
    useEffect(() => {
        const convert = async () => {
            if (!isNaN(bitcoinAmount) && bitcoinAmount.trim() !== '') {
                const rubEquivalent = await convertBtcToRub(bitcoinAmount);
                setBitcoinAmount(String(rubEquivalent)); // Обновляем состояние как строку
            }
        };
        convert();
    }, [bitcoinAmount]); // Вызываем эффект при изменении rubAmount

    useEffect(() => {
        const convert = async () => {
            if (!isNaN(rubAmount) && rubAmount.trim() !== '') {
                const btcEquivalent = await convertRubToBtc(rubAmount);
                setBitcoinAmount(String(btcEquivalent)); // Обновляем состояние как строку
            }
        };
        convert();
    }, [rubAmount]); // Вызываем эффект при изменении rubAmount

    useEffect(() => {
        const validateAddress = async () => {
            const isValid = await isValidBitcoinAddress(bitcoinAddress);
            setIsValidAddress(isValid);
        };

        if (bitcoinAddress) {
            validateAddress();
        }
    }, [bitcoinAddress]);

    useEffect(() => {
        console.log("Address: ", bitcoinAddress, "Is Valid: ", isValidAddress);
    }, [bitcoinAddress, isValidAddress]); // Следим за изменениями bitcoinAddress и isValidAddress




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
                    className={'input'}
                    type="number"
                    id="rubAmount"
                    value={rubAmount}
                    // другие нужные пропсы
                    onChange={handleRubAmountChange}
                    placeholder="Сумма в рублях"
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
                <span className={'span_delete'} onClick={() => removeInput(index)}>Удалить</span>
            )}

        </div>

    );
};

