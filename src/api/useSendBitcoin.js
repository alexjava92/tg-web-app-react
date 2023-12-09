// Хук для работы с сервером
import {useEffect} from "react";
import {config} from "./config";


const url = config.apiBaseUrl;
export const sendBitcoinToServer = async (chatId, outputs, satoshisPerByte, setTxId, setIsSent) => {
    console.log('запрос пришел');
    const data = {
        chatId: chatId,
        outputs: outputs,
        satoshisPerByte: satoshisPerByte
    };

    try {
        console.log('запрос пришел');
        const response = await fetch(`${url}/web-new-send-bitcoin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data }),
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('responseData', responseData);
            const transaction = responseData.transactionTxId.txId;
            console.log('Получен txId:', transaction);
            setTxId(transaction);
            setIsSent(true);

        } else {
            console.error('Server returned an error:', response.status);
        }
    } catch (error) {
        console.error('Error fetching data from the server:', error);
    }
};