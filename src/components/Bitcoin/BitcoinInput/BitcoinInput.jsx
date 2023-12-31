// BitcoinInput.js
import React, {useContext, useEffect, useState} from 'react';
import '../../../GlobalStyle.css'
import '../../../App.css';
import './BitcoinInput.css';
import '../../Bitcoin/SendBitcoin/SendBitcoin.css'

import {isValidBitcoinAddress} from "../../../api/ValidAddres.js";
import {
    convertBitcoinToSatoshis,
    convertBtcToRub, convertBtcToUsd,
    convertRubToBtc, convertUsdToBtc
} from "../../../calculator/convertSatoshisToBitcoin.mjs";

import {useTelegram} from "../../../hooks/useTelegram";
import {BsQrCodeScan} from "react-icons/bs";
import {CurrencyContext} from "../../../App";


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
                                 usdAmount,
                                 setUsdAmount,
                                 balanceToBtc,
                                 removeInput,
                                 canRemove,
                                 balance,
                                 validBalance,
                                 setValidBalance,
                             }) => {
    const {tg} = useTelegram();
    console.log(tg)
    const [lastUpdatedByUserBitcoin, setLastUpdatedByUserBitcoin] = useState(false);
    const [lastUpdatedByUserRub, setLastUpdatedByUserRub] = useState(false);
    const {showUsd} = useContext(CurrencyContext);

    useEffect(() => {
        const convert = async () => {
            console.log('showUsd changed:', showUsd);
            setBitcoinAmount('');
            if (showUsd) {
                setRubAmount('');
            } else {
                setUsdAmount('');
            }
        }
        convert();
    }, [showUsd]);


    const handleBitcoinAmountChange = (e) => {
        const inputValue = e.target.value;
        console.log(inputValue)
        const validInput = inputValue.match(/^[\d.,]*$/);

        if (validInput) {
            const formattedInput = validInput[0].replace(',', '.');
            const finalInput = formattedInput.match(/^-?\d*(\.\d{0,8})?/)[0];

            setBitcoinAmount(finalInput);
            if (finalInput !== '') {
                setLastUpdatedByUserBitcoin(true);
            }
        }
    };
    const handleAmountChange = async (e) => {
        const inputValue = e.target.value;
        console.log(inputValue);

        if (showUsd) {
            // Конвертируем из USD в BTC
            const btcEquivalent = await convertUsdToBtc(inputValue);
            setBitcoinAmount(String(btcEquivalent));
            setUsdAmount(inputValue);

        }
        if (!showUsd) {
            // Конвертируем из RUB в BTC
            const btcEquivalent = await convertRubToBtc(inputValue);
            setBitcoinAmount(String(btcEquivalent));
            setRubAmount(inputValue);
        }

        setLastUpdatedByUserRub(true);
    };

    const handleBitcoinAddressChange = (e) => {
        const address = e.target.value;
        setBitcoinAddress(address); // Устанавливаем адрес в состояние сразу же
    };

    // Функция для обработки клика по иконке QR
    const handleScanQrClick = () => {
        // Предполагаем, что showScanQrPopup вызывает сканирование QR кода
        tg.showScanQrPopup({text: 'Сканируйте QR-код'}, (scannedText) => {
            setBitcoinAddress(scannedText); // Обновляем адрес после сканирования
            return true; // Закрываем popup после сканирования
        });
    };

    useEffect(() => {
        const convert = async () => {
            console.log(balance);
            const satoshiBalance = convertBitcoinToSatoshis(bitcoinAmount);

            if (lastUpdatedByUserBitcoin && bitcoinAmount !== '') {
                let fiatEquivalent;
                if (showUsd) {
                    // Конвертируем в USD, если включен режим USD
                    fiatEquivalent = await convertBtcToUsd(bitcoinAmount);
                    setUsdAmount(String(fiatEquivalent))
                }
                if (!showUsd) {
                    // Конвертируем в RUB, если включен режим RUB
                    fiatEquivalent = await convertBtcToRub(bitcoinAmount);
                    setRubAmount(String(fiatEquivalent));
                }

            } else if (satoshiBalance > balance) {
                setValidBalance(false);
            } else if (satoshiBalance <= balance) {
                setValidBalance(true);
            }
            setLastUpdatedByUserBitcoin(false);
        };
        convert();
    }, [bitcoinAmount, lastUpdatedByUserBitcoin]);

    useEffect(() => {
        const convert = async () => {
            if (lastUpdatedByUserRub) {
                let btcEquivalent;
                if (usdAmount !== '') {
                    btcEquivalent = await convertUsdToBtc(usdAmount);
                } else if (rubAmount !== '') {
                    btcEquivalent = await convertRubToBtc(rubAmount);
                }
                if (usdAmount !== '' || rubAmount !== '') {
                    setBitcoinAmount(String(btcEquivalent));
                } else {
                    setBitcoinAmount('');
                }

            }
            setLastUpdatedByUserRub(false);
        };
        convert();
    }, [rubAmount, usdAmount, lastUpdatedByUserRub]);

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
            <div className={'container_input_amount'}>
                <input
                    className={`input_amount ${!validBalance ? 'invalid-text' : ''}`}
                    type="text"
                    id="bitcoinAmount"
                    value={bitcoinAmount}
                    min="0.000001"
                    max={balanceToBtc}
                    placeholder="BTC"
                    onChange={handleBitcoinAmountChange}
                />
                <input
                    className={`input_amount ${!validBalance ? 'invalid-text' : ''}`}
                    type="text"
                    id={showUsd ? "usdAmount" : "rubAmount"}
                    value={showUsd ? usdAmount : rubAmount}
                    onChange={handleAmountChange}
                    placeholder={showUsd ? "USD" : "RUB"}
                />
            </div>
            <div className={'container_input_address_bitcoin'}>
                <input
                    className={`input_address_bitcoin ${!isValidAddress ? 'invalid-text' : ''}`}
                    type="text"
                    id="bitcoinAddress"
                    value={bitcoinAddress}
                    placeholder="Адрес BTC"
                    onChange={handleBitcoinAddressChange}
                />
                <BsQrCodeScan
                    onClick={handleScanQrClick}
                    size={25}/>
            </div>
            {canRemove && (
                <span className={'span_delete'} onClick={() => removeInput(index)}>Удалить</span>
            )}

        </div>

    );
};

