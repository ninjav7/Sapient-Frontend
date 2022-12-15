export const sanitizeNumbers = (stringValue, min, max) => {
    if (!stringValue) {
        return stringValue;
    }

    if (stringValue === '0-') {
        return '-';
    }

    if (/^[+-]/.test(stringValue) && stringValue.length === 1) {
        return stringValue;
    }

    if (stringValue.length > 0 && !stringValue.match(/\d/g)) {
        return '';
    }

    let stringValueOutput = stringValue;

    try {
        stringValueOutput
            .replace(/(-\+)|(\+-)/g, '')
            .replace(/-+/g, '-')
            .replace(/\++/g, '');
    } catch (e) {}

    if (stringValueOutput < min) {
        stringValueOutput = 0;
    }

    return parseFloat(stringValueOutput);
};
