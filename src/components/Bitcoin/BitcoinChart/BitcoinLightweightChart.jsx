import React, { useRef, useEffect } from 'react';
import { createChart } from 'lightweight-charts';
import './BitcoinLightweightChart.css'

export const BitcoinLightweightChart = () => {
    const chartContainerRef = useRef();

    useEffect(() => {
        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 300
        });

        const lineSeries = chart.addLineSeries();
        lineSeries.setData([
            { time: '2021-01-01', value: 29000 },
            { time: '2021-02-01', value: 40000 },
            // ... другие данные
        ]);

        return () => chart.remove();
    }, []);

    return (
        <div ref={chartContainerRef} className="chart-container" />
    );
};


