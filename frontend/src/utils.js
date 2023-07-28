export const formatPhoneNumber = (phoneNumber) => {
    // Use regular expression to match and capture the groups of digits
    const match = phoneNumber.match(/^(\d{3})?(\d{3})?(\d{4})?$/);
    if (match && match[0] !== "") {
        // If the phone number is in a valid format, return it in the format (888) 888 - 8888
        return `(${match[1] || ""}) ${match[2] || ""} - ${match[3] || ""}`;
    }
    // If the phone number is not in a valid format, return it as is
    return phoneNumber;
};

export const extractNumbers = (string) => {
    // Use regular expression to match and capture all the digits in the string
    const match = string.match(/\d+/g);
    if (match) {
        // If there are any numbers in the string, return them as a new string
        return match.join("");
    }
    // If there are no numbers in the string, return an empty string
    return "";
};

export const usdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export const formatNumber = (num, price = false) => {
    if (price) {
        if (num !== 0 && num < 1) {
            return `$${Number(num.toPrecision(4))}`;
        }
        // Otherwise round to 2 decimal places
        return usdFormatter.format((Math.round((num + Number.EPSILON) * 100) / 100).toFixed(2));
    }

    // If number is less than 1 and not 0, round to 4 significant figures
    if (num !== 0 && num < 1) {
        return Number(num.toPrecision(4));
    }
    // Otherwise round to 2 decimal places

    return Intl.NumberFormat("en-US", { style: "decimal" }).format(Math.round((num + Number.EPSILON) * 100) / 100);
};
