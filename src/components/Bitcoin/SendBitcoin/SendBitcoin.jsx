import React, {useEffect, useState} from 'react';
import {useTelegram} from "../../../hooks/useTelegram";
import {useNavigate} from "react-router-dom";
import '../../../GlobalStyle.css'
import './SendBitcoin.css'
import {useGetBalanceUserWallet} from "../../../api/useGetBalanceUserWallet";
import {config} from "../../../api/config";
import {BitcoinNetworkFees} from "../../../BitcoinNetworkFees/BitcoinNetworkFees";
import {useCopyToClipboard} from "../../../hooks/useCopyToClipboard";
import 'react-toastify/dist/ReactToastify.css';
import CopyToClipboard from 'react-copy-to-clipboard';
import {ToastContainer} from "react-toastify";
import {sendBitcoinToServer} from "../../../api/useSendBitcoin";
import {isValidBitcoinAddress} from "../../../api/ValidAddress/ValidAddres.mjs";
import {logDOM} from "@testing-library/react";
import {LoadingSpinner} from "../../../LoadingSpinner/LoadingSpinner";
import {
    convertBitcoinToSatoshis,
    convertBtcToRub,
    convertSatoshisToBitcoin
} from "../../../calculator/convertSatoshisToBitcoin.mjs";


const url = config.apiBaseUrl;
export const SendBitcoin = () => {
    const {tg, chatId} = useTelegram();
    const backButton = tg.BackButton;
    const navigate = useNavigate();

    const [balanceToBtc, setBalanceToBtc] = useState('');
    const [balance, setBalance] = useState('');
    const [balanceToRub, setBalanceToRub] = useState('');
    const [bitcoinAmount, setBitcoinAmount] = useState('');
    const [bitcoinAddress, setBitcoinAddress] = useState('');
    const [satoshiPerByte, setSatoshiPerByte] = useState('')
    const [outputs, setOutputs] = useState([]);
    const [txId, setTxId] = useState('')
    const [isSent, setIsSent] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isValidAddress, setIsValidAddress] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isCustomFee, setIsCustomFee] = useState(false);

    // Используем ваш хук для получения баланса
    useGetBalanceUserWallet(chatId, setBalance, () => setIsLoading(false));


    const handleBitcoinAmountChange = (e) => {
        const inputValue = e.target.value;
        // Разрешаем вводить только цифры, точки и запятые
        const validInput = inputValue.match(/^[\d.,]*$/);

        if (validInput) {
            const formattedInput = validInput[0].replace(',', '.'); // Заменяем запятые на точки
            // Ограничиваем количество цифр после запятой до 8
            const finalInput = formattedInput.match(/^-?\d*(\.\d{0,8})?/)[0];

            const amount = parseFloat(finalInput); // Преобразование введенного значения в число

            // Проверка на NaN и сравнение с балансом
            if (!isNaN(amount) && amount <= balanceToBtc) {
                setBitcoinAmount(amount);
            } else if (isNaN(amount)) {
                setBitcoinAmount(''); // Очистить поле, если введено некорректное значение
            } else {
                setBitcoinAmount(balanceToBtc); // Установка значения равного балансу, если введенное значение больше
            }
        } else {
            e.target.value = e.target.value.slice(0, -1); // Удаляем последний символ, если он недопустим
        }
    };

    const handleBitcoinAddressChange = async (e) => {
        const address = e.target.value;
        const isValid = await isValidBitcoinAddress(address);
        setIsValidAddress(isValid); // Обновление состояния валидности
        setBitcoinAddress(address);
        console.log(isValid ? "Адрес валиден." : "Невалидный адрес.");
    };

    const handleCommissionSelect = (selectedCommission) => {
        setIsCustomFee(selectedCommission === '');
        setSatoshiPerByte(selectedCommission);
        console.log('Выбрана комиссия:', selectedCommission);
    };

    const {handleCopyAddress} = useCopyToClipboard('Транзакция скопирована');

    const handleSendBitcoin = async () => {
        setIsSending(true);
        tg.MainButton.hide();

        const bitcoinSatoshi = convertBitcoinToSatoshis(bitcoinAmount);
        console.log('bitcoinSatoshi', bitcoinSatoshi)

        // Формируем новый объект для выхода
        const newOutput = {address: bitcoinAddress, amount: parseFloat(bitcoinSatoshi)};

        // Массив outputs обновляем непосредственно перед отправкой данных
        const updatedOutputs = [newOutput];
        console.log(updatedOutputs)
        setOutputs(updatedOutputs);

        await sendBitcoinToServer(chatId, updatedOutputs, satoshiPerByte, setTxId, setIsSent);

        // Очищаем поля ввода
        setBitcoinAmount("");
        setBitcoinAddress("");
        setSatoshiPerByte(0);
        setIsSending(false);
    };

    useEffect(() => {
        setBalanceToBtc(convertSatoshisToBitcoin(balance));
    }, [balance]);

    useEffect(() => {
        const fetchBalanceToRub = async () => {
            const convertedBalance = await convertBtcToRub(balanceToBtc);
            setBalanceToRub(convertedBalance);
        };

        fetchBalanceToRub();
    }, [balanceToBtc]); // добавил balanceToBtc в массив зависимостей


    useEffect(() => {
        // Показываем кнопку назад после загрузки данных
        backButton.show();
    }, [backButton]);

    backButton.onClick(() => {
        navigate(-1);
    });

    useEffect(() => {
        if (bitcoinAmount !== '' && bitcoinAddress !== '' && satoshiPerByte !== '') {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Отправить ${bitcoinAmount}`
            });
        } else {
            tg.MainButton.hide();
        }
    }, [bitcoinAmount, bitcoinAddress, satoshiPerByte]);

    useEffect(() => {
        tg.onEvent('mainButtonClicked', handleSendBitcoin)
        return () => {
            tg.offEvent('mainButtonClicked', handleSendBitcoin)
        }
    }, [handleSendBitcoin])

    const transactionUrl = `${config.mempoolUrl}/tx/${txId}`;
    // Рендеринг страницы успеха
    const renderSuccessPage = () => {
        return (
            <div className="success-container">
                <div className="success-icon">✔️</div>
                <h2 className="success-header">Транзакция успешно отправлена!</h2>
                <p className="success-txid">Идентификатор транзакции: {txId}</p>
                <CopyToClipboard text={txId}>
                    <button className={'button'} onClick={handleCopyAddress}>
                        Скопировать транзакцию
                    </button>
                </CopyToClipboard>
                <div>
                    <a href={transactionUrl} target="_blank" rel="noopener noreferrer" className="transaction-link">
                        Посмотреть транзакцию
                    </a>
                </div>
                <ToastContainer />
            </div>

        );
    };

    // Рендеринг основного интерфейса
    const renderForm = () => {
        return (
            <div className={'send-bitcoin-container'}>
                <div>
                    <h2 className="h2">
                        <div>{balanceToBtc} BTC</div>
                        <div>{balanceToRub} ₽</div>
                    </h2>
                </div>
                <div>
                    <input
                        className={'input'}
                        type="number"
                        id="bitcoinAmount"
                        value={bitcoinAmount}
                        min="0.000001"
                        max={balanceToBtc}
                        placeholder="Сумма минимум 0.000001"
                        onChange={handleBitcoinAmountChange}
                    />
                </div>
                <div>
                    <input
                        className={`input ${!isValidAddress ? 'invalid-text' : ''}`}
                        type="text"
                        id="bitcoinAddress"
                        value={bitcoinAddress}
                        placeholder="Адрес"
                        onChange={handleBitcoinAddressChange}
                    />
                </div>
                <div>
                    <div>
                        <BitcoinNetworkFees onSelect={handleCommissionSelect}/>
                        {isCustomFee && (
                            <input
                                type="number"
                                className={'input'}
                                value={satoshiPerByte}
                                onChange={(e) => setSatoshiPerByte(e.target.value === '' ? '' : Number(e.target.value))}
                                placeholder="Введите комиссию минимум: 2 (sat/byte)"
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            {isLoading ? <LoadingSpinner/> : (isSending ?
                <LoadingSpinner/> : (isSent ? renderSuccessPage() : renderForm()))}
        </div>
    );
};

