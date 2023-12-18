import React, {useCallback, useEffect, useState} from 'react';
import './Balance.css'
import '../../../App.css'
import {useGetBalanceUserWallet} from "../../../api/useGetBalanceUserWallet";
import {
    convertBtcToRub,
    convertSatoshisToBitcoin,
    formatNumberWithSpaces
} from "../../../calculator/convertSatoshisToBitcoin.mjs";



export const Balance = ({chatId}) => {

    const [balanceToBtc, setBalanceToBtc] = useState('');
    const [balance, setBalance] = useState('');
    const [balanceToRub, setBalanceToRub] = useState('');

    const handleLoaded = useCallback(() => {
        // Логика после загрузки данных
    }, []);


    useGetBalanceUserWallet(chatId, setBalance, handleLoaded);

    useEffect(() => {
        setBalanceToBtc(convertSatoshisToBitcoin(balance));
    }, [balance]);

    useEffect(() => {
        const fetchBalanceToRub = async () => {
            const convertedBalance = await convertBtcToRub(balanceToBtc);
            setBalanceToRub(formatNumberWithSpaces(convertedBalance));
        };

        fetchBalanceToRub();
    }, [balanceToBtc]);

    return (
        <div className={'body_second'}>
            <h2 className={'h2'}>Баланс:</h2>
            <div className={'balance'}>{balanceToBtc} BTC</div>
            <div className={'balance'}>{balanceToRub} ₽</div>
        </div>
    );
};