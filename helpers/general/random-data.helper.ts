export const genSecondaryAddress = () => {
    const prefixes = ["Apt.", "#", "Unit", "P.O. Box", "Suite", "Floor", "Room", "Department", "Building", "Lot"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(Math.random() * 999);
    return `${prefix} ${number}`;
};

export const genRandomSeason = () => {
    const seasons = ["Spring", "Summer", "Fall", "Winter"];
    const randomIndex = Math.floor(Math.random() * seasons.length);
    return seasons[randomIndex];
};

export const genRandomUpcCode = (): number => {
    const upcCode = [];
    for (let i = 0; i < 12; i++) {
        upcCode.push(Math.floor(Math.random() * 10));
    }
    const oddSum = upcCode[0] + upcCode[2] + upcCode[4] + upcCode[6] + upcCode[8] + upcCode[10];
    const evenSum = upcCode[1] + upcCode[3] + upcCode[5] + upcCode[7] + upcCode[9];
    const totalSum = oddSum * 3 + evenSum;
    const checkDigit = (10 - (totalSum % 10)) % 10;
    upcCode.push(checkDigit);
    return Number(upcCode.join(""));
};
