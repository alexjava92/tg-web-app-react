import { useEffect } from "react";
import { config } from "./config";

const url = config.apiBaseUrl;

export const useFetchBitcoinAddress = (chatId, setAddress, onLoaded) => {
    useEffect(() => {
        const fetchData = async () => {
            let requestFailed = false; // Добавляем флаг, указывающий на ошибку

            try {
                const response = await fetch(`${url}/web-new-bitcoin-address`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ chatId }),
                });

                if (response.ok) {
                    const responseData = await response.json();
                    const newAddress = responseData.address.newAddress;
                    setAddress(newAddress);
                    console.log('Получен адрес:', newAddress);
                } else {
                    console.error('Server returned an error:', response.status);
                    requestFailed = true; // Устанавливаем флаг ошибки
                }
            } catch (error) {
                console.error('Error fetching data from the server:', error);
                requestFailed = true; // Устанавливаем флаг ошибки
            } finally {
                if (requestFailed) {
                    console.log('Запрос завершился с ошибкой');
                }
                onLoaded(); // Вызываем onLoaded в блоке finally
            }
        };

        fetchData();
    }, [chatId, setAddress]);
};
