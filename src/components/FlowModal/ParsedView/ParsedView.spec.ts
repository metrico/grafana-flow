import { sampleParsedViewConfig, sampleParsedViewConfig2 } from "test-samples/sample-parsed-view-config";
import { parseData } from "./ParsedView";
import { parsedViewSampleDataSIP, parsedViewSampleDataSIPAfterParse, parsedViewSampleDataSIPAfterParseSecondConfig } from "test-samples/sample-data";


describe('ParsedView', () => {

    it('should correctly parse SIP data based on data scheme', () => {
        const result = parseData(parsedViewSampleDataSIP, sampleParsedViewConfig, () => { })
        expect(result).toEqual(parsedViewSampleDataSIPAfterParse);
    })
    it('should correctly parse RTCP data based on data scheme', () => {
        const result = parseData(parsedViewSampleDataSIP, sampleParsedViewConfig, () => { })
        expect(result).toEqual(parsedViewSampleDataSIPAfterParse);
    })
    it('should correctly parse SIP data based on second data scheme', () => {
        const result = parseData(parsedViewSampleDataSIP, sampleParsedViewConfig2, () => { })
        expect(result).toEqual(parsedViewSampleDataSIPAfterParseSecondConfig);
    })
});
