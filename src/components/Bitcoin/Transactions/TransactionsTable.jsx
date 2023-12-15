import React, {useState} from 'react';
import './TransactionsTable.css';
import '../../../App.css';
import {convertSatoshisToBitcoin} from "../../../calculator/convertSatoshisToBitcoin.mjs";
import {config} from "../../../api/config";

const TransactionCard = ({transaction}) => {
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => setShowDetails(!showDetails);

    const renderTransactionDetails = () => {
        let icon, action, amount;
        switch (transaction.transactionType) {
            case 'Incoming':
                icon = '🟢';
                action = 'Получено';
                amount = convertSatoshisToBitcoin(transaction.amountReceived);
                break;
            case 'Outgoing':
                icon = '🔴';
                action = 'Отправлено';
                amount = convertSatoshisToBitcoin(transaction.amountSent);
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
            <>
                <div>{icon} {action}</div>
                <div>Дата время: {transaction.blockTime}</div>
                <div>Количество: {amount}</div>
            </>
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
    const [filter, setFilter] = useState('All');

    const filteredTransactions = transactions.filter(tx => {
        if (filter === 'All') return true;
        return tx.transactionType === filter;
    });

    const handleFilterClick = (type) => {
        setFilter(type);
    };
    return (
        <div>
            <div className={'body_second'}>
                <h3>История транзакций</h3>
            </div>
            <div className={'flex-container'}>
                <span onClick={() => handleFilterClick('All')}>Все</span>
                <span onClick={() => handleFilterClick('Incoming')}>Получено</span>
                <span onClick={() => handleFilterClick('Outgoing')}>Отправлено</span>
                <span onClick={() => handleFilterClick('Internal')}>Внутренний</span>
            </div>
            {filteredTransactions.map((transaction, index) => (
                <TransactionCard key={index} transaction={transaction}/>
            ))}
        </div>
    );
};
