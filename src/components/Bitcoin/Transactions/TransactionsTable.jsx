import React from 'react';

export const TransactionsTable = ({ transactions }) => {
    return (
        <table>
            <thead>
            <tr>
                <th>TXID</th>
                <th>Senders</th>
                <th>Recipients</th>
                <th>Confirmed</th>
                <th>Block Time</th>
            </tr>
            </thead>
            <tbody>
            {transactions.map((transaction, index) => (
                <tr key={index}>
                    <td>{transaction.txid}</td>
                    <td>{transaction.senders.join(', ')}</td>
                    <td>{transaction.recipients.join(', ')}</td>
                    <td>{transaction.confirmed ? 'Yes' : 'No'}</td>
                    <td>{transaction.blockTime}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

