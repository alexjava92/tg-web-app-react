import React, { useCallback, useEffect, useState } from 'react';
import './BitcoinAddress.css';
import '../../../GlobalStyle.css';
import { useTelegram } from '../../../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CopyToClipboard from 'react-copy-to-clipboard';
import {useFetchBitcoinAddress} from "../../../api/useFetchBitcoinAddress";
import {useCopyToClipboard} from "../../../hooks/useCopyToClipboard";
import {LoadingSpinner} from "../../../LoadingSpinner/LoadingSpinner";



const BitcoinAddress = () => {
    const { tg, chatId } = useTelegram();
    const backButton = tg.BackButton;
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Используем хуки для работы с сервером и уведомлениями
    useFetchBitcoinAddress(chatId, setAddress, () => setIsLoading(false));
    const { handleCopyAddress } = useCopyToClipboard('Адрес скопирован');

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
                <h3>Новый адрес биткоина:</h3>
                <p><code style={{ fontFamily: 'monospace' }}>{address}</code></p>
                <CopyToClipboard text={address}>
                    <button className={'button'} onClick={handleCopyAddress}>
                        Скопировать адрес bitcoin
                    </button>
                </CopyToClipboard>
                <ToastContainer />
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
