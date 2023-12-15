import React, {useState} from 'react';
import './TransactionsTable.css';
import '../../../App.css';
import {convertSatoshisToBitcoin} from "../../../calculator/convertSatoshisToBitcoin.mjs";

const TransactionCard = ({transaction}) => {
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => setShowDetails(!showDetails);

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'Incoming':
                return '🟢';
            case 'Outgoing':
                return '🔴';
            case 'Internal':
                return '🔁';
            default:
                return '❓';
        }
    };

    const renderAmount = () => {
        if (transaction.transactionType === 'Incoming') {
            return `Received: ${convertSatoshisToBitcoin(transaction.amountReceived)}`;
        } else if (transaction.transactionType === 'Outgoing') {
            return `Sent: ${convertSatoshisToBitcoin(transaction.amountSent)}`;
        }
        return `Sent: ${transaction.amountSent} / Received: ${transaction.amountReceived}`;
    };

    return (
        <div className="body_second" onClick={toggleDetails}>
            <div>Transaction Type: {getTransactionIcon(transaction.transactionType)} {transaction.transactionType}</div>
            <div>Block Time: {transaction.blockTime}</div>
            <div>{renderAmount()}</div>

            {showDetails && (
                <>
                    <div>TXID: {transaction.txid}</div>
                    <div>Senders: {transaction.senders.join(', ')}</div>
                    <div>Recipients: {transaction.recipients.join(', ')}</div>
                    <div>Confirmed: {transaction.confirmed ? 'Yes' : 'No'}</div>
                    <div>Block Time: {transaction.blockTime}</div>
                </>
            )}
        </div>
    );
};

export const TransactionsList = ({transactions}) => {
    return (
        <div>
            {transactions.map((transaction, index) => (
                <TransactionCard key={index} transaction={transaction}/>
            ))}
        </div>
    );
};
