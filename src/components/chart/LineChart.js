import React, {useEffect, useRef} from 'react';
import Chart from "chart.js";

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
            }
        });
    }, [props.title, props.data, props.data.datasets]);


    return (
        <div style={{
            width: '95%',
            margin: 'auto',
            padding: '30px 0'
        }}>
            <canvas ref={myChartRef} />
        </div>
    )
}

export default LineChart;