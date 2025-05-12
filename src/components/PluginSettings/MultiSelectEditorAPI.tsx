import { StandardEditorProps } from '@grafana/data';
import { Select } from '@grafana/ui';
// import { apiDataContext } from "./../../helpers/apiDataContext";
import React, { useState, useEffect } from 'react';
import { getTableList } from 'services/api-service';

export const MultiSelectEditorAPI = ({ value, onChange, context: { data } }: StandardEditorProps<string[]>) => {
  const [selectValue, setSelectValue] = useState<any>();
  const [labels, setLabels] = useState<string[]>([]);
  const [newData, setNewData] = useState<any>();
  // const newData = useContext(apiDataContext);
  useEffect(() => {
    getTableList().then((data) => {
      console.log('getTableList().then::data', data);
      setNewData(data);
    });
    // const handler = (e: any) => setNewData(e.detail);
    // window.addEventListener('newDataUpdatedFromApi', handler);
    // return () => window.removeEventListener('newDataUpdatedFromApi', handler);
  }, []);

  useEffect(() => {
    if (newData) {
      const labels = newData?.map((i: any) => i.table_name);
      setLabels(labels);
    }
  }, [data, newData]);

  useEffect(() => {
    setSelectValue(value);
  }, [value]);

  return (
    <Select
      options={labels.map((i: any) => ({ label: i, value: i }))}
      value={selectValue}
      onChange={(v: any) => {
        console.log('v', v);
        setSelectValue(v);
        const { value }: any = v as any;
        onChange(value);
      }}
    />
  );
};
