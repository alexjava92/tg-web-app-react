import { useState } from 'react';
import { sendBitcoinToServer } from "../../../api/useSendBitcoin";
import { convertBitcoinToSatoshis } from "../../../calculator/convertSatoshisToBitcoin.mjs";

export const useSendBitcoin = (chatId) => {
    const [txId, setTxId] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleSendBitcoin = async (bitcoinAmount, bitcoinAddress, satoshiPerByte) => {
        setIsSending(true);

        const bitcoinSatoshi = convertBitcoinToSatoshis(bitcoinAmount);
        const newOutput = { address: bitcoinAddress, amount: parseFloat(bitcoinSatoshi) };
        const updatedOutputs = [newOutput];

        await sendBitcoinToServer(chatId, updatedOutputs, satoshiPerByte, setTxId, setIsSent, setIsError);

        setIsSending(false);
    };

    return { handleSendBitcoin, txId, isSent, isSending, isError };
};
