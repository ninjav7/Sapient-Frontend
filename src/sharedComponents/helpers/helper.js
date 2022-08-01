const generateID = () => Math.random().toString(36).substring(2, 9);

const kFormatter = (num) => {
    return Math.abs(num) > 999
        ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + ' K'
        : Math.sign(num) * Math.abs(num);
}


export {generateID, kFormatter};
