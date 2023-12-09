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

                    // Убедитесь, что у вас есть корректный путь к свойству balance в объекте
                    const newBalance = responseData.balance;

                    setBalance(newBalance.balance);
                    console.log('Получен баланс:', newBalance.balance);

                } else {
                    console.error('Server returned an error:', response.status);
                }
            } catch (error) {
                console.error('Error fetching data from the server:', error);
            }
        };
        fetchData();
        onLoaded();
    }, [chatId, setBalance]);
};
