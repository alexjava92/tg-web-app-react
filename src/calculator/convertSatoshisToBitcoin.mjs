import {fetchBitcoinPrices} from "../api/Blockchain/BlockchainRate.mjs";

// Принимает сатоши, показывает биткоин
export function convertSatoshisToBitcoin(satoshis) {
    const BITCOINS_PER_SATOSHI = 1e-8; // 1 Bitcoin = 100 миллионов сатоши
    return satoshis * BITCOINS_PER_SATOSHI;
}
// Принимает биткоин, показывает сатоши
export function convertBitcoinToSatoshis(bitcoins) {
    const SATOSHIS_PER_BITCOIN = 1e8; // 1 Bitcoin = 100 миллионов сатоши
    return bitcoins * SATOSHIS_PER_BITCOIN;
}
// Принимает биткоин, показывает рубли
export async function convertBtcToRub(btc) {
    try {
        const rates = await fetchBitcoinPrices(); // Дожидаемся выполнения запроса
        const rateRUB = rates.RUB.last; // Предполагаем, что курс находится в свойстве 'last'
        const amountRUB = btc * rateRUB; // Вычисляем итоговую сумму в рублях
        return Math.round(amountRUB);
    } catch (error) {
        console.error('Error fetching Bitcoin prices:', error);
        return null;
    }
}

/*const btc1 = convertSatoshisToBitcoin(22)
console.log(btc1)

const btc2 = convertBitcoinToSatoshis(btc1)
console.log(btc2)

// Пример использования
const btc = 0.002134
convertBtcToRub(btc).then(amount => {
    console.log(amount)
})*/
