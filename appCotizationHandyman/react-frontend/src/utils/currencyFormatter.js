export const formatCurrency = (value) => {
    const numberValue = parseInt(value.replace(/[^0-9]/g, ''));
    if (isNaN(numberValue)) return '';
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(numberValue);
};

export const formatCurrencyStrToNum = (value) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(value);
};