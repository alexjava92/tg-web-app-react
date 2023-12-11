import { useEffect } from "react";
import { config } from "./config";

const url = config.apiBaseUrl;

export const useGetBalanceUserWallet = (chatId, setBalance, onLoaded) => {
    useEffect(() => {
        const fetchData = async () => {
            let responseStatus = 0; // Добавляем переменную для отслеживания статуса ответа

            try {
                const response = await fetch(`${url}/web-new-balance-user-wallet`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ chatId }),
                });

                responseStatus = response.status; // Обновляем статус ответа

                if (response.ok) {
                    const responseData = await response.json();
                    const newBalance = responseData.balance;
                    setBalance(newBalance.balance);
                    console.log('Получен баланс:', newBalance.balance);
                } else {
                    console.error('Server returned an error:', response.status);
                }
            } catch (error) {
                console.error('Error fetching data from the server:', error);
            } finally {
                if (responseStatus !== 200) {
                    console.log('Запрос завершился с ошибкой:', responseStatus);
                }
                onLoaded(); // Вызываем onLoaded в блоке finally
            }
        };

        fetchData();
    }, [chatId, setBalance, onLoaded]); // Добавляем onLoaded в массив зависимостей
};
