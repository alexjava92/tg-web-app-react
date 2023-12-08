import React, {useState} from 'react';
import {useGetBalanceUserWallet} from "../../../api/useGetBalanceUserWallet";
import {useTelegram} from "../../../hooks/useTelegram";
import {useNavigate} from "react-router-dom";
import '../../../GlobalStyle.css'
import './SendBitcoin.css'


export const SendBitcoin = () => {
    const {tg, chatId} = useTelegram();
    const backButton = tg.BackButton;
    const navigate = useNavigate();


    const [balance, setBalance] = useState(0);
    const [bitcoinAmount, setBitcoinAmount] = useState('');
    const [bitcoinAddress, setBitcoinAddress] = useState('');

    // Используем ваш хук для получения баланса
    useGetBalanceUserWallet(chatId, setBalance);

    const handleBitcoinAmountChange = (e) => {
        setBitcoinAmount(e.target.value);
    };

    const handleBitcoinAddressChange = (e) => {
        setBitcoinAddress(e.target.value);
    };

    const handleSendBitcoin = () => {
        // Реализуйте отправку биткоинов с использованием полученных данных (chatId, balance, bitcoinAmount, bitcoinAddress)
        // Например, вызовите функцию для отправки биткоинов на сервер
        // sendBitcoinToServer(chatId, balance, bitcoinAmount, bitcoinAddress);
    };

    return (
        <div>
            <div>
                <h2 className={'h2'}>Баланс кошелька: {balance} BTC</h2>
            </div>
            <div>
                <label htmlFor="bitcoinAmount">Отправить BTC:</label>
                <input
                    type="number"
                    id="bitcoinAmount"
                    value={bitcoinAmount}
                    onChange={handleBitcoinAmountChange}
                />
            </div>
            <div>
                <label htmlFor="bitcoinAddress">Адрес биткоина:</label>
                <input
                    type="text"
                    id="bitcoinAddress"
                    value={bitcoinAddress}
                    onChange={handleBitcoinAddressChange}
                />
            </div>
            <div>
                <button className={'button'} onClick={handleSendBitcoin}>Отправить</button>
            </div>
        </div>
    );
};

