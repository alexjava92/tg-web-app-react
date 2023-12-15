import React, {useState} from 'react';
import './TransactionsTable.css';
import '../../../App.css';
import {convertSatoshisToBitcoin} from "../../../calculator/convertSatoshisToBitcoin.mjs";
import {config} from "../../../api/config";

const TransactionCard = ({transaction}) => {
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => setShowDetails(!showDetails);

    const renderTransactionDetails = () => {
        let icon, action, amount, amountClass;
        switch (transaction.transactionType) {
            case 'Incoming':
                icon = '🟢';
                action = 'Получено';
                amount = convertSatoshisToBitcoin(transaction.amountReceived);
                amountClass = 'amount-incoming';
                break;
            case 'Outgoing':
                icon = '🔴';
                action = 'Отправлено';
                amount = convertSatoshisToBitcoin(transaction.amountSent);
                amountClass = 'amount-outgoing';
                break;
            case 'Internal':
                icon = '🔁';
                action = 'Внутренняя';
                amount = `${convertSatoshisToBitcoin(transaction.amountSent)} / ${convertSatoshisToBitcoin(transaction.amountReceived)}`;
                break;
            default:
                icon = '❓';
                action = 'Неизвестно';
                amount = '---';
                break;
        }
        return (
            <div className="transaction-detail">
                <div className="transaction-info">
                    <div>{icon} {action}</div>
                    <div>{transaction.blockTime}</div>
                </div>
                <div className={`transaction-amount ${amountClass}`}>
                    {amount}
                </div>
            </div>
        );
    };

    const transactionUrl = `${config.mempoolUrl}/tx/`;
    return (
        <div className="body_second" onClick={toggleDetails}>
            {renderTransactionDetails()}

            {showDetails && (
                <>
                    <div className={'transaction-id'}>TXID: {transaction.txid}</div>
                    <div className={'senders'}>От: {transaction.senders.join(', ')}</div>
                    <div className={'recipients'}>Кому: {transaction.recipients.join(', ')}</div>
                    <div className={transaction.confirmed ? 'confirmation-yes' : 'confirmation-no'}>
                        Подтвержденная транзакция: {transaction.confirmed ? 'Yes' : 'No'}
                    </div>
                    <span className={'span_show_transactions'}>
                        <a href={transactionUrl + transaction.txid} target="_blank"
                           rel="noopener noreferrer"
                           className={'transaction-link'}>
                        Посмотреть транзакцию
                    </a></span>
                </>

            )}
        </div>
    );
};

export const TransactionsList = ({transactions}) => {
    const [filter, setFilter] = useState('Все');

    const filteredTransactions = transactions.filter(tx => {
        if (filter === 'Все') return true;
        if (filter === 'Получено') return tx.transactionType === 'Incoming';
        if (filter === 'Отправлено') return tx.transactionType === 'Outgoing';
        if (filter === 'Внутренний') return tx.transactionType === 'Internal';
        return false;
    });

    return (
        <div>
            <div className={'body_second'}>
                <h3>История транзакций</h3>
            </div>
            <div className={'flex-container'}>
                <span
                    className={filter === 'Все' ? 'filter-option selected' : 'filter-option'}
                    onClick={() => setFilter('Все')}>
                    Все
                </span>
                <span
                    className={filter === 'Получено' ? 'filter-option selected' : 'filter-option'}
                    onClick={() => setFilter('Получено')}>
                    Получено
                </span>
                <span
                    className={filter === 'Отправлено' ? 'filter-option selected' : 'filter-option'}
                    onClick={() => setFilter('Отправлено')}>
                    Отправлено
                </span>
                <span
                    className={filter === 'Внутренний' ? 'filter-option selected' : 'filter-option'}
                    onClick={() => setFilter('Внутренний')}>
                    Внутренний
                </span>
            </div>
            {filteredTransactions.map((transaction, index) => (
                <TransactionCard key={index} transaction={transaction}/>
            ))}
        </div>
    );
};
