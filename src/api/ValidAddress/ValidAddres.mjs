
export async function isValidBitcoinAddress (address) {
    try {
        const response = await fetch(`https://mempool.space/testnet/api/address/${address}`);

        // Возвращаем true, если ответ успешный, иначе false
        return response.ok;
    } catch (error) {
        console.error("Ошибка при проверке адреса: ", error);
        return false; // Возвращаем false в случае ошибки запроса
    }
};

isValidBitcoinAddress('tb1q86c4pqdhusv5g7q5z90dv8enpke9n5273yyl8c').then(valid => {
    console.log(valid)
})