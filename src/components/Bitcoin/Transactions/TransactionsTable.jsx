import React, {useState} from 'react';
import './TransactionsTable.css';
import '../../../App.css';
import {convertSatoshisToBitcoin} from "../../../calculator/convertSatoshisToBitcoin.mjs";

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


    return (
        <div className="body_second" onClick={toggleDetails}>
            {renderTransactionDetails()}

            {showDetails && (
                <>
                    <div className={'transaction-id'}>TXID: {transaction.txid}</div>
                    <div>От: {transaction.senders.join(', ')}</div>
                    <div>Кому: {transaction.recipients.join(', ')}</div>
                    <div>Подтверждение: {transaction.confirmed ? 'Yes' : 'No'}</div>
                    <div>Дата время: {transaction.blockTime}</div>
                </>
            )}
        </div>
    );
};

export const TransactionsList = ({transactions}) => {
    return (
        <div>
            <div className={'body_second'}>
                <h3>История транзакций</h3>
            </div>
            {transactions.map((transaction, index) => (
                <TransactionCard key={index} transaction={transaction}/>
            ))}
        </div>
    );
};
