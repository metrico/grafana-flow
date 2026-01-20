import { formatAndSortFlowItems } from "./formatAndSortFlowItems";
import { sampleData, sampleDataFormattedAndSortedNewFirst, sampleDataFormattedAndSortedOldFirst, sampleDataFormattedAndUnsorted } from "test-samples/sample-data";

describe('formatAndSortFlowItems', () => {
    it('should return an empty array when data.series[0].fields is an empty array', () => {
        const result = formatAndSortFlowItems({ series: [{ fields: [] }] } as any, 'none');
        expect(result).toEqual([]);
    });

    it('should return an empty array when data.series[0].fields[0].values is undefined', () => {
        const result = formatAndSortFlowItems({ series: [{ fields: [{ values: undefined }] }] } as any, 'none');
        expect(result).toEqual([]);
    });

    it('should return an empty array when data.series[0].fields[0].values is an empty array', () => {
        const result = formatAndSortFlowItems({ series: [{ fields: [{ values: [] }] }] } as any, 'none');
        expect(result).toEqual([]);
    });

    it('should return an unsorted array when sortType is "none"', () => {
        const result = formatAndSortFlowItems(sampleData, 'none');
        expect(result).toEqual(sampleDataFormattedAndUnsorted);
    });

    it('should return a sorted array when sortType is "time_old"', () => {
        const result = formatAndSortFlowItems(sampleData, 'time_old');
        expect(result).toEqual(sampleDataFormattedAndSortedOldFirst);
    });

    it('should return a sorted array when sortType is "time_new"', () => {
        const result = formatAndSortFlowItems(sampleData, 'time_new');
        expect(result).toEqual(sampleDataFormattedAndSortedNewFirst);
    });
});
