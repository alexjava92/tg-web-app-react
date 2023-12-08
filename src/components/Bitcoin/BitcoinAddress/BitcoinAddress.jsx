import React, { useEffect, useState } from 'react';
import './BitcoinAddress.css';
import '../../../GlobalStyle.css';
import { useTelegram } from '../../../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useFetchBitcoinAddress } from '../../../api/useFetchBitcoinAddress';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';

const BitcoinAddress = () => {
    const { tg, chatId } = useTelegram();
    const backButton = tg.BackButton;
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(true);

    const { fetchBitcoinAddress } = useFetchBitcoinAddress();

    const { handleCopyAddress } = useCopyToClipboard();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const newAddress = await fetchBitcoinAddress(chatId);
                setAddress(newAddress);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data from the server:', error);
                setLoading(false);
            }
        };

        fetchData();

        backButton.show();

        return () => {
            backButton.hide();
        };
    }, [chatId, backButton, fetchBitcoinAddress]);

    backButton.onClick(() => {
        navigate(-1);
    });

    return (
        <div className={'body'}>
            <h3>Новый адрес биткоина:</h3>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <p>
                    <code style={{ fontFamily: 'monospace' }}>{address}</code>
                </p>
            )}
            <CopyToClipboard text={address}>
                <button className={'button'} onClick={handleCopyAddress}>
                    Скопировать адрес bitcoin
                </button>
            </CopyToClipboard>
            <ToastContainer />
        </div>
    );
};

export default BitcoinAddress;
