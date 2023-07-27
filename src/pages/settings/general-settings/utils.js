// 1 square meter = 10.7639 feet
// default feet imp - this is stored in DB

export const handleUnitConverstion = (value = 0, currentType = 'imp') => {
    if (currentType === 'si') value = value / 10.7639;
    return value;
};

export const convertToMeters = (value) => {
    // feet => meter || imp => si
    return value / 10.7639;
};

export const convertToFootage = (value) => {
    // meter => feet || si => imp
    return value * 10.7639;
};
