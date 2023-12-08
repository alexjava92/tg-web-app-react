import './App.css';
import {useEffect} from "react";
import {useTelegram} from "./hooks/useTelegram";
import {Route, Routes} from "react-router-dom";
import ProductList from "./components/ProductList/ProductList";
import Form from "./components/Form/Form";
import Wallet from "./components/Wallet/Wallet";
import BitcoinAddress from "./components/Bitcoin/BitcoinAddress/BitcoinAddress";
import {SendBitcoin} from "./components/Bitcoin/SendBitcoin/SendBitcoin";

function App() {
    const {tg} = useTelegram();
    useEffect(() => {
        tg.ready();
    }, [])


    return (
        <div className="App">
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=YourFontFamily&display=swap"/>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
            </head>
            <Routes>
                <Route index element={<ProductList/>}/>
                <Route path={'/form'} element={<Form/>}/>
                <Route path={'/wallet'} element={<Wallet/>}/>
                <Route path={'/bitcoin-address'} element={<BitcoinAddress/>}/>
                <Route path={'/send-bitcoin'} element={<SendBitcoin/>}/>
            </Routes>
        </div>
    );
}

export default App;
