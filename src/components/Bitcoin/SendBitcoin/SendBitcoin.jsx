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
import ExampleImage from '../../../img/bitcoin.png';
import {LoadingSpinner} from "../../../LoadingSpinner/LoadingSpinner";
import {
    convertBitcoinToSatoshis,
    convertBtcToRub,
    convertSatoshisToBitcoin, formatNumberWithSpaces
} from "../../../calculator/convertSatoshisToBitcoin.mjs";
import {Balance} from '../Balance/Balance';
import {BitcoinInput} from "../BitcoinInput/BitcoinInput";
import {useSendBitcoin} from "../Hooks/useSendBitcoinHook";
import {getWeightTransactions} from "../../../api/useGetWeightTransaction";
import LocalLoadingSpinner from "../../../LoadingSpinner/LocalLoadingSpinner";
// В начале вашего файла компонента


const url = config.apiBaseUrl;
export const SendBitcoin = () => {
    const {tg, chatId} = useTelegram();
    const backButton = tg.BackButton;
    const navigate = useNavigate();


    const [balanceToBtc, setBalanceToBtc] = useState('');
    const [balance, setBalance] = useState('');
    const [balanceToRub, setBalanceToRub] = useState('');
    const [satoshiPerByte, setSatoshiPerByte] = useState('')
    const [isLoading, setIsLoading] = useState(true);
    const [isCustomFee, setIsCustomFee] = useState(false);
    const [isTotalAmountValid, setIsTotalAmountValid] = useState(true);
    const [virtualSize, setVirtualSize] = useState('');
    const [isFetchingFee, setIsFetchingFee] = useState(false);
    const [showBitcoinFees, setShowBitcoinFees] = useState(false);


    // Массив для хранения вводов
    const [inputs, setInputs] = useState([{
        bitcoinAmount: '',
        bitcoinAddress: '',
        isValidAddress: true,  // Новое свойство для каждого инпута
        rubAmount: '',
        validBalance: true,


    }]);

    // Добавление нового ввода
    const addInput = () => {
        setInputs([...inputs, {
            bitcoinAmount: '',
            bitcoinAddress: '',
            isValidAddress: true,
            rubAmount: '',
            validBalance: true,
        }]);
        setShowBitcoinFees(false); // Сбросить состояние для показа кнопки
        setIsCustomFee(false);
    };

    // Удаление ввода
    const removeInput = index => {
        const newInputs = [...inputs];
        newInputs.splice(index, 1);
        setInputs(newInputs);
    };

    // Обновление конкретного ввода
    const updateInput = (index, newInput) => {
        const newInputs = [...inputs];
        newInputs[index] = newInput;
        setInputs(newInputs);
    };


// Проверка, что все вводы корректны
    const allInputsValid = inputs.every(input =>
        input.bitcoinAmount
        && input.bitcoinAddress
        && input.isValidAddress
        && input.validBalance
    ) && isTotalAmountValid;

    const outputs = inputs.map(input => ({
        address: input.bitcoinAddress,
        amount: convertBitcoinToSatoshis(input.bitcoinAmount),

        // и другие необходимые данные для каждого input
    }));


    // Используем ваш хук для получения баланса
    const handleLoaded = useCallback(() => {
        // Логика после загрузки данных
        setIsLoading(false);
    }, []);

    useGetBalanceUserWallet(chatId, setBalance, handleLoaded);
    // Внутри компонента SendBitcoin
    const totalBitcoinAmount = inputs.reduce((total, input) => {
        const amount = parseFloat(input.bitcoinAmount) || 0;
        return parseFloat((total + amount).toFixed(8));
    }, 0);


    const handleCommissionSelect = (selectedCommission) => {
        setIsCustomFee(selectedCommission === '');
        setSatoshiPerByte(selectedCommission);

        console.log('Выбрана комиссия:', selectedCommission);
    };


    const toggleBitcoinFeesDisplay = async () => {
        if (allInputsValid) {
            setShowBitcoinFees(!showBitcoinFees);
            if (!showBitcoinFees) {
                setIsFetchingFee(true);
                await getWeightTransactions(chatId, outputs, setVirtualSize);
                setIsFetchingFee(false);
            }
        }
    };


    const {handleCopyAddress} = useCopyToClipboard('Транзакция скопирована');

    const {handleSendBitcoin, txId, isSent, isSending, isError} = useSendBitcoin(chatId);

    // Изменение функции onSendClick
    const onSendClick = async () => {
        tg.MainButton.disable();
        if (allInputsValid && satoshiPerByte) {
            await handleSendBitcoin(inputs, satoshiPerByte);
            tg.MainButton.enable();
        } else {
            console.log('Некорректные параметры');
            // Обработка ошибок или невалидных данных
        }
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

    // Обновление состояния кнопки в зависимости от вводов
    useEffect(() => {
        if (allInputsValid && satoshiPerByte) {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Отправить`
            });
        } else {
            tg.MainButton.hide();
        }
    }, [inputs, satoshiPerByte]);

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendClick)
        return () => {
            tg.MainButton.hide();
            tg.offEvent('mainButtonClicked', onSendClick)
        }
    }, [onSendClick])

    useEffect(() => {
        const totalAmount = convertBitcoinToSatoshis(totalBitcoinAmount);
        const isValid = totalAmount <= balance;
        setIsTotalAmountValid(isValid);
        console.log("Total Amount Valid:", isValid);
    }, [totalBitcoinAmount, balance]);


    useEffect(() => {
        console.log("Текущий вес транзакции:", virtualSize);
    }, [virtualSize]);

    backButton.onClick(() => {
        navigate(-1);
    });


    const transactionUrl = `${config.mempoolUrl}/tx/${txId}`;
    // Рендеринг страницы успеха
    const renderSuccessPage = () => {
        return (
            <div className="success-container">
                <div className={'body_second'}>
                    <div className="success-icon">✔️</div>
                    <h2 className="success-header">Транзакция успешно отправлена!</h2>
                </div>
                <div className={'body_second'}>
                    <p className="success-txid">{txId}</p>
                </div>
                <CopyToClipboard text={txId}>
                    <button className={'button'} onClick={handleCopyAddress}>
                        Скопировать транзакцию
                    </button>
                </CopyToClipboard>
                <div className={'body_second'}>
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

                {totalBitcoinAmount > 0 && (
                    <div className={'total_amount_bitcoin'}>
                        <label className={`${!isTotalAmountValid ? 'invalid-text' : ''}`}>
                            {!isTotalAmountValid
                                ? `Недостаточно баланса для отправки ${totalBitcoinAmount} BTC`
                                : `Всего к отправке: ${totalBitcoinAmount} BTC`}
                        </label>
                    </div>
                )}

                <div>
                    {inputs.map((input, index) => (
                        <BitcoinInput
                            key={index}
                            index={index}
                            bitcoinAmount={input.bitcoinAmount}
                            setBitcoinAmount={amount => updateInput(index, {...input, bitcoinAmount: amount})}
                            bitcoinAddress={input.bitcoinAddress}
                            setBitcoinAddress={address => updateInput(index, {...input, bitcoinAddress: address})}
                            setIsValidAddress={isValid => updateInput(index, {...input, isValidAddress: isValid})}
                            isValidAddress={input.isValidAddress}
                            rubAmount={input.rubAmount}
                            setRubAmount={amount => updateInput(index, {...input, rubAmount: amount})}
                            balanceToBtc={balanceToBtc}
                            removeInput={removeInput}
                            canRemove={inputs.length > 1}
                            balance={balance}
                            validBalance={input.validBalance}
                            setValidBalance={isValid => updateInput(index, {...input, validBalance: isValid})}
                        />
                    ))}
                    <div className={'span_add_block'}>
                        <span className={'span_add'} onClick={addInput}>Добавить получателя</span>
                    </div>

                </div>

                <div className={'body_second'}>
                    <div>
                        {showBitcoinFees ? (isFetchingFee ? <LocalLoadingSpinner/> :
                                <BitcoinNetworkFees onSelect={handleCommissionSelect} virtualSize={virtualSize}/>) :
                            <span className={'span_add'}
                                  onClick={toggleBitcoinFeesDisplay}>Установить комиссию сети</span>}
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
                <div className={'body_second'}>
                    <div className="error-icon">❌</div>
                    <h2>Ошибка при отправке</h2>
                </div>
                <div className={'body_second'}>
                    <p>Произошла ошибка при отправке Bitcoin. Пожалуйста, попробуйте снова.</p>
                </div>
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

