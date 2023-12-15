import {config} from "./config";


export async function isValidBitcoinAddress(address) {
    try {
        const response = await fetch(`${url}/web-new-get-valid-bitcoin-address`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address }),
        });

        if (response.ok) {
            const responseData = await response.json();
            return responseData.isValid; // Возвращаем значение isValid
        } else {
            console.error('Server returned an error:', response.status);
            return false; // Возвращаем false при ошибке сервера
        }
    } catch (error) {
        console.error('Error fetching data from the server:', error);
        return false; // Возвращаем false при ошибке запроса
    }
}

/*// Пример использования функции
isValidBitcoinAddress('2Mz87LWo5GgbHVZhx48nxZQfCh84opc9rzn').then(isValid => {
    console.log('Is valid address:', isValid); // Выводит true или false
});*/

