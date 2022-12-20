import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const generateID = () => Math.random().toString(36).substring(2, 9);

const kFormatter = (num) => {
    return Math.abs(num) > 999
        ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + ' K'
        : Math.sign(num) * Math.abs(num);
};

//@TODO Maybe we can find better substitute
const mixColors = function (color_1, color_2, weight) {
    function d2h(d) {
        return d.toString(16);
    } // convert a decimal value to hex
    function h2d(h) {
        return parseInt(h, 16);
    } // convert a hex value to decimal

    weight = typeof weight !== 'undefined' ? weight : 50; // set the weight to 50%, if that argument is omitted

    var color = '#';

    for (var i = 0; i <= 5; i += 2) {
        // loop through each of the 3 hex pairs—red, green, and blue
        var v1 = h2d(color_1.substr(i, 2)), // extract the current pairs
            v2 = h2d(color_2.substr(i, 2)),
            // combine the current pairs from each source color, according to the specified weight
            val = d2h(Math.floor(v2 + (v1 - v2) * (weight / 100.0)));

        while (val.length < 2) {
            val = '0' + val;
        } // prepend a '0' if val results in a single digit

        color += val; // concatenate val to our new color string
    }

    return color; // PROFIT!
};

const stringOrNumberPropTypes = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

function arrayMoveMutable(array, fromIndex, toIndex) {
    const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

    if (startIndex >= 0 && startIndex < array.length) {
        const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;

        const [item] = array.splice(fromIndex, 1);
        array.splice(endIndex, 0, item);
    }
}

function arrayMoveImmutable(array, fromIndex, toIndex) {
    const newArray = [...array];
    arrayMoveMutable(newArray, fromIndex, toIndex);
    return newArray;
}

const getStatesForSelectAllCheckbox = (values, options) => {
    const noneSelected = values.length === 0;
    const allSelected = values.length === options.length;
    const someSelected = values.length > 0;
    const optionsAreExisted = options.length > 0;

    return {
        checked: optionsAreExisted && !noneSelected && allSelected,
        indeterminate: optionsAreExisted && !noneSelected && someSelected && !allSelected,
    };
};

const removeProps = (propsObj, ...properties) => {
    let propsMap = Object.entries(propsObj).filter(([key]) => !properties.includes(key));

    return propsMap.reduce((newProps, [key, val]) => {
        newProps[key] = val;
        return newProps;
    }, {});
};

const xaxisFilters = (daysCount, timezone) => {
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

const formatConsumptionValue = (value, fixed) => value.toLocaleString(undefined, { maximumFractionDigits: fixed });

const xaxisCategoryByHour = [
    '12AM',
    '1AM',
    '2AM',
    '3AM',
    '4AM',
    '5AM',
    '6AM',
    '7AM',
    '8AM',
    '9AM',
    '10AM',
    '11AM',
    '12PM',
    '1PM',
    '2PM',
    '3PM',
    '4PM',
    '5PM',
    '6PM',
    '7PM',
    '8PM',
    '9PM',
    '10PM',
    '11PM',
];

// @TODO Perhabs will be deleted
const renderElementIfValid = (element) => {
    if (React.isValidElement(element)) {
        return React.cloneElement(element, { ...element?.props });
    }
};

export {
    generateID,
    kFormatter,
    mixColors,
    arrayMoveMutable,
    arrayMoveImmutable,
    stringOrNumberPropTypes,
    getStatesForSelectAllCheckbox,
    removeProps,
    xaxisFilters,
    formatConsumptionValue,
    xaxisCategoryByHour,
    renderElementIfValid,
};
