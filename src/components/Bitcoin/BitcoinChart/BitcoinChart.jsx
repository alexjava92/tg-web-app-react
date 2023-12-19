import React, { useEffect } from 'react';

export const BitcoinChart = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => {
            new window.TradingView.widget(
                {
                    "container_id": "tradingview_6b3e5",
                    "symbol": "BITSTAMP:BTCUSD",
                    "interval": "D",
                    "timezone": "Etc/UTC",
                    "theme": "dark",
                    "style": "2",
                    "locale": "ru",
                    "toolbar_bg": "#f1f3f6",
                    "enable_publishing": false,
                    "hide_top_toolbar": true,
                    "save_image": false,
                }
            );
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);

    return (
        <div className="tradingview-widget-container">
            <div id="tradingview_6b3e5" />
        </div>
    );
};