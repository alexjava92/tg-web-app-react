import React from 'react';
import './TransactionsTable.css'

const TransactionCard = ({ transaction }) => {
    return (
        <div className="transaction-card">
            <div className="transaction-details">
                <div className="transaction-id">TXID: {transaction.txid}</div>
                <div className="transaction-senders">
                    Senders: {transaction.senders.join(', ')}
                </div>
                <div className="transaction-recipients">
                    Recipients: {transaction.recipients.join(', ')}
                </div>
                <div className="transaction-confirmed">
                    Confirmed: {transaction.confirmed ? 'Yes' : 'No'}
                </div>
                <div className="transaction-blocktime">
                    Block Time: {transaction.blockTime}
                </div>
            </div>
        </div>
    );
};

export const TransactionsList = ({ transactions }) => {
    return (
        <div className="transactions-list">
            {transactions.map((transaction, index) => (
                <TransactionCard key={index} transaction={transaction} />
            ))}
        </div>
    );
};

