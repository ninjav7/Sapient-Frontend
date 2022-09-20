export const formatConsumptionValue = (value, fixed) =>
    value.toLocaleString(undefined, { maximumFractionDigits: fixed });

export const handleDateFormat = (customDate, dateType) => {
    if (dateType === 'startDate' && customDate === null) {
        let startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        return startDate;
    }

    if (dateType === 'endDate' && customDate === null) {
        let endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);
        return endDate;
    }

    let dt = new Date(customDate).toISOString();
    return dt;
};
