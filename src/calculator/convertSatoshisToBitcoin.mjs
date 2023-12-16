import {fetchBitcoinPrices} from "../api/Blockchain/BlockchainRate.mjs";

// Принимает сатоши, показывает биткоин
export function convertSatoshisToBitcoin(satoshis) {
    const BITCOINS_PER_SATOSHI = 1e-8; // 1 Bitcoin = 100 миллионов сатоши
    const result = satoshis * BITCOINS_PER_SATOSHI;
    return Math.round(result * 1e8) / 1e8;
}
// Принимает биткоин, показывает сатоши
export function convertBitcoinToSatoshis(bitcoins) {
    const SATOSHIS_PER_BITCOIN = 1e8; // 1 Bitcoin = 100 миллионов сатоши
    return Math.round(bitcoins * SATOSHIS_PER_BITCOIN);
}
// Принимает биткоин, показывает рубли
export async function convertBtcToRub(btc) {
    try {
        const rates = await fetchBitcoinPrices(); // Дожидаемся выполнения запроса
        const rateRUB = rates.RUB.last; // Предполагаем, что курс находится в свойстве 'last'
        const amountRUB = btc * rateRUB; // Вычисляем итоговую сумму в рублях
        return amountRUB.toFixed(2);
    } catch (error) {
        console.error('Error fetching Bitcoin prices:', error);
        return null;
    }
}

// Принимает рубли, показывает биткоин
export async function convertRubToBtc(rub) {
    try {
        const rates = await fetchBitcoinPrices(); // Дожидаемся выполнения запроса
        const rateRUB = rates.RUB.last; // Предполагаем, что курс находится в свойстве 'last'

        // Убедитесь, что курс не равен нулю, чтобы избежать деления на ноль
        if (rateRUB === 0) {
            throw new Error("Нулевой обменный курс");
        }

        const amountBTC = rub / rateRUB; // Вычисляем итоговую сумму в биткоинах
        return amountBTC.toFixed(8); // Биткоин обычно округляется до 8 знаков после запятой
    } catch (error) {
        console.error('Error fetching Bitcoin prices:', error);
        return null;
    }
}
// Устанавливает пробел между тысячами
export function formatNumberWithSpaces(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function calculateFeePerVByte(size, weight, fee) {
    // Комиссия за виртуальный байт = Общая комиссия / (Вес транзакции / 4)
    const feePerVByte = fee / (weight / 4);
    return feePerVByte;
}

/*const btc1 = convertSatoshisToBitcoin(222)
console.log(btc1)

const btc2 = convertBitcoinToSatoshis(btc1)
console.log(btc2)

// Пример использования
const btc = 0.00000222
convertBtcToRub(btc).then(amount => {
    console.log(amount)
})*/
