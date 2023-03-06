//High Charts Date Range
export const fetchDateRange = (startDate, endDate) => {
    let sdf = new Date(
        `${startDate.getFullYear()}-${
            startDate.getMonth() < 9 ? `0${startDate.getMonth() + 1}` : startDate.getMonth() + 1
        }-${startDate.getDate() < 9 ? `0${startDate.getDate()}` : startDate.getDate()}`
    );
    let ed = endDate;
    let OneAdd = new Date(ed.getTime() + 86400000);
    let edf = new Date(
        `${OneAdd.getFullYear()}-${OneAdd.getMonth() < 9 ? `0${OneAdd.getMonth() + 1}` : OneAdd.getMonth() + 1}-${
            OneAdd.getDate() < 9 ? `0${OneAdd.getDate()}` : OneAdd.getDate()
        }`
    );

    return {
        minDate: sdf.getTime(),
        maxDate: edf.getTime(),
    };
};
