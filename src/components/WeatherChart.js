import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {
    Line
} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function WeatherChart({value, city}) {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: city?city:"Enter city to check detailed weather!!",
            },
        },
    };
    const filterData = (arr) => arr.filter((e, i) => i % 2 ===  0 && i < 25);
    const labels = filterData(value.hourly.time);

    const data = {
        labels,
        datasets: [{
                label: 'Temperature',
                data: filterData(value.hourly.temperature_2m),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'Rain',
              data: filterData(value.hourly.rain),
              borderColor: 'rgb(214, 158, 42)',
              backgroundColor: 'rgb(214, 158, 42, 0.5)',
            },
            {
              label: 'Snow',
              data: filterData(value.hourly.snowfall),
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };
    return <Line options = {options} data = {data} />;
}

export default WeatherChart;