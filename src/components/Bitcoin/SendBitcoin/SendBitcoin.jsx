import React, {useEffect, useState} from 'react';
import {useTelegram} from "../../../hooks/useTelegram";
import {useNavigate} from "react-router-dom";
import '../../../GlobalStyle.css'
import './SendBitcoin.css'

import {useGetBalanceUserWallet} from "../../../api/useGetBalanceUserWallet";
import {config} from "../../../api/config";
import {BitcoinNetworkFees} from "../../../BitcoinNetworkFees/BitcoinNetworkFees";
import {useSendBitcoin} from "../../../api/useSendBitcoin";

const url = config.apiBaseUrl;
export const SendBitcoin = () => {
    const {tg, chatId} = useTelegram();
    const backButton = tg.BackButton;
    const navigate = useNavigate();



    const [balance, setBalance] = useState('');
    const [bitcoinAmount, setBitcoinAmount] = useState('');
    const [bitcoinAddress, setBitcoinAddress] = useState('');
    const [satoshiPerByte, setSatoshiPerByte] = useState(0)
    const [outputs, setOutputs] = useState([]);
    const [txId, setTxId] = useState('')

    let newOutput = {};
    // Используем ваш хук для получения баланса
    useGetBalanceUserWallet(chatId, setBalance)


    const handleBitcoinAmountChange = (e) => {
        setBitcoinAmount(e.target.value);
        console.log(e.target.value)
    };

    const handleBitcoinAddressChange = (e) => {
        setBitcoinAddress(e.target.value);
        console.log(e.target.value)
    };

    const handleCommissionSelect = (selectedCommission) => {
        // Обработка выбора комиссии в родительском компоненте
        setSatoshiPerByte(selectedCommission);
        console.log('Выбрана комиссия:', selectedCommission);
    };

    const handleSendBitcoin = async () => {
        // Формируем новый объект для выхода и добавляем его в массив outputs
        const newOutput = { address: bitcoinAddress, amount: parseFloat(bitcoinAmount) };
        await setOutputs([newOutput]);

        await useSendBitcoin(chatId, outputs, 2, setTxId)
        // Очищаем поля ввода
    };
    console.log(outputs)

    useEffect(() => {
        // Показываем кнопку назад после загрузки данных
        backButton.show();
    }, [backButton]);

    backButton.onClick(() => {
        navigate(-1);
    });

    return (
        <div className={'send-bitcoin-container'}>
            <div>
                <h2 className={'h2'}>Баланс кошелька: {balance} </h2>
            </div>
            <div>
                <label htmlFor="bitcoinAmount">Количество bitcoin:</label>
                <input
                    className={'input'}
                    type="number"
                    id="bitcoinAmount"
                    value={bitcoinAmount}
                    onChange={handleBitcoinAmountChange}
                />
            </div>
            <div>
                <label htmlFor="bitcoinAddress">Адрес bitcoin:</label>
                <input
                    className={'input'}
                    type="text"
                    id="bitcoinAddress"
                    value={bitcoinAddress}
                    onChange={handleBitcoinAddressChange}
                />
            </div>
            <div>
                <BitcoinNetworkFees onSelect={handleCommissionSelect}/>
            </div>
            <div>
                <button className={'button'} onClick={handleSendBitcoin}>Отправить</button>
            </div>

        </div>
    );
};

