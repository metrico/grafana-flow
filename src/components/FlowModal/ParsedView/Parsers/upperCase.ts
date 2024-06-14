import { ParsedLabel } from "../DataScheme"
import { Parser } from "./parsers"

export const toUpperCase: Parser = (value: string, label: ParsedLabel) => {
    return value.toUpperCase()
}
