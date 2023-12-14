import React from 'react';
import './TransactionsTable.css'
import '../../../App.css'

const TransactionCard = ({ transaction }) => {
    return (
        <div className={'transactions-list'}>
            <div>
                TXID: {transaction.txid}
                <div>
                    Senders: {transaction.senders.join(', ')}
                </div>
                <div>
                    Recipients: {transaction.recipients.join(', ')}
                </div>
                <div>
                    Confirmed: {transaction.confirmed ? 'Yes' : 'No'}
                </div>
                <div>
                    Block Time: {transaction.blockTime}
                </div>
            </div>
        </div>
    );
};

export const TransactionsList = ({ transactions }) => {
    return (
        <div className="body_second">
            {transactions.map((transaction, index) => (
                <TransactionCard key={index} transaction={transaction} />
            ))}
        </div>
    );
};

