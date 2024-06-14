import { ParsedLabel } from "../DataScheme"
import { Parser } from "./parsers"

export const toLowerCase: Parser = (value: string, label: ParsedLabel, config?: any) => {
    return value.toLowerCase()
}
