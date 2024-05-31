import React, { useEffect, useState } from 'react';
import { DetailItem } from '../DetailItem';
import { ParsedLabel } from './DataScheme';
import { parseDataIntoListOfFields } from 'helpers/dataProcessors/parseDataIntoListOfFields';
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
    const [values, setValues] = useState<Value[]>([])
    useEffect(() => {
        const labelMap = new Map()
        Object.entries(data).forEach((item: any) => {
            let [key, value]: any = item
            parseDataIntoListOfFields(value, labelMap, key)
        })
        const parsedValues = dataScheme.map((item) => {
            let value = ''
            if (item.isJSON) {
                value = JSON.stringify(labelMap.get(item.labels[0]), null, 2)
            } else {
                const labelData = item.labels.map((label) => {
                    return labelMap.get(label)?.value ?? ''
                })

                value = labelData.join(item.separator ?? ' | ')
            }
            if (item.parser) {
                value = item.parser(value)
            }
            return {
                value: value,
                tooltip: item.tooltip,
                title: item.title
            }
        })

        setValues(parsedValues)
    }, [data, dataScheme])

    return (
        <>
            {values.map((item) => (
                <DetailItem item={[item.title, item.value]} theme={theme} tooltip={item.tooltip} key={item.value} />
            ))}
        </>
    );
}
