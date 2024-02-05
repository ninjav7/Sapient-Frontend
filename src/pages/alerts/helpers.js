export function showCommaSeparatedEmails(array) {
    return array.join(', ');
}

export function splitEmailsByComma(inputString) {
    return inputString.split(',').map((str) => str.trim());
}

export const getCommaSeparatedObjectLabels = (objectArray) => {
    return objectArray.map((object) => object?.label).join(', ');
};

export const fetchCommaSeperatedEmailAddresses = (selectedUserEmailId) => {
    const emailsList = selectedUserEmailId.split(',');
    const trimmedEmailsList = emailsList.map((email) => email.trim());
    return trimmedEmailsList;
};

// In Progress required for Tagrt Type change to alert user
export const customComparator = (value1, value2, key) => {
    if (key === 'type' && key.startsWith('target.')) {
        return true; // Exclude comparison of obj.target.type
    }
    return undefined;
};

export const separateEmails = (inputString = '') => {
    if (inputString.trim() === '') return [];

    const emailArray = inputString.split(',').map((email) => email.trim());
    return emailArray;
};
