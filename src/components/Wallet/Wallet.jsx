import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import './Wallet.css';
import {useTelegram} from "../../hooks/useTelegram";
import {useGetAllTransactionsUser} from "../../api/useGetAllTransactionsUser";
import {TransactionsList} from "../Bitcoin/Transactions/TransactionsTable";
import LocalLoadingSpinner from "../../LoadingSpinner/LocalLoadingSpinner"; // Убедитесь, что вы создали соответствующий файл стилей

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
    const fetchTransactions = useGetAllTransactionsUser(chatId, setTransactions);


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
            <div className="wallet">
                <div className="wallet-header">
                    <h3>Баланс</h3>
                    <div className="balance">{dummyBalance} $</div>
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
            </div>
            <div className="currencies">
                {dummyTransactions.map(transaction => (
                    <div className="currency" key={transaction.id}>
                        <span>{transaction.name}</span>
                        <span>{transaction.amount}</span>
                        <span>{transaction.usdValue}</span>
                    </div>
                ))}
            </div>
            <button className={'button'} onClick={handleButtonClick}>окно</button>
            {isLoading ? (
                <LocalLoadingSpinner />
            ) : (
                <div>
                    {!showTransactions && (
                        <span className={'span_show_transactions'} onClick={handleShowTransactionsClick}>Показать транзакции</span>
                    )}
                    <h3>История транзакций</h3>
                    {showTransactions && <TransactionsList transactions={transactions}/>}
                </div>
            )}

        </div>
    );
};

export default Wallet;
