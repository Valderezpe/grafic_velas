"use client"

import ApexCharts from "react-apexcharts"

export default function Chart(props){
    const options={
        xaxis: {
            type: "datetime"
        }
    }

    const series=[{
        name: "Candles",
        type:"candlestick", 
        data: props.data.candles
    }, {
        name: "Support",
        type: "line", 
        data: props.data.support
    }, {
        name: "Resistance",
        type:"line", 
        data: props.data.resistance
    }]

    return(
        <ApexCharts options={options} series={series} width={1300} height={600}/>
    )
}