import React, {useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import './Wallet.css';
import {useTelegram} from "../../hooks/useTelegram";
import {useGetAllTransactionsUser} from "../../api/useGetAllTransactionsUser";
import {TransactionsList} from "../Bitcoin/Transactions/TransactionsTable";
import LocalLoadingSpinner from "../../LoadingSpinner/LocalLoadingSpinner";
import {useGetBalanceUserWallet} from "../../api/useGetBalanceUserWallet";
import {
    convertBtcToRub,
    convertSatoshisToBitcoin,
    formatNumberWithSpaces
} from "../../calculator/convertSatoshisToBitcoin.mjs";
import {Balance} from "../Bitcoin/Balance/Balance";
import {BitcoinPrice} from "../Bitcoin/Price/BitcoinPrice";

import {BouncingLoader} from "../../LoadingSpinner/BouncingLoader"; // Убедитесь, что вы создали соответствующий файл стилей


const Wallet = () => {
    const {tg, chatId} = useTelegram();
    const backButton = tg.BackButton

    const [transactions, setTransactions] = useState([]);
    const [showTransactions, setShowTransactions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingBalance, setIsLoadingBalance] = useState(true); // Новое состояние для загрузки баланса

    const [balanceToBtc, setBalanceToBtc] = useState('');
    const [balance, setBalance] = useState('');
    const [balanceToRub, setBalanceToRub] = useState('');

    // Используем ваш хук для получения баланса
    const handleLoaded = useCallback(() => {
        // Логика после загрузки данных
        setIsLoading(false);
        setIsLoadingBalance(false);
    }, []);

    useGetBalanceUserWallet(chatId, setBalance, handleLoaded);
    const fetchTransactions = useGetAllTransactionsUser(chatId, setTransactions);

    // Загрузка транзакций при первом рендере
    useEffect(() => {
        setIsLoading(true); // включаем индикатор загрузки
        fetchTransactions().then(() => {
            setShowTransactions(true);
            setIsLoading(false); // выключаем индикатор загрузки после загрузки транзакций
        });
    }, []);


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

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            backButton.hide();
        }, 1000);

        // Очистка таймаута при размонтировании компонента
        return () => clearTimeout(timeoutId);
    }, [backButton]);

    const handleShowTransactionsClick = () => {
        setShowTransactions(false);
        setIsLoading(true); // включаем индикатор загрузки
        fetchTransactions().then(() => {
            setShowTransactions(true);
            setIsLoading(false); // выключаем индикатор загрузки после загрузки транзакций

        });
    };


    const handleButtonClick = () => {
        tg.showPopup({
            title: 'Заголовок',
            message: 'Текст сообщения',
            buttons: [
                {id: 'ok_button', type: 'ok', text: 'Ок'},
                {id: 'cancel_button', type: 'cancel', text: 'Отмена'},
                {id: 'add_button', type: 'default', text: 'Добавить'},
            ]
        }, function (result) {
            if (result) {
                console.log('Пользователь нажал кнопку:', result);
                if (result === 'add_button') {
                    tg.HapticFeedback.impactOccurred('light');
                }
                if (result === 'cancel_button') {
                    tg.HapticFeedback.impactOccurred('heavy');
                }
            } else {
                console.log('Пользователь закрыл попап без выбора');
            }
        });
    };


    return (
        <div>
            <BitcoinPrice/>
            {isLoadingBalance ? ( // Показываем BouncingLoader пока загружается баланс
                <div className={'body_second'}>
                    <BouncingLoader/>
                </div>
            ) : (
                <>
                    <Balance balanceToBtc={balanceToBtc} balanceToRub={balanceToRub}/>
                    <div className="body_second">
                        <div className={'container_button'}>
                            <Link to="/send-bitcoin">
                                <button className={'button'}>Отправить</button>
                            </Link>
                            <Link to="/bitcoin-address">
                                <button className={'button'}>Получить</button>
                            </Link>
                        </div>
                    </div>
                </>
            )}

            {/*<button className={'button'} onClick={handleButtonClick}>окно</button>*/}
            {isLoading ? (
                <div className={'body_second'}>
                    <BouncingLoader/>
                </div>
            ) : (
                <div>
                    {/*                    {!showTransactions && (
                        <span className={'span_show_transactions'} onClick={handleShowTransactionsClick}>Показать транзакции</span>
                    )}*/}
                    {showTransactions && <TransactionsList
                        transactions={transactions}
                        handleShowTransactionsClick={handleShowTransactionsClick}
                        chatId={chatId}/>}
                </div>
            )}

        </div>
    );
};

export default Wallet;
