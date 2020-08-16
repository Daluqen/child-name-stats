import React, {useEffect, useRef} from 'react';
import Chart from "chart.js";
import "./Chart.css"

let chart;

const LineChart = props => {
    const myChartRef = useRef();

    useEffect(() => {
        if (typeof chart !== "undefined") chart.destroy();
        chart = new Chart(myChartRef.current, {
            type: "line",
            data: {
                labels: props.data.labels,
                datasets: props.data.datasets
            },
            options: {
                title: {
                    display: true,
                    text: props.title
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }, [props.title, props.data, props.data.datasets]);


    return (
        <div className={'Name-Chart'}>
            <canvas ref={myChartRef} />
        </div>
    )
}

export default LineChart;