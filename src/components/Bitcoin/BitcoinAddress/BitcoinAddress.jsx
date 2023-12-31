import React, {useCallback, useEffect, useState} from 'react';
import './BitcoinAddress.css';
import '../../../GlobalStyle.css';
import {useTelegram} from '../../../hooks/useTelegram';
import {useNavigate} from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CopyToClipboard from 'react-copy-to-clipboard';
import {useFetchBitcoinAddress} from "../../../api/useFetchBitcoinAddress";
import {useCopyToClipboard} from "../../../hooks/useCopyToClipboard";
import {LoadingSpinner} from "../../../LoadingSpinner/LoadingSpinner";
import QRCode from 'qrcode.react';
import bitcoinImage from '../../../img/bitcoin.png';
import { IoCopyOutline } from "react-icons/io5";
import { PiWarningCircle } from "react-icons/pi";



const BitcoinAddress = () => {
    const {tg, chatId} = useTelegram();
    const backButton = tg.BackButton;
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Используем хуки для работы с сервером и уведомлениями
    useFetchBitcoinAddress(chatId, setAddress, () => setIsLoading(false));
    const {handleCopyAddress} = useCopyToClipboard('Адрес скопирован');

    useEffect(() => {
        // Показываем кнопку назад после загрузки данных
        backButton.show();
    }, [backButton]);

    backButton.onClick(() => {
        navigate(-1);
    });


    const renderForm = () => {
        return (
            <div className={'body'}>
                <h2>Bitcoin</h2>
                <div className={'body_second'}>
                    <QRCode className={'qr-code'}
                            value={address}
                            renderAs="svg"
                            size={200}
                            bgColor="var(--tg-theme-bg-color)"
                            fgColor="var(--tg-theme-text-color)"
                            level="Q"
                            includeMargin={true}
                            imageSettings={{
                                src: bitcoinImage,
                                x: null,
                                y: null,
                                height: 45,
                                width: 45,
                                excavate: true,
                            }}/>
                </div>
                <div className={'body_second'}>
                    <p>
                        <code style={{fontFamily: 'monospace', wordBreak: 'break-all'}}>
                            {address}
                        </code>
                    </p>
                </div>
                <CopyToClipboard text={address}>
                    <button className={'copy-button'} onClick={handleCopyAddress}>
                        <IoCopyOutline
                            className={'icon_copy'}
                            size={'20px'}
                        />  Скопировать адрес
                    </button>
                </CopyToClipboard>
                <ToastContainer/>
                <div className={'body_second'}>
                    <p>Отправляйте только Bitcoin (BTC) на этот адрес. Другие активы могут не дойти и будут безвозвратно
                        утрачены.</p>
                </div>

            </div>
        );
    }

    return (
        <div>
            {isLoading ? <LoadingSpinner/> : renderForm()}
        </div>
    );
};

export default BitcoinAddress;
