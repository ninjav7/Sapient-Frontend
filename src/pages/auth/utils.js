export const TermsAndConditionDescription1 = `Before proceeding with your account creation, please carefully read and accept our website's terms and conditions. These terms outline the rights and responsibilities of both the website and its users. By accepting these terms, you acknowledge that you have read, understood, and agree to be bound by them.`;

export const TermsAndConditionDescription2 = `Our terms and conditions cover various aspects such as user obligations, prohibited activities, privacy policies, intellectual property rights, and dispute resolution procedures. They also highlight any limitations of liability on our part and important disclaimers that you should be aware of.`;

export const TermsAndConditionDescription3 = `Please take the time to review the terms and conditions in their entirety to ensure you are familiar with the expectations and requirements associated with using our website. If you have any questions or concerns, feel free to contact our support team for clarification.`;

export const TermsAndConditionDescription4 = `To accept the terms and conditions and proceed with creating your account, simply check the designated box below. By doing so, you confirm that you have read and understood our terms and conditions and agree to abide by them. Your acceptance signifies your commitment to maintaining a safe and respectful environment for all users of our website.`;

export const TermsAndConditionDescription5 = `Thank you for taking the time to review and accept our terms and conditions. We look forward to having you as a valued member of our online community!`;

export const compareStrings = (str1, str2) => {
    const result = str1.localeCompare(str2);
    return result === 0 ? true : false;
};

export const specialChartPattern = /[\.\,:;'"'`><\]\[}{_\/\|?\)\(=\+\-\*&%^$#@!~\\]/g;

// Regular expression for email address validation
const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Caching the regular expression
const emailRegexCache = new Map();

// Function to validate an email address.
export const validateEmail = (email) => {
    // If the regular expression is not already cached, compile it.
    if (!emailRegexCache.has(emailRegex)) {
        emailRegexCache.set(emailRegex, new RegExp(emailRegex));
    }

    // Use the cached regular expression to validate the email address.
    return emailRegexCache.get(emailRegex).test(email);
};
