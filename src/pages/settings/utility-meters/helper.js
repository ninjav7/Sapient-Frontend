export const convertNullToSingleQuotes = (obj) => {
    const result = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) result[key] = obj[key] === null ? '' : obj[key];
    }
    return result;
};

export const formatSensorHeading = (sensorObj, sensorType) => {
    let title = '';

    const { utility_provider, utility_meter_serial_number, pulse_weight } = sensorObj;

    if (sensorType === 'pulse') {
        if (utility_provider && utility_meter_serial_number && pulse_weight) {
            title = `${utility_provider} - ${utility_meter_serial_number} - ${pulse_weight} kWH/pulse`;
        } else if (utility_provider && utility_meter_serial_number) {
            title = `${utility_provider} - ${utility_meter_serial_number}`;
        } else if (utility_provider && pulse_weight) {
            title = `${utility_provider} - ${pulse_weight} kWH/pulse`;
        } else if (utility_meter_serial_number && pulse_weight) {
            title = `${utility_meter_serial_number} - ${pulse_weight} kWH/pulse`;
        } else if (utility_provider) {
            title = utility_provider;
        } else if (utility_meter_serial_number) {
            title = utility_meter_serial_number;
        } else if (pulse_weight) {
            title = `${pulse_weight} kWH/pulse`;
        } else {
            title = 'Sapient Pulse';
        }
    }

    if (sensorType === 'shadow') {
        if (utility_provider && utility_meter_serial_number) {
            title = `${utility_provider} - ${utility_meter_serial_number}`;
        } else if (utility_provider) {
            title = utility_provider;
        } else if (utility_meter_serial_number) {
            title = utility_meter_serial_number;
        } else {
            title = 'Sapient Shadow';
        }
    }

    return title;
};

export const formatSensorList = (sensorObj) => {
    const { utility_provider, utility_meter_make, utility_meter_model, utility_meter_serial_number } = sensorObj;

    let title = '';
    let str1 = utility_provider || '';
    let str2 = utility_meter_make && utility_meter_model ? `${utility_meter_make} ${utility_meter_model}` : '';
    let str3 = utility_meter_serial_number || '';

    if (str1 && str2 && str3) {
        title = `${str1} - ${str2} - ${str3}`;
    } else if (str1 && str2) {
        title = `${str1} - ${str2}`;
    } else if (str1 && str3) {
        title = `${str1} - ${str3}`;
    } else if (str2 && str3) {
        title = `${str2} - ${str3}`;
    } else if (str1) {
        title = str1;
    } else if (str2) {
        title = str2;
    } else if (str3) {
        title = str3;
    }

    return title;
};
