// useFetchBitcoinAddress.js
import { useState } from 'react';

export const useFetchBitcoinAddress = () => {
    const [bitcoinAddress, setBitcoinAddress] = useState('');

    const fetchBitcoinAddress = async (chatId) => {
        // Реализация запроса на сервер для получения нового адреса
        const response = await fetch('https://e4f6-62-33-234-17.ngrok-free.app/web-new-bitcoin-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chatId }),
        });

        if (response.ok) {
            const responseData = await response.json();
            const newAddress = responseData.address.newAddress;
            setBitcoinAddress(newAddress);
            console.log('Получен адрес:', newAddress);
            return newAddress;
        } else {
            console.error('Server returned an error:', response.status);
            throw new Error('Error fetching data from the server');
        }
    };

    return { fetchBitcoinAddress };
};


