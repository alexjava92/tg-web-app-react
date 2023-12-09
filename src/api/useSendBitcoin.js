// Хук для работы с сервером
import {useEffect} from "react";
import {config} from "./config";


const url = config.apiBaseUrl;
export const useSendBitcoin = (chatId, outputs, satoshisPerByte, setTxId) => {
    console.log('запрос пришел')
    useEffect(() => {
        const fetchData = async () => {
            console.log('запрос пришел')
            const data = {
                chatId: chatId,
                outputs: outputs,
                satoshisPerByte: satoshisPerByte
            }
            console.log(data)
            try {
                console.log('запрос пришел')
                const response = await fetch(`${url}/web-new-send-bitcoin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data }),
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log(responseData)
                    const newSendBitcoin = responseData.transactionId;
                    setTxId(newSendBitcoin);
                    console.log('Получен txId:', newSendBitcoin);
                } else {
                    console.error('Server returned an error:', response.status);
                }
            } catch (error) {
                console.error('Error fetching data from the server:', error);
            }
        };

        fetchData();
    }, [chatId, setTxId]);
};