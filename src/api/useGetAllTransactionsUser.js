import { useEffect } from "react";
import { config } from "./config";

const url = config.apiBaseUrl;

export const useGetAllTransactionsUser = (chatId, setTransactions) => {
    const fetchData = async () => {
        let responseStatus = 0; // Добавляем переменную для отслеживания статуса ответа

        try {
            const response = await fetch(`${url}/web-new-get-all-transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatId }),
            });

            responseStatus = response.status; // Обновляем статус ответа

            if (response.ok) {
                const responseData = await response.json();
                const allTransaction = responseData.allTransactions;
                setTransactions(allTransaction);
                console.log('Получены транзакции:', allTransaction);
            } else {
                console.error('Server returned an error:', response.status);
            }
        } catch (error) {
            console.error('Error fetching data from the server:', error);
        } finally {
            if (responseStatus !== 200) {
                console.log('Запрос завершился с ошибкой:', responseStatus);
            }
        }
    };

    return fetchData;
};

