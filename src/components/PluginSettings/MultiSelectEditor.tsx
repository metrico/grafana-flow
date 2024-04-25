import { StandardEditorProps } from "@grafana/data";
import { MultiSelect } from "@grafana/ui";
import React, { useState, useEffect } from "react";

export const MultiSelectEditor = ({ value, onChange, context: { data } }: StandardEditorProps<string[]>) => {
    const [selectValue, setSelectValue] = useState<any>();
    const [labels, setLabels] = useState<string[]>([])

    useEffect(() => {
        const dataEntry = data?.[0];
        if (dataEntry && dataEntry.fields) {
            const labelField = dataEntry.fields[0];
            if (labelField?.values.length > 0) {
                const labels = Object.keys(labelField.values[0])
                setLabels(labels)
            }
        }
    }, [data])
    useEffect(() => {
        setSelectValue(value)
    }, [value])
    return <MultiSelect
        options={labels.map((i: any) => ({ label: i, value: i }))}
        value={selectValue}
        onChange={(v: any[]) => {
            setSelectValue(v);
            onChange(v.map((j: any) => j.value));
        }}
    />;
};
