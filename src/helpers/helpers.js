import moment from 'moment';

export const formatConsumptionValue = (value, fixed) =>
    value.toLocaleString(undefined, { maximumFractionDigits: fixed });

export const handleDateFormat = (customDate, dateType) => {
    if (dateType === 'startDate' && customDate === null) {
        let startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);
        return startDate;
    }

    if (dateType === 'endDate' && customDate === null) {
        let endDate = new Date();
        endDate.setDate(endDate.getDate());
        return endDate;
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
