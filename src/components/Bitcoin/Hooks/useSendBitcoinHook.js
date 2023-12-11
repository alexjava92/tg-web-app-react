import { useState } from 'react';
import { sendBitcoinToServer } from "../../../api/useSendBitcoin";
import { convertBitcoinToSatoshis } from "../../../calculator/convertSatoshisToBitcoin.mjs";

export const useSendBitcoin = (chatId) => {
    const [txId, setTxId] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleSendBitcoin = async (inputs, satoshiPerByte) => {
        setIsSending(true);

        // Преобразовываем каждый ввод в формат, требуемый сервером
        const outputs = inputs.map(input => ({
            address: input.bitcoinAddress,
            amount: parseFloat(convertBitcoinToSatoshis(input.bitcoinAmount)),
        }));

        await sendBitcoinToServer(chatId, outputs, satoshiPerByte, setTxId, setIsSent, setIsError);

        setIsSending(false);
    };

    return { handleSendBitcoin, txId, isSent, isSending, isError };
};
