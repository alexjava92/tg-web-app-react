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



const url = config.apiBaseUrl;
export const SendBitcoin = () => {
    const {tg, chatId} = useTelegram();
    const backButton = tg.BackButton;
    const navigate = useNavigate();

    const [balance, setBalance] = useState('');
    const [bitcoinAmount, setBitcoinAmount] = useState('');
    const [bitcoinAddress, setBitcoinAddress] = useState('');
    const [satoshiPerByte, setSatoshiPerByte] = useState(0)
    const [outputs, setOutputs] = useState([]);
    const [txId, setTxId] = useState('')
    const [isSent, setIsSent] = useState(false);


    // Используем ваш хук для получения баланса
    useGetBalanceUserWallet(chatId, setBalance)


    const handleBitcoinAmountChange = (e) => {
        setBitcoinAmount(e.target.value);
        console.log(e.target.value)
    };

    const handleBitcoinAddressChange = (e) => {
        setBitcoinAddress(e.target.value);
        console.log(e.target.value)
    };

    const handleCommissionSelect = (selectedCommission) => {
        // Обработка выбора комиссии в родительском компоненте
        setSatoshiPerByte(selectedCommission);
        console.log('Выбрана комиссия:', selectedCommission);
    };

    const { handleCopyAddress } = useCopyToClipboard('Транзакция скопирована');

    const handleSendBitcoin = async () => {
        // Формируем новый объект для выхода и добавляем его в массив outputs
        const newOutput = { address: bitcoinAddress, amount: parseFloat(bitcoinAmount) };
        await setOutputs([newOutput]);

        await sendBitcoinToServer(chatId, outputs, 2, setTxId, setIsSent)
        // Очищаем поля ввода
        setBitcoinAmount("")
        setBitcoinAddress("")
        setSatoshiPerByte(0)
        setOutputs([])
    };
    console.log(outputs)

    // Перенесенная логика из useSendBitcoin.js


    useEffect(() => {
        // Показываем кнопку назад после загрузки данных
        backButton.show();
    }, [backButton]);

    backButton.onClick(() => {
        navigate(-1);
    });

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
                <ToastContainer />
            </div>

        );
    };

    // Рендеринг основного интерфейса
    const renderForm = () => {
        return (
            <div className={'send-bitcoin-container'}>
                <div>
                    <h2 className={'h2'}>Баланс кошелька: {balance} </h2>
                </div>
                <div>
                    <label htmlFor="bitcoinAmount">Количество bitcoin:</label>
                    <input
                        className={'input'}
                        type="number"
                        id="bitcoinAmount"
                        value={bitcoinAmount}
                        onChange={handleBitcoinAmountChange}
                    />
                </div>
                <div>
                    <label htmlFor="bitcoinAddress">Адрес bitcoin:</label>
                    <input
                        className={'input'}
                        type="text"
                        id="bitcoinAddress"
                        value={bitcoinAddress}
                        onChange={handleBitcoinAddressChange}
                    />
                </div>
                <div>
                    <BitcoinNetworkFees onSelect={handleCommissionSelect}/>
                </div>
                <div>
                    <button className={'button'} onClick={handleSendBitcoin}>Отправить</button>
                </div>
            </div>
        );
    };

    return (
        <div>
            {isSent ? renderSuccessPage() : renderForm()}
        </div>
    );
};

