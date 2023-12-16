import {config} from "./config";


const url = config.apiBaseUrl;
export const sendReplaceByFee = async (chatId, satoshisPerByte, originalTxId) => {
    console.log('запрос пришел');
    let increase = satoshisPerByte * 0.54;
    satoshisPerByte += increase;

    const data = {
        chatId: chatId,
        satoshisPerByte: increase,
        originalTxId: satoshisPerByte
    };
    console.log("originalTxId", originalTxId)

    try {
        console.log('запрос пришел');
        const response = await fetch(`${url}/web-new-replace-by-fee`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data}),
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('responseData', responseData);
            const transactionId = responseData.transactionTxId;
            console.log('Получен txId:', transactionId);

        } else {
            console.error('Server returned an error:', response.status);

        }
    } catch (error) {
        console.error('Error fetching data from the server:', error);

    }
};