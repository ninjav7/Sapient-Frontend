export const convertNullToSingleQuotes = (obj) => {
    const result = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) result[key] = obj[key] === null ? '' : obj[key];
    }
    return result;
};

export const formatSensorHeading = (sensorObj, sensorType) => {
    let title = '';
    if (sensorType === 'pulse') {
        let str1;
        let str2;
        let str3;
        if (sensorObj?.utility_provider) str1 = `${sensorObj?.utility_provider}`;
        if (sensorObj?.utility_meter_serial_number) str2 = `${sensorObj?.utility_meter_serial_number}`;
        if (sensorObj?.pulse_weight) str3 = `${sensorObj?.pulse_weight} kWH/pulse`;
        if (str1 && str2 && str3) title = `${str1} - ${str2} - ${str3}`;
        if (str1 && str2 && !str3) title = `${str1} - ${str2}`;
        if (str1 && !str2 && str3) title = `${str1} - ${str3}`;
        if (!str1 && str2 && str3) title = `${str2} - ${str3}`;
        if (str1 && !str2 && !str3) title = `${str1}`;
        if (!str1 && str2 && !str3) title = `${str2}`;
        if (!str1 && !str2 && str3) title = `${str3}`;
        if (title === '') title = 'Sapient Pulse';
    }
    if (sensorType === 'shadow') {
        let str1;
        let str2;
        if (sensorObj?.utility_provider) str1 = `${sensorObj?.utility_provider}`;
        if (sensorObj?.utility_meter_serial_number) str2 = `${sensorObj?.utility_meter_serial_number}`;
        if (str1 && str2) title = `${str1} - ${str2}`;
        if (str1 && !str2) title = `${str1}`;
        if (!str1 && str2) title = `${str2}`;
        if (title === '') title = 'Sapient Shadow';
    }
    return title;
};
