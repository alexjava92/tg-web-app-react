// Хук для работы с сервером
import {useEffect} from "react";
import {config} from "./config";


const url = config.apiBaseUrl;
export const getWeightTransactions = async (chatId, outputs, setVirtualSize) => {
    console.log('запрос пришел');
    const data = {
        chatId: chatId,
        outputs: outputs,
    };
    console.log("outputs", outputs)

    try {
        console.log('запрос пришел');
        const response = await fetch(`${url}/web-new-get-weight-transaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data}),
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('responseData', responseData);
            const virtualSize = responseData.detailTransaction.virtualSize;
            console.log('Получен virtualSize:', virtualSize);
            setVirtualSize(virtualSize)

        } else {
            console.error('Server returned an error:', response.status);
        }
    } catch (error) {
        console.error('Error fetching data from the server:', error);

    }
};