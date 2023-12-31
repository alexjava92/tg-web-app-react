import React, {useContext, useEffect, useState} from 'react';
import './TransactionsTable.css';
import '../../../App.css';
import {
    calculateFeePerVByte,
    convertBtcToRub, convertBtcToUsd,
    convertSatoshisToBitcoin
} from "../../../calculator/convertSatoshisToBitcoin.mjs";
import {config} from "../../../api/config";
import {IncreaseFeeComponent} from "../RBF/IncreaseFeeComponent";
import ExampleImage from "../../../img/document_list.png";
import {CurrencyContext} from "../../../App";

const TransactionCard = ({transaction, chatId, onNewTxHash}) => {
    const [showDetails, setShowDetails] = useState(false);
    const [amountInRub, setAmountInRub] = useState(null);
    const [amountInUsd, setAmountInUsd] = useState(null);
    const [showIncreaseFee, setShowIncreaseFee] = useState(false);
    const {showUsd} = useContext(CurrencyContext);
    useEffect(() => {
        const convertCurrency = async () => {
            const btcAmount = convertSatoshisToBitcoin(transaction.amountReceived || transaction.amountSent);
            const rubAmount = await convertBtcToRub(btcAmount);
            setAmountInRub(rubAmount);
            // Предполагаем, что у вас есть функция convertBtcToUsd
            const usdAmount = await convertBtcToUsd(btcAmount);
            setAmountInUsd(usdAmount);
        };

        convertCurrency();
    }, [transaction]);


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
            <div className="transaction-detail" onClick={toggleDetails}>
                <div className="transaction-info">
                    <div>{action}</div>
                    <div>{transaction.blockTime === 'Invalid Date' ? 'Wait confirmations' : transaction.blockTime}</div>
                </div>
                <div className={`transaction-amount ${amountClass}`}>
                    {amount}
                    {showUsd ?
                        (amountInUsd !== null && <div className={'amount_usd'}>{amountInUsd} USD</div>)
                        : (amountInRub !== null && <div className={'amount_rub'}>{amountInRub} RUB</div>)
                    }
                </div>
            </div>
        );
    };


    const transactionUrl = `${config.mempoolUrl}/tx/`;
    return (
        <div className="body_second">
            {renderTransactionDetails()}

            {showDetails && (
                <>
                    <div className={'transaction-id'}>TXID: {transaction.txid}</div>
                    <div className={'senders'}>От: {transaction.senders.join(', ')}</div>
                    <div className={'recipients'}>Кому: {transaction.recipients.join(', ')}</div>
                    <div className={'commission'}>Комиссия сети: {transaction.fee} sat
                        / {calculateFeePerVByte(transaction.size, transaction.weight, transaction.fee)} sat/b
                    </div>
                    <div className={transaction.confirmed ? 'confirmation-yes' : 'confirmation-no'}>
                        Подтвержденная транзакция: {transaction.confirmed ? 'Yes' : 'No'}
                    </div>

                    <div>
                        {showIncreaseFee && (
                            <IncreaseFeeComponent
                                chatId={chatId}
                                txHash={transaction.txid}
                                commission={transaction.fee}
                                satByte={calculateFeePerVByte(transaction.size, transaction.weight, transaction.fee)}
                                onClose={() => setShowIncreaseFee(false)}
                                onNewTxHash={onNewTxHash}/>
                        )}


                    </div>
                    <div className={'container_link_button'}>
                    <span className={'span_show_transactions'}>
                    <a href={transactionUrl + transaction.txid} target="_blank"
                       rel="noopener noreferrer"
                       className={'transaction-link'}>
                    Посмотреть транзакцию
                    </a>
                </span>
                        {!transaction.confirmed && transaction.transactionType === 'Outgoing' && !showIncreaseFee && (

                            <button className={'button_fee'} onClick={() => setShowIncreaseFee(true)}>
                                Повысить комиссию
                            </button>

                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export const TransactionsList = ({transactions, handleShowTransactionsClick, chatId}) => {
    const [filter, setFilter] = useState('Все');

    const refreshTransactions = () => {
        // Логика для обновления списка транзакций
        handleShowTransactionsClick()
    };

    const filteredTransactions = transactions.filter(tx => {
        if (filter === 'Все') return true;
        if (filter === 'Получено') return tx.transactionType === 'Incoming';
        if (filter === 'Отправлено') return tx.transactionType === 'Outgoing';
        if (filter === 'Внутренний') return tx.transactionType === 'Internal';
        return false;
    });

    return (
        <div>
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
            {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => (
                    <TransactionCard
                        key={index}
                        transaction={transaction}
                        chatId={chatId}
                        onNewTxHash={refreshTransactions}
                    />
                ))
            ) : (
                <div className={'body_second'}>
                    <div className={'img_transactions'}>
                        <img src={ExampleImage} width="55" height="55" alt="bitcoin"/>
                    </div>
                </div>
            )}
        </div>
    );
};
