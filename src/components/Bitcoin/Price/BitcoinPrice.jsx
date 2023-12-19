import React, {useState, useEffect} from 'react';
import {fetchBitcoinPrices} from "../../../api/Blockchain/BlockchainRate.mjs";
import ExampleImage from "../../../img/bitcoin.png";
import './BitcoinPrice.css'


export const BitcoinPrice = () => {
    const [btcPrice, setBtcPrice] = useState({USD: {}, RUB: {}});

    useEffect(() => {
        const getBitcoinPrices = async () => {
            const prices = await fetchBitcoinPrices();
            setBtcPrice(prices);
        };

        getBitcoinPrices();
    }, []);

    return (
        <div className={'body_second'}>
            <div>
                <div>
                    <img src={ExampleImage} width="70" height="70" alt="bitcoin"/>
                </div>
                <div>
                    <h2>Курс Bitcoin</h2>
                    {btcPrice.USD && <p>1 BTC = {btcPrice.USD.last} USD</p>}
                    {btcPrice.RUB && <p>1 BTC = {btcPrice.RUB.last} RUB</p>}
                </div>
            </div>
        </div>
    );
};


