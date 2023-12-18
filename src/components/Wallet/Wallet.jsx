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
import {Balance} from "../Bitcoin/Balance/Balance"; // Убедитесь, что вы создали соответствующий файл стилей

const dummyTransactions = [
    {id: 1, name: 'TONcoin', amount: '0,000882527 TON', usdValue: '0,00 $'},
    {id: 2, name: 'Доллары', amount: '4 948,58 USDT', usdValue: '4 949,55 $'},
    {id: 3, name: 'Bitcoin', amount: '0,0001902 BTC', usdValue: '8,37 $'},
];

const dummyBalance = '4 957,92';


const Wallet = () => {
    const {tg, chatId} = useTelegram();
    const backButton = tg.BackButton

    const [transactions, setTransactions] = useState([]);
    const [showTransactions, setShowTransactions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [transactionsKey, setTransactionsKey] = useState(0);

    const [balanceToBtc, setBalanceToBtc] = useState('');
    const [balance, setBalance] = useState('');
    const [balanceToRub, setBalanceToRub] = useState('');

    // Используем ваш хук для получения баланса
    const handleLoaded = useCallback(() => {
        // Логика после загрузки данных
        setIsLoading(false);
    }, []);

    useGetBalanceUserWallet(chatId, setBalance, handleLoaded);
    const fetchTransactions = useGetAllTransactionsUser(chatId, setTransactions);

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
            setTransactionsKey(prevKey => prevKey + 1); // Обновляем ключ для перерисовки TransactionsList
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
            <Balance balanceToBtc={balanceToBtc} balanceToRub={balanceToRub}/>
            <div className="wallet">
                <div className="actions">
                    <Link to="/send-bitcoin">
                        <button onClick={() => {
                        }}>Отправить
                        </button>
                    </Link>
                    <Link to="/bitcoin-address">
                        <button onClick={() => {
                        }}>Получить
                        </button>
                    </Link>
                </div>
            </div>

            {/*<button className={'button'} onClick={handleButtonClick}>окно</button>*/}
            {isLoading ? (
                <LocalLoadingSpinner/>
            ) : (
                <div>
                    {!showTransactions && (
                        <span className={'span_show_transactions'} onClick={handleShowTransactionsClick}>Показать транзакции</span>
                    )}
                    {showTransactions && <TransactionsList
                        key={transactionsKey}
                        transactions={transactions}
                        handleShowTransactionsClick={handleShowTransactionsClick}
                        chatId={chatId}/>}
                </div>
            )}

        </div>
    );
};

export default Wallet;
