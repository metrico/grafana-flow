import { DateTime } from "luxon"

export const labelFormatter = (labelData: string, label: string) => {
    if (label === 'timestamp') {
        return timestampFormatter(labelData)
    }
    if (typeof labelData === 'object') {
        const d: any = (labelData)
        return d?.parsed || d?.raw || JSON.stringify(d);
    }
    return labelData
}

const timestampFormatter = (timestamp: string) => {
    let dt = DateTime.fromMillis(parseInt(timestamp, 10))
    return dt.invalidReason ? timestamp : dt.toFormat('HH:mm:ss.SSS')
}
