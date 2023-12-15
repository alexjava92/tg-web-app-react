import {config} from "./config";


const url = config.apiBaseUrl;
export async function isValidBitcoinAddress (address) {
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
            const validAddress = responseData.isValid;
            console.log('Валидный:', validAddress);
            return validAddress
        } else {
            console.error('Server returned an error:', response.status);
            return false;

        }
    } catch (error) {
        console.error('Error fetching data from the server:', error);
        return false;

    }
};

/*isValidBitcoinAddress('2Mz87LWo5GgbHVZhx48nxZQfCh84opc9rzn').then(valid => {
    console.log(valid)
})*/
