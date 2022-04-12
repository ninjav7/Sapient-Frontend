export const percentageHandler = (v1, v2) => {
    const percentage = ((v1 - v2) / v1) * 100;
    return Math.abs(percentage).toFixed(2) || 0;
};
