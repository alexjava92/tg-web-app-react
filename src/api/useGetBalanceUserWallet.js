// Хук для работы с сервером
import { useEffect } from "react";
import { config } from "./config";

const url = config.apiBaseUrl;
export const useGetBalanceUserWallet = (chatId, setBalance) => {
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

                    // Проверка, изменился ли баланс
                    if (newBalance !== setBalance) {
                        setBalance(newBalance);
                        console.log('Получен баланс:', newBalance);
                    }
                } else {
                    console.error('Server returned an error:', response.status);
                }
            } catch (error) {
                console.error('Error fetching data from the server:', error);
            }
        };

        fetchData();
    }, [chatId, setBalance]);
};
