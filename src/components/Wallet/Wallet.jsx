import React from 'react';
import { Link } from 'react-router-dom';
import './Wallet.css'; // Убедитесь, что вы создали соответствующий файл стилей

const dummyTransactions = [
    { id: 1, name: 'TONcoin', amount: '0,000882527 TON', usdValue: '0,00 $' },
    { id: 2, name: 'Доллары', amount: '4 948,58 USDT', usdValue: '4 949,55 $' },
    { id: 3, name: 'Bitcoin', amount: '0,0001902 BTC', usdValue: '8,37 $' },
];

const dummyBalance = '4 957,92';

const Wallet = () => {


    return (
        <div className="wallet">
            <div className="wallet-header">
                <h3>Баланс</h3>
                <div className="balance">{dummyBalance} $</div>
                <div className="actions">
                    <button onClick={() => {}}>Отправить</button>
                    <Link to="/bitcoin-address">
                    <button onClick={() => {}}>Получить</button>
                    </Link>
                </div>
            </div>
            <div className="currencies">
                {dummyTransactions.map(transaction => (
                    <div className="currency" key={transaction.id}>
                        <span >{transaction.name}</span>
                        <span >{transaction.amount}</span>
                        <span >{transaction.usdValue}</span>
                    </div>
                ))}
            </div>
            <div className="transaction-history">
                <h3>История транзакций</h3>
                {/* Тут можно добавить компонент истории транзакций */}
            </div>
        </div>
    );
};

export default Wallet;
