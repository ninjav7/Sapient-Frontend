import React from 'react';
import LineChart from './LineChart';

export default {
    title: 'Charts/LineChart',
    component: LineChart,
};

export const Default = () => {
    const getRandomInt = (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    };

    const generateData = (max) => {
        return [
            getRandomInt(max),
            getRandomInt(max),
            getRandomInt(max),
            getRandomInt(max),
            getRandomInt(max),
            getRandomInt(max),
        ];
    };
    const data = {
        data1: generateData(10),
        data2: generateData(10),
        data3: generateData(5),
    };
    const categories = ['one', 'two', 'three', 'four', 'five', 'six'];

    return (
        <LineChart
            buildingName={'123 Main St. Portland, OR'}
            isMulti={true}
            categories={categories}
            data1={data.data1}
            data2={data.data2}
            data3={data.data3}
        />
    );
};
