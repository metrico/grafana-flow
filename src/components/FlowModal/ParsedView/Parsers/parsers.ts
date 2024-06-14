import { ParsedLabel } from "../DataScheme";
import { toLowerCase } from "./lowerCase";
import { toUpperCase } from "./upperCase";
import { dateTimeConfig, toDateTime } from "./dateTime";
export type Parser = (value: string, label: ParsedLabel) => string
export const parsers = {
    Uppercase: toUpperCase,
    Lowercase: toLowerCase,
    "DateTime": toDateTime
}
export const parserConfigs = {
    "DateTime": dateTimeConfig
}
