// Хук для работы с сервером
import { useEffect } from "react";
import { config } from "./config";

const url = config.apiBaseUrl;
export const useGetBalanceUserWallet = (chatId, setBalance, onLoaded) => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${url}/web-new-balance-user-wallet`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ chatId }),
                });

                if (response.ok) {
                    const responseData = await response.json();
                    const newBalance = responseData.balance;

                    setBalance(newBalance.balance);
                    console.log('Получен баланс:', newBalance.balance);
                    onLoaded(); // Вызываем onLoaded после успешной установки баланса
                } else {
                    console.error('Server returned an error:', response.status);
                }
            } catch (error) {
                console.error('Error fetching data from the server:', error);
            } finally {
                if (!response.ok) {
                    onLoaded(); // Вызываем onLoaded даже если запрос завершился ошибкой
                }
            }
        };

        fetchData();
    }, [chatId, setBalance]);
};

