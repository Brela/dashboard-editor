export function createRandomArrivalDate() {
    const minDays = 2;
    const maxDays = 7;
    const randomDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + randomDays);
    const randomHours = Math.floor(Math.random() * 24); // generate random hours (0-23)
    const randomMinutes = Math.floor(Math.random() * 60); // generate random minutes (0-59)
    const randomSeconds = Math.floor(Math.random() * 60); // generate random seconds (0-59)
    currentDate.setHours(randomHours, randomMinutes, randomSeconds); // set the random time
    return currentDate.toISOString();
}


