import React, {useState, useEffect} from 'react';
import {fetchBitcoinPrices} from "../../../api/Blockchain/BlockchainRate.mjs";
import ExampleImage from "../../../img/bitcoin.png";
import './BitcoinPrice.css'
import {formatNumberWithSpaces} from "../../../calculator/convertSatoshisToBitcoin.mjs";


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
            <div className={'container-price-img'}>
                <div>
                    <img src={ExampleImage} width="55" height="55" alt="bitcoin"/>
                </div>
                <div>
                    <h2>Курс Bitcoin</h2>
                    {btcPrice.USD?.last && <p>1 BTC = {formatNumberWithSpaces(btcPrice.USD.last)} USD</p>}
                    {btcPrice.RUB?.last && <p>1 BTC = {formatNumberWithSpaces(btcPrice.RUB.last)} RUB</p>}

                </div>
            </div>
        </div>
    );
};


