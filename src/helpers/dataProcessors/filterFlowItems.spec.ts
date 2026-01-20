import { sampleFilter, sampleFilterWithoutRTCP } from "test-samples/sample-filter";
import { filterFlowItems } from "./filterFlowItems";
import { sampleData, sampleDataAfterBaseFilter, sampleDataAfterFilterWithoutRTCP } from "test-samples/sample-data";
import { samplePanelConfig } from "test-samples/sample-panel-config";

describe('filterFlowItems', () => {
    it('should return an empty array when data.series[0].fields is an empty array', () => {
        const result = filterFlowItems({ series: [{ fields: [] }] } as any, {}, () => { }, () => { }, sampleFilter);
        expect(result).toEqual({ actors: [], data: [] });
    });
    // Following tests assume result data has UTC timezone
    it('should return formatted data with all entries present when data is valid and all filters are on', () => {
        const result = filterFlowItems(sampleData, samplePanelConfig, () => { }, () => { }, sampleFilter);
        expect(result).toEqual(sampleDataAfterBaseFilter);
    });
    it('should return formatted data with some entries present when data is valid but RTCP filter is off', () => {
        const result = filterFlowItems(sampleData, samplePanelConfig, () => { }, () => { }, sampleFilterWithoutRTCP);
        expect(result).toEqual(sampleDataAfterFilterWithoutRTCP);
    });
});
