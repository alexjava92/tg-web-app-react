import './App.css';
import {useEffect} from "react";
import {useTelegram} from "./hooks/useTelegram";
import Header from "./components/Header/Header";
import {Route, Routes} from "react-router-dom";
import ProductList from "./components/ProductList/ProductList";
import Form from "./components/Form/Form";
import Wallet from "./components/Wallet/Wallet";
import BitcoinAddress from "./components/Bitcoin/BitcoinAddress/BitcoinAddress";

function App() {
    const {tg} = useTelegram();
    useEffect(() => {
        tg.ready();
    }, [])


    return (
        <div className="App">
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=YourFontFamily&display=swap" />
            </head>
            <Routes>
                <Route index element={<ProductList/>}/>
                <Route path={'/form'} element={<Form/>}/>
                <Route path={'/wallet'} element={<Wallet/>}/>
                <Route path={'/bitcoin-address'} element={<BitcoinAddress/>}/>
            </Routes>
        </div>
    );
}

export default App;
