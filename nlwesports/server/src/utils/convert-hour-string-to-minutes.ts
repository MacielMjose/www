export function convertHourStringToMinutes(hourStgring: string) {
    const [hours, minutes] = hourStgring.split(':').map(Number);
    const minutesAmount = (hours * 60) + minutes;

    return minutesAmount;
}