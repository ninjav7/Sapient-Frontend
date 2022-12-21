export const getAverageValue = (value, min, max) => {
    if (min == undefined || max === undefined) {
        return 0;
    }
    let percentage = Math.round(((value - min) / (max - min)) * 100);
    return Math.round(percentage);
};

// if (minVal === maxVal) {
//     minVal = 0;
// }
