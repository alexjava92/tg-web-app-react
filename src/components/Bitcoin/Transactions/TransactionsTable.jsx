import React, { useState } from 'react';
import './TransactionsTable.css';
import '../../../App.css';

const TransactionCard = ({ transaction }) => {
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => setShowDetails(!showDetails);

    const renderAmount = () => {
        if (transaction.transactionType === 'Incoming') {
            return `Received: ${transaction.amountReceived}`;
        } else if (transaction.transactionType === 'Outgoing') {
            return `Sent: ${transaction.amountSent}`;
        }
        // Default case for 'Internal' type
        return `Sent: ${transaction.amountSent} / Received: ${transaction.amountReceived}`;
    };

    return (
        <div className="body_second" onClick={toggleDetails}>
            <div>Transaction Type: {transaction.transactionType}</div>
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

export const TransactionsList = ({ transactions }) => {
    return (
        <div>
            {transactions.map((transaction, index) => (
                <TransactionCard key={index} transaction={transaction} />
            ))}
        </div>
    );
};
