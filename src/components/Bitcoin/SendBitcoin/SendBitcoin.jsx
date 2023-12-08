import React, {useEffect, useState} from 'react';
import {useTelegram} from "../../../hooks/useTelegram";
import {useNavigate} from "react-router-dom";
import '../../../GlobalStyle.css'
import './SendBitcoin.css'
import {useFetchBitcoinAddress} from "../../../api/useFetchBitcoinAddress";
import {useGetBalanceUserWallet} from "../../../api/useGetBalanceUserWallet";
import {config} from "../../../api/config";

const url = config.apiBaseUrl;
export const SendBitcoin = () => {
    const {tg, chatId} = useTelegram();
    const backButton = tg.BackButton;
    const navigate = useNavigate();



    const [balance, setBalance] = useState('');
    const [bitcoinAmount, setBitcoinAmount] = useState('');
    const [bitcoinAddress, setBitcoinAddress] = useState('');

    // Используем ваш хук для получения баланса
    // Используем ваш хук для получения баланса
    useEffect(async () => {
        try {
            const response = await fetch(`${url}/web-new-balance-user-wallet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatId }),
            });

            if (response.ok) {
                const responseData = await response.json();

                // Убедитесь, что у вас есть корректный путь к свойству balance в объекте
                const newBalance = responseData.balance;

                setBalance(newBalance.balance);
                console.log('Получен баланс:', newBalance.balance);
            } else {
                console.error('Server returned an error:', response.status);
            }
        } catch (error) {
            console.error('Error fetching data from the server:', error);
        }
    }, [chatId, setBalance]);

    useEffect(() => {
        // Показываем кнопку назад после загрузки данных
        backButton.show();
    }, [backButton]);

    backButton.onClick(() => {
        navigate(-1);
    });

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
                <button className={'button'} onClick={handleSendBitcoin}>Отправить</button>
            </div>
        </div>
    );
};

