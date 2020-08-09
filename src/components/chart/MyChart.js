import React, {useEffect, useState} from 'react'
import {Chart} from 'react-charts'

const MyChart = props => {
    const initialWidth = 99;
    const [width, setWidth] = useState(initialWidth);
    const data = React.useMemo(() => props.data, [props.data]);
    const axes = React.useMemo(
        () => [
            {primary: true, type: 'ordinal', position: 'bottom'},
            {type: 'linear', position: 'left'}
        ],
        []
    )

    const series = React.useMemo(
        () => ({
            showPoints: true,
            type: props.type
        }),
        [props.type]
    )

    const tooltip = React.useMemo(
        () => ({
            align: 'top',
            anchor: 'gridRight'
        }),
        []
    )

    useEffect(() => {setTimeout(() => {
        setWidth(width === initialWidth ? width + 1 : width - 1)
    }, 2000)}, [props.data]);

    return (
        <div
            style={{
                width: width + '%',
                height: '400px',
            }}
        >
            <Chart data={data} axes={axes} series={series} tooltip={tooltip}/>
        </div>
    )
}

export default MyChart;