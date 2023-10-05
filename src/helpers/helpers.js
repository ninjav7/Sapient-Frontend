import moment from 'moment';

export const formatConsumptionValue = (value, fixed) =>
    value.toLocaleString(undefined, { maximumFractionDigits: fixed });

export const convertToUserLocalTime = (UTCtime) => {
    // Parse the UTC time string using Moment.js
    const utcMoment = moment.utc(UTCtime);
    // Convert to the user's local timezone
    const localMoment = utcMoment.local();
    // Format the local time in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
    const isoFormat = localMoment.format();
    return isoFormat;
};

export const prepareTimeAndDateFormat = (dateFormat, timeFormat) => {
    let format = '';
    if (dateFormat == 'DD-MM-YYYY') {
        if (timeFormat == '12h') {
            format = `DD/MM/YYYY hh:mm A `;
        } else if(timeFormat == '24h') {
            format = `DD/MM/YYYY HH:mm:ss`;
        }
    } else if (dateFormat == 'MM-DD-YYYY') {
        if (timeFormat == '12h') {
            format = `MM/DD/YYYY hh:mm A `;
        } else if(timeFormat == '24h') {
            format = `MM/DD/YYYY HH:mm:ss`;
        }
    }
    return format;
};

export const handleDateFormat = (customDate, dateType) => {
    if (dateType === 'startDate' && customDate === null) {
        let startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);
        return convertToUserLocalTime(startDate);
    }

    if (dateType === 'endDate' && customDate === null) {
        let endDate = new Date();
        endDate.setDate(endDate.getDate());
        return convertToUserLocalTime(endDate);
    }

    let dt = new Date(customDate).toISOString();
    return dt;
};

export const xaxisFilters = (daysCount, timezone) => {
    // Up to and including 1 day
    if (daysCount === 1) {
        let xaxisObj = {
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    return `${moment(timestamp).tz(timezone).format('HH:00')}`;
                },
                offsetX: 0,
                offsetY: 0,
            },
            tickAmount: 8,
            tickPlacement: 'between',
        };
        return xaxisObj;
    }

    // Up to and including 3 days
    else if (daysCount >= 2 && daysCount <= 3) {
        let xaxisObj = {
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    return `${moment(timestamp).tz(timezone).format('MM/DD HH:00')}`;
                },
                offsetX: 0,
                offsetY: 0,
            },
            tickAmount: daysCount * 4,
        };
        return xaxisObj;
    }

    // Up to and including 7 days
    else if (daysCount >= 4 && daysCount <= 7) {
        let xaxisObj = {
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    return `${moment(timestamp).tz(timezone).format('MM/DD HH:00')}`;
                },
                offsetX: 0,
                offsetY: 0,
                hideOverlappingLabels: Boolean,
                rotate: 0,
                trim: false,
            },
            tickAmount: daysCount * 2,
            axisTicks: {
                show: true,
            },
        };
        return xaxisObj;
    }

    // Up to and including 14 days
    else if (daysCount >= 8 && daysCount <= 14) {
        let xaxisObj = {
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    return `${moment(timestamp).tz(timezone).format('MM/DD')}`;
                },
                offsetX: 0,
                offsetY: 0,
                hideOverlappingLabels: Boolean,
                rotate: 0,
                trim: false,
            },
            tickAmount: daysCount,
            axisTicks: {
                show: true,
            },
        };
        return xaxisObj;
    }

    // Up to and including 30 days
    else if (daysCount >= 15 && daysCount <= 30) {
        let xaxisObj = {
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    return `${moment(timestamp).tz(timezone).format('MM/DD')}`;
                },
                hideOverlappingLabels: Boolean,
                rotate: 0,
                trim: false,
                offsetX: 0,
                offsetY: 0,
            },
            tickAmount: (daysCount / 3).toFixed(0),
            axisTicks: {
                show: true,
            },
        };
        return xaxisObj;
    }

    // Up to and including 3 Months
    else if (daysCount >= 31 && daysCount <= 90) {
        let xaxisObj = {
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    return `${moment(timestamp).tz(timezone).format('MM/DD')}`;
                },
                hideOverlappingLabels: Boolean,
                rotate: 0,
                trim: false,
            },
            tickAmount: (daysCount / 6).toFixed(0),
            axisTicks: {
                show: true,
            },
        };
        return xaxisObj;
    }

    // Up to and including 6 Months
    else if (daysCount >= 91 && daysCount <= 181) {
        let xaxisObj = {
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    return `${moment(timestamp).tz(timezone).format('MM/DD')}`;
                },
                hideOverlappingLabels: Boolean,
                rotate: 0,
                trim: false,
            },
            tickAmount: (daysCount / 6).toFixed(0),
            axisTicks: {
                show: true,
            },
        };
        return xaxisObj;
    }

    // >6 Months
    else if (daysCount >= 182) {
        let xaxisObj = {
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    return `${moment(timestamp).tz(timezone).format('MMM')}`;
                },
                hideOverlappingLabels: Boolean,
                rotate: 0,
                trim: false,
            },
            tickAmount: (daysCount / 30).toFixed(0),
            axisTicks: {
                show: true,
            },
        };
        return xaxisObj;
    }

    // Default if not any
    else {
        let xaxisObj = {
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    return `${moment(timestamp).tz(timezone).format('DD/MMM')} ${moment(timestamp)
                        .tz(timezone)
                        .format('LT')}`;
                },
            },
        };
        return xaxisObj;
    }
};

export const formatXaxisForHighCharts = (daysCount, dateFormat, timeFormat, chartType = 'energy') => {
    // Up to and including 1 day
    if (daysCount === 1) {
        return timeFormat === `12h` ? '{value:%I:%M %p}' : '{value:%H:%M}';
    }

    // Up to and including 3 days
    else if (daysCount >= 2 && daysCount <= 3) {
        let value = '';
        if (dateFormat === `DD-MM-YYYY`) {
            if (timeFormat === `12h`) {
                value = '{value:%d/%m %I:%M %p}';
            } else {
                value = '{value:%d/%m %H:%M}';
            }
        } else {
            if (timeFormat === `12h`) {
                value = '{value:%m/%d %I:%M %p}';
            } else {
                value = '{value:%m/%d %H:%M}';
            }
        }
        return value;
    }

    // Up to and including 7 days
    else if (daysCount >= 4 && daysCount <= 7) {
        let value = '';
        if (dateFormat === `DD-MM-YYYY`) {
            if (timeFormat === `12h`) {
                value = '{value:%d/%m %I:%M %p}';
            } else {
                value = '{value:%d/%m %H:%M}';
            }
        } else {
            if (timeFormat === `12h`) {
                value = '{value:%m/%d %I:%M %p}';
            } else {
                value = '{value:%m/%d %H:%M}';
            }
        }
        return value;
    }

    // Up to and including 14 days
    else if (daysCount >= 8 && daysCount <= 14) {
        return dateFormat === 'DD-MM-YYYY' ? '{value:%d/%m}' : '{value:%m/%d}';
    }

    // Up to and including 30 days
    else if (daysCount >= 15 && daysCount <= 30) {
        return dateFormat === 'DD-MM-YYYY' ? '{value:%d/%m}' : '{value:%m/%d}';
    }

    // Up to and including 3 Months
    else if (daysCount >= 31 && daysCount <= 90) {
        return dateFormat === 'DD-MM-YYYY' ? '{value:%d/%m}' : '{value:%m/%d}';
    }

    // Up to and including 6 Months
    else if (daysCount >= 91 && daysCount <= 181) {
        return dateFormat === 'DD-MM-YYYY' ? '{value:%d/%m}' : '{value:%m/%d}';
    }

    // >6 Months
    else if (daysCount >= 182) {
        return chartType === 'energy' ? "{value:%b '%y}" : "{value:%e %b '%y}";
    }

    // Default if not any
    else {
        return dateFormat === 'DD-MM-YYYY' ? '{value:%d/%m}' : '{value:%m/%d}';
    }
};

export const convertDateTime = (timestamp, timeZone) => {
    return moment.utc(timestamp).clone().tz(timeZone);
};

export const apiRequestBody = (start_date, end_date, time_zone) => {
    return {
        date_from: start_date,
        date_to: end_date,
        tz_info: time_zone ? time_zone : undefined,
    };
};

export const isInputLetterOrNumber = (inputtxt) => {
    if (inputtxt) {
        const letterNumber = /^[0-9a-zA-Z]+$/;
        return inputtxt.match(letterNumber) ? true : false;
    }
};

export const pageListSizes = [
    {
        label: '20 Rows',
        value: '20',
    },
    {
        label: '50 Rows',
        value: '50',
    },
    {
        label: '100 Rows',
        value: '100',
    },
];

export const compareObjData = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const getBuildingName = (buildingListData, id) => {
    let buildingName = '';
    if (buildingListData?.length) {
        buildingListData.forEach((building) => {
            if (building.value == id) {
                buildingName = building.label;
            }
        });
    }

    return buildingName;
};

// Below Helper function is for HeatMap time convertion
export const convertTimeTo24HourFormat = (data) => {
    const timeRegex = /(\d+)([AP]M)/;

    return data.map((item) => {
        const timeMatch = item.x.match(timeRegex);
        if (timeMatch) {
            let hour = parseInt(timeMatch[1]);
            const period = timeMatch[2];

            if (period === 'PM' && hour !== 12) {
                hour += 12;
            } else if (period === 'AM' && hour === 12) {
                hour = 0;
            }

            item.x = hour.toString().padStart(2, '0') + ':00';
        }
        return item;
    });
};

// Below Helper function is for HeatMap time convertion
export const convertTimeTo12HourFormat = (data) => {
    return data.map((item) => {
        let [hour, minute] = item.x.split(':');
        hour = parseInt(hour);
        let period = 'AM';

        if (hour === 0) {
            hour = 12;
        } else if (hour === 12) {
            period = 'PM';
        } else if (hour > 12) {
            hour -= 12;
            period = 'PM';
        }

        item.x = hour.toString().padStart(2) + period;
        return item;
    });
};

export const dateTimeFormatForHighChart = (date_format, time_format) => {
    return time_format === `12h`
        ? date_format === `DD-MM-YYYY`
            ? `%e %b '%y @ %I:%M %p`
            : `%b %e '%y @ %I:%M %p`
        : date_format === `DD-MM-YYYY`
        ? `%e %b '%y @ %H:%M`
        : `%b %e '%y @ %H:%M`;
};

export const xAxisLabelStepCount = (days_count, time_format) => {
    let value = 1;
    if (time_format === '12h' && days_count <= 7 && days_count > 1) value = 2;
    return value;
};
