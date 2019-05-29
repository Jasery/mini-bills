export function getUnitId() {
    return Date.now() * 1000 + randomNum(0, 1000)
}

export function randomNum(start, end) {
    return Math.floor(Math.random() * (end - start)) + start;
}

export function formatMoney(money) {
    return Number(money.toFixed(2));
}