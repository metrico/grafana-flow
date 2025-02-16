import { sampleBrokenParsedViewConfig, sampleBrokenParsedViewConfig2, sampleBrokenParsedViewConfig3, sampleBrokenParsedViewConfig4, sampleParsedViewConfig } from "test-samples/sample-parsed-view-config"
import { validateDataScheme } from "./validateDataScheme"

describe('validateDataScheme', () => {

    it('should correctly validate data scheme for valid config', () => {
        const result = validateDataScheme(sampleParsedViewConfig)
        expect(result).toEqual(true)
    })

    it('should correctly validate data scheme for invalid config', () => {
        const result = validateDataScheme(sampleBrokenParsedViewConfig)
        expect(result).toEqual(false)
    })

    it('should correctly validate data scheme for invalid config 2', () => {
        const result = validateDataScheme(sampleBrokenParsedViewConfig2 as any)
        expect(result).toEqual(false)
    })

    it('should correctly validate data scheme for invalid config 3', () => {
        const result = validateDataScheme(sampleBrokenParsedViewConfig3 as any)
        expect(result).toEqual(false)
    })

    it('should correctly validate data scheme for invalid config 4', () => {
        const result = validateDataScheme(sampleBrokenParsedViewConfig4 as any)
        expect(result).toEqual(false)
    })
})
