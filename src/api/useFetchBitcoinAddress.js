// Хук для работы с сервером
import {useEffect} from "react";
import {config} from "./config";

const url = config.apiBaseUrl;
export const useFetchBitcoinAddress = (chatId, setAddress, onLoaded) => {
    useEffect(() => {
        const fetchData = async () => {
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
                    onLoaded();
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
    }, [chatId, setAddress]);
};