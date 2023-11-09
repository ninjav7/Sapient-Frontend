export function showCommaSeparatedEmails(array) {
    return array.join(', ');
}

export function splitEmailsByComma(inputString) {
    return inputString.split(',').map((str) => str.trim());
}

// In Progress required for Tagrt Type change to alert user
export const customComparator = (value1, value2, key) => {
    if (key === 'type' && key.startsWith('target.')) {
        return true; // Exclude comparison of obj.target.type
    }
    return undefined;
};
