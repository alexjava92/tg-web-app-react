import React, {useState} from 'react';
import './App.css';
import {useEffect} from "react";
import {useTelegram} from "./hooks/useTelegram";
import {Route, Routes} from "react-router-dom";
import Wallet from "./components/Wallet/Wallet";
import BitcoinAddress from "./components/Bitcoin/BitcoinAddress/BitcoinAddress";
import {SendBitcoin} from "./components/Bitcoin/SendBitcoin/SendBitcoin";

export const CurrencyContext = React.createContext();

function App() {
    const [showUsd, setShowUsd] = useState(false);

    const {tg} = useTelegram();
    useEffect(() => {
        tg.ready();
    }, [])


    return (
        <div className="App">
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"/>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
            </head>
            <CurrencyContext.Provider value={{showUsd, setShowUsd}}>
                <Routes>
                    <Route path={'/wallet'} element={<Wallet/>}/>
                    <Route path={'/bitcoin-address'} element={<BitcoinAddress/>}/>
                    <Route path={'/send-bitcoin'} element={<SendBitcoin/>}/>
                </Routes>
            </CurrencyContext.Provider>
        </div>
    );
}

export default App;
