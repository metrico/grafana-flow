import { StandardEditorProps } from '@grafana/data';
import { MultiSelect } from '@grafana/ui';
// import { apiDataContext } from "./../../helpers/apiDataContext";
import React, { useState, useEffect } from 'react';

export const MultiSelectEditor = ({ value, onChange, context: { data } }: StandardEditorProps<string[]>) => {
  const [selectValue, setSelectValue] = useState<any>();
  const [labels, setLabels] = useState<string[]>([]);
  const [newData, setNewData] = useState<any>();
  // const newData = useContext(apiDataContext);
  useEffect(() => {
    const handler = (e: any) => setNewData(e.detail);
    window.addEventListener('newDataUpdatedFromApi', handler);
    return () => window.removeEventListener('newDataUpdatedFromApi', handler);
  }, []);

  useEffect(() => {
    const [serie] = newData?.series || [];
    // const fields = serie?.fields || [];
    const dataEntry = serie;
    if (dataEntry && dataEntry.fields) {
      const labelField = dataEntry.fields[0];
      if (labelField?.values.length > 0) {
        const labels = Object.keys(labelField.values[0]);
        setLabels(labels);
      }
    }
  }, [data, newData]);
  useEffect(() => {
    setSelectValue(value);
  }, [value]);
  return (
    <MultiSelect
      options={labels.map((i: any) => ({ label: i, value: i }))}
      value={selectValue}
      onChange={(v: any[]) => {
        setSelectValue(v);
        onChange(v.map((j: any) => j.value));
      }}
    />
  );
};
