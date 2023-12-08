// Функция для выполнения GET-запросов с использованием fetch

export async function getFees() {
    try {
        const response = await fetch('https://mempool.space/api/v1/fees/recommended');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Выполнение запроса

/*getFees()
    .then((data) => {
        console.log('Рекомендованные комиссии:', data);
    });*/
