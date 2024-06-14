import { ParsedLabel } from "../DataScheme";
import { Parser } from "./parsers";
import { DateTime } from 'luxon';
export const toDateTime: Parser = (value: string, label: ParsedLabel) => {
    const intValue = parseInt(value, 10);
    if (isNaN(intValue)) {
        return value;
    }
    const dateTime = DateTime.fromMillis(intValue);
    if (dateTime.invalidReason) {
        return value
    }
    if (!label.parserConfig || label.parserConfig === 'ISO8601') {
        const formattedDateTime = dateTime.toISO()
        console.log(formattedDateTime, label, value)
        if (!formattedDateTime) {
            return value
        }
        return formattedDateTime.trim()
    }
    return dateTime.toFormat(label.parserConfig)
}
export const dateTimeConfig = [
    {
        label: "Date and Time (ISO 8601)",
        value: "ISO8601",
    },
    {
        label: "Date and Time (24h)",
        value: "dd-MM-yyyy HH:mm:ss.SSS",
    },
    {
        label: "Date and Time (12h)",
        value: "dd-MM-yyyy hh:mm:ss.SSS a",
    },
    {
        label: "Time (24h)",
        value: "HH:mm:ss.SSS",
    },
    {
        label: "Time (12h)",
        value: "hh:mm:ss.SSS a",
    }
]
