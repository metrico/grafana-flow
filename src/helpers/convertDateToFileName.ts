
export const convertDateToFileName = (date: Date) => {

    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}_${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
