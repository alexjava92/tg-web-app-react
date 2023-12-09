
export const isValidBitcoinAddress = async (address) => {
    try {
        const response = await fetch(`https://mempool.space/testnet/api/address/${address}`);

        // Возвращаем true, если ответ успешный, иначе false
        return response.ok;
    } catch (error) {
        console.error("Ошибка при проверке адреса: ", error);
        return false; // Возвращаем false в случае ошибки запроса
    }
};


