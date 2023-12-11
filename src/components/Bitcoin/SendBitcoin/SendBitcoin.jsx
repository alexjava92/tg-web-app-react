import React, {useCallback, useEffect, useState} from 'react';
import {useTelegram} from "../../../hooks/useTelegram";
import {useNavigate} from "react-router-dom";
import '../../../GlobalStyle.css'
import './SendBitcoin.css'
import '../../../App.css'
import {useGetBalanceUserWallet} from "../../../api/useGetBalanceUserWallet";
import {config} from "../../../api/config";
import {BitcoinNetworkFees} from "../../../BitcoinNetworkFees/BitcoinNetworkFees";
import {useCopyToClipboard} from "../../../hooks/useCopyToClipboard";
import 'react-toastify/dist/ReactToastify.css';
import CopyToClipboard from 'react-copy-to-clipboard';
import {ToastContainer} from "react-toastify";
import {sendBitcoinToServer} from "../../../api/useSendBitcoin";
import {isValidBitcoinAddress} from "../../../api/ValidAddress/ValidAddres.mjs";
import ExampleImage from '../../../img/bitcoin.png';
import {LoadingSpinner} from "../../../LoadingSpinner/LoadingSpinner";
import {
    convertBitcoinToSatoshis,
    convertBtcToRub,
    convertSatoshisToBitcoin, formatNumberWithSpaces
} from "../../../calculator/convertSatoshisToBitcoin.mjs";
import {Balance} from '../Balance/Balance';
import {BitcoinInput} from "../BitcoinInput/BitcoinInput";
// В начале вашего файла компонента


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
    const [isError, setIsError] = useState(false);
    const [isValidAddress, setIsValidAddress] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isCustomFee, setIsCustomFee] = useState(false);

    // Используем ваш хук для получения баланса
    const handleLoaded = useCallback(() => {
        // Логика после загрузки данных
        setIsLoading(false);
    }, []);

    useGetBalanceUserWallet(chatId, setBalance, handleLoaded);


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

        await sendBitcoinToServer(chatId, updatedOutputs, satoshiPerByte, setTxId, setIsSent, setIsError);

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

            setBalanceToRub(formatNumberWithSpaces(convertedBalance));
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
        if (bitcoinAmount !== '' && bitcoinAddress !== '' && isValidAddress === true && satoshiPerByte !== '') {
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
                <ToastContainer/>
            </div>

        );
    };

    // Рендеринг основного интерфейса
    const renderForm = () => {
        return (

            <div className={'send-bitcoin-container'}>
                <div className={'img_bitcoin'}>
                    <img src={ExampleImage} width="70" height="70" alt="bitcoin"/>
                </div>
                <Balance balanceToBtc={balanceToBtc} balanceToRub={balanceToRub}/>

                <BitcoinInput
                    bitcoinAmount={bitcoinAmount}
                    setBitcoinAmount={setBitcoinAmount}
                    bitcoinAddress={bitcoinAddress}
                    setBitcoinAddress={setBitcoinAddress}
                    setIsValidAddress={setIsValidAddress}
                    isValidAddress={isValidAddress}
                    balanceToBtc={balanceToBtc}
                />

                <div className={'body_second'}>
                    <div>
                        <BitcoinNetworkFees onSelect={handleCommissionSelect}/>
                    </div>
                    <div>
                        {isCustomFee && (
                            <input
                                className={'input'}
                                type="number"
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

    // Рендеринг страницы ошибки
    const renderErrorPage = () => {
        return (
            <div className="error-container">
                <div className="error-icon">❌</div>
                <h2>Ошибка при отправке</h2>
                <p>Произошла ошибка при отправке Bitcoin. Пожалуйста, попробуйте снова.</p>
            </div>
        );
    };


    return (
        <div>
            {isLoading ? <LoadingSpinner/>
                : isError ? renderErrorPage()
                    : (isSending ? <LoadingSpinner/>
                        : (isSent ? renderSuccessPage()
                            : renderForm()))}
        </div>
    );

};

