import React, {useCallback, useEffect, useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";



const products = [
    {id: '1', title: 'Джинсы', price: 5000, description: 'Синего цвета, прямые'},
    {id: '2', title: 'Джинсы', price: 1000, description: 'Синего цвета, прямые'},
    {id: '3', title: 'Джинсы', price: 12000, description: 'Синего цвета, прямые'},
    {id: '4', title: 'Джинсы', price: 3000, description: 'Синего цвета, прямые'},
    {id: '5', title: 'Джинсы', price: 5555, description: 'Синего цвета, прямые'},
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();
    const data = {
        products: addedItems,
        totalPrice: getTotalPrice(addedItems),
        queryId,
    }

    const onSendData = useCallback(() => {

        fetch('http://5.35.13.72:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data) // Убедитесь, что передаете правильные данные
        })
            .then(response => response.json()) // Преобразование ответа в JSON
            .then(data => {
                console.log('Успешно:', data);
            })
            .catch((error) => {
                console.error('Ошибка:', error);
            });


    }, [addedItems])

    useEffect(() => {
        tg.postEvent('mainButtonClicked', onSendData, data)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if (alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }
        setAddedItems(newItems)

        if (newItems.length === 0) {
            tg.MainButton.hide()
        } else {
            tg.MainButton.show()
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => {
                return <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            })}
        </div>
    );
};

export default ProductList;