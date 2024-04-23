import { DateTime } from "luxon"

export const labelFormatter = (labelData: string, label: string) => {
    if (label === 'timestamp') {
        return timestampFormatter(labelData)
    }
    return labelData
}

const timestampFormatter = (timestamp: string) => {
    let dt = DateTime.fromMillis(parseInt(timestamp, 10))
    return dt.invalidReason ? timestamp : dt.toFormat('HH:mm:ss.SSS')
}
