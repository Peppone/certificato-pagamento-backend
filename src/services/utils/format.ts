

export const formatCurrency = (value: number) => {
    let formattedString = new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
    }).format(value);
    if (value < 10_000 && value > 999) {
        formattedString = formattedString[0] + '.' + formattedString.slice(1);
    }
    return formattedString;
}