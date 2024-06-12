import React, { useEffect, useState } from 'react';
import { DetailItem } from '../DetailItem';
import { ParsedLabel } from './DataScheme';
import { parseDataIntoListOfFields } from 'helpers/dataProcessors/parseDataIntoListOfFields';
import { sampleParsedViewConfig, sampleParsedViewConfig2 } from 'test-samples/sample-parsed-view-config';
interface Value {
    value: string
    title: string
    tooltip: string
}
interface Props {
    data: any
    theme: string
    dataScheme: ParsedLabel[]
}
export const ParsedView: React.FC<any> = ({ data, theme, dataScheme }: Props): JSX.Element | null => {
    console.log(data)
    const [values, setValues] = useState<Value[]>([])
    dataScheme = sampleParsedViewConfig2
    useEffect(() => {
        parseData(data, dataScheme, setValues);
    }, [data, dataScheme])

    return (
        <>
            {values.map((item) => (
                <DetailItem item={[item.title, item.value]} theme={theme} tooltip={item.tooltip} key={item.value} />
            ))}
        </>
    );
}
export function parseData(data: any, dataScheme: ParsedLabel[], setValues: React.Dispatch<React.SetStateAction<Value[]>>) {
    const labelMap = new Map();
    Object.entries(data).forEach((item: any) => {
        let [key, value]: any = item;
        parseDataIntoListOfFields(value, labelMap, key);
    });
    const parsedValues = dataScheme.map((item) => {
        let value = '';
        if (item.isJSON) {
            value = JSON.stringify(labelMap.get(item.labels[0]), null, 2);
        } else {
            const labelData = item.labels.map((label) => {
                return labelMap.get(label)?.value ?? '';
            });

            value = labelData.join(item.separator ?? ' | ');
        }
        if (item.parser) {
            value = item.parser(value);
        }
        return {
            value: value,
            tooltip: item.tooltip,
            title: item.title
        };
    });
    setValues(parsedValues);
    return parsedValues
}
