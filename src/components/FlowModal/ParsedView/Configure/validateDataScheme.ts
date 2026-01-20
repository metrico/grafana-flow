import { ParsedLabel } from "../DataScheme"

export const validateDataScheme = (dataScheme: ParsedLabel[]): boolean => {
    if (!dataScheme || dataScheme.length === 0) {
        return false
    }
    if (dataScheme.every((item) => {
        return Array.isArray(item.labels) && item.labels.length > 0 && typeof item.title === 'string'
    })) {
        return true
    }
    return false
}
