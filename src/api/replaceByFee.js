import {config} from "./config";


const url = config.apiBaseUrl;
export const sendReplaceByFee = async (chatId, satoshisPerByte, originalTxId, setNewTxHash, setError) => {
    console.log('запрос пришел');

    const data = {
        chatId: chatId,
        satoshisPerByte: satoshisPerByte,
        originalTxId: originalTxId
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
            if (responseData.transactionTxId.newTxId){
                const transactionId = responseData.transactionTxId.newTxId;
                setNewTxHash(transactionId);
                console.log('Получен txId:', transactionId);
            } else {
                const error = responseData.transactionTxId.message;
                setError(error);
                console.log('Error:', error);
            }


        } else {
            console.error('Server returned an error:', response.status);

        }
    } catch (error) {
        console.error('Error fetching data from the server:', error);

    }
};