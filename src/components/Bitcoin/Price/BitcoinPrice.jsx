import React, { useState, useEffect } from 'react';
import {fetchBitcoinPrices} from "../../../api/Blockchain/BlockchainRate.mjs";


export const BitcoinPrice = () => {
    const [btcPrice, setBtcPrice] = useState({ USD: {}, RUB: {} });

    useEffect(() => {
        const getBitcoinPrices = async () => {
            const prices = await fetchBitcoinPrices();
            setBtcPrice(prices);
        };

        getBitcoinPrices();
    }, []);

    return (
        <div className={'body_second'}>
            <h2>Курс Биткоина</h2>
            {btcPrice.USD && <p>1 BTC = {btcPrice.USD.last} USD</p>}
            {btcPrice.RUB && <p>1 BTC = {btcPrice.RUB.last} RUB</p>}
        </div>
    );
};


