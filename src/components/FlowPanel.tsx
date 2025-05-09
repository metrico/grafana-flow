/* eslint-disable react-hooks/exhaustive-deps */
import { css, cx } from '@emotion/css';
import { GrafanaTheme2, PanelData, PanelProps } from '@grafana/data';
import React, { useEffect, useState } from 'react';
import '../../ngx-flow/widget/ngx-flow.js';

import { Button, Dropdown, Menu, useStyles2, useTheme2, Input, Icon, InlineField } from '@grafana/ui';
import { filterFlowItems } from 'helpers/dataProcessors/filterFlowItems';
import { pcapExporter, textExporter } from 'helpers/exporters';
import { FlowOptions } from 'types.js';
import { FilterPanel, Filters, defaultFilters } from './FilterPanel/FilterPanel';
import { FlowModal } from './FlowModal/FlowModal';
import { getData } from 'services/api-service';

export interface MyPanelProps extends PanelProps {
  options: FlowOptions;
}

type CustomElement<T> = Partial<T & React.DOMAttributes<T> & { children: any }>;

declare global {
  /* eslint-disable-next-line */
  namespace JSX {
    interface IntrinsicElements {
      ['ngx-flow-out']: CustomElement<any>;
    }
  }
}

const getStyles = ({ name: themeName }: GrafanaTheme2) => ({
  wrapper: css`
    font-family: Open Sans;
    position: relative;
  `,
  textBox: css`
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 10px;
  `,
  label: css`
    background-color: rgba(128, 128, 128, 0.1);
  `,
  pre: css`
    white-space: pre-wrap;
  `,
  searchContainer: css`
    border: 0px solid red;
    padding: 0;
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  `,
  searchContainerWrapper: css`
    border: 0px solid red;
    padding: 0.5rem;
    flex: 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
  `,
  searchFlowWrapper: css`
    border: 0px solid red;
    padding: 0rem;
    overflow: hidden;
    position: relative;
    flex: 1;
  `,
  buttonWrapper: css`
    display: flex;
    flex: 1,
    z-index: 3;
    border-radius: 2px;
    padding: 0;
    > * {
      margin: 0 5px;
    }
  `,
});

export const FlowPanel = (props: MyPanelProps) => {
  const { options, data, width, height, timeRange } = props;
  const [flowData, setFlowData] = useState({ actors: [], data: [] });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newData, setNewData] = useState({});
  const [modalData, setModalData] = useState({});
  const [modalDataFields, setModalDataFields] = useState<Map<string, any>>();
  const [isSimplify, setIsSimplify] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [searchFields, setSearchFields] = useState<any[]>([]);
  const [searchFieldsDoRequest, setSearchFieldsDoRequest] = useState<any[]>([]);
  console.log({ searchFieldsDoRequest });
  const onModalClose = () => {
    setModalIsOpen(false);
  };
  useEffect(() => {
    const _options: any = options;
    console.log({ options });
    let _filters: any[] = [];

    if (_options?.call_id) {
      _filters.push({ call_id: _options.call_id });
    }
    if (_options?.from_user) {
      _filters.push({ sip_from: _options.from_user });
    }
    if (_options?.to_user) {
      _filters.push({ sip_to: _options.to_user });
    }
    if (_options?.method) {
      _filters.push({ sip_method: _options.method });
    }
    setSearchFields(_filters);
    setSearchFieldsDoRequest(searchFields);
  }, [options]);

  // Export .txt
  useEffect(() => {
    setIsLoadingData(false);

    getData((options as any)?.db_table, timeRange, searchFieldsDoRequest).then((result: any) => {
      console.log('result:22:', result);
      setNewData((props: any) => result as any[]);
      setIsLoadingData(true);
    });
    // getSQLRequest(timeRange).then((result: any) => {
    //   console.log('result', result);
    //   setNewData((props: any) => getData(result.results));

    // });

    const handler = () => {
      textExporter(newData as PanelData);
    };
    document.addEventListener('export-flow-as-text', handler);

    return () => {
      document.removeEventListener('export-flow-as-text', handler);
    };
  }, [timeRange, options, searchFieldsDoRequest]);
  // Export .pcap
  useEffect(() => {
    const handler = () => {
      pcapExporter(newData as PanelData);
    };
    document.addEventListener('export-flow-as-pcap', handler);
    return () => {
      document.removeEventListener('export-flow-as-pcap', handler);
    };
  }, [newData, timeRange, isLoadingData]);
  const themeName: string = useTheme2().name;
  const styles = useStyles2(getStyles);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  // Set flow data and sort
  useEffect(() => {
    if (newData && options) {
      filterFlowItems(newData as PanelData, options, setFlowData, setModalDataFields, filters);

      //   setTimeout(() => {
      const event = new CustomEvent('newDataUpdatedFromApi', { detail: newData });

      window.dispatchEvent(event);
      //   }, 2000);
    }
  }, [newData, options, filters, isLoadingData]);
  useEffect(() => {
    const ngxFlowClickHandler = (e: any) => {
      const details: any = modalDataFields?.get(e.detail);
      if (typeof details?.labels === 'object') {
        details.labels = JSON.stringify(details.labels);
      }
      setModalData(details);
      setModalIsOpen(true);
    };
    document.addEventListener('ngx-flow-click-item', function (e: any) {
      ngxFlowClickHandler(e);
    });

    return () => {
      document.removeEventListener('ngx-flow-click-item', ngxFlowClickHandler);
    };
  }, [modalDataFields, isLoadingData]);
  console.log({ flowData });
  const flowDataJSON = JSON.stringify(flowData);
  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          document.dispatchEvent(new CustomEvent('export-flow-as-png'));
        }}
        label="Export flow as PNG"
      ></Menu.Item>
      <Menu.Item
        onClick={() => {
          document.dispatchEvent(new CustomEvent('export-flow-as-text'));
        }}
        label="Export flow as TXT"
      ></Menu.Item>
      <Menu.Item
        onClick={() => {
          document.dispatchEvent(new CustomEvent('export-flow-as-pcap'));
        }}
        label="Export flow as PCAP"
      ></Menu.Item>
    </Menu>
  );

  const handlerInput = (e: any) => {
    const { name, value }: any = e?.target || {};
    console.log('handlerInput', { name, value });
    setSearchFields((prevState: any[]): any[] => {
      const d = prevState.find((i: any) => Object.keys(i)[0] === name);
      if (!d) {
        prevState.push({ [name]: value });
      } else {
        prevState.forEach((i: any) => {
          const [key] = Object.keys(i);
          if (key === name) {
            i[key] = value;
          }
        });
      }
      const outStates = prevState.filter((i: any) => !!Object.values(i)[0]);
      console.log('>><<', outStates);
      return outStates;
    });
  };

  const handlerSearch = (e: any) => {
    console.log('handlerSearch', e);
    setSearchFieldsDoRequest(searchFields);
  };

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
          position: relative;
        `
      )}
    >
      <div className={styles.searchContainer}>
        <div className={styles.searchContainerWrapper}>
          {(options.search_fields as any || [])?.map((i: any) => (
            <SearchField name={i} key={i} onChange={handlerInput} />
          ))}
          {!!options.search_fields && options.search_fields?.length > 0 && (
            <Button style={{ padding: '0.5rem' }} icon="sync" onClick={(e) => handlerSearch(e)}>
              Run query
            </Button>
          )}
          <span style={{ flex: 1 }}></span>
          <div id="buttons" className={styles.buttonWrapper}>
            <FilterPanel data={data} onFilter={setFilters} onSimplify={setIsSimplify} options={options} />
            {data?.request?.app !== 'app' && (
              // <span >
              <Dropdown overlay={menu}>
                <Button
                  className={cx(
                    css`
                      border: 1px solid
                        ${themeName === 'Dark' ? 'hsla(240, 18.6%, 83.1%, 0.12)' : 'hsla(210, 12.2%, 16.1%, 0.12)'};
                      border-radius: 2px;
                      background-color: ${themeName === 'Dark' ? 'hsla(0, 0%, 0%, 0.5)' : 'hsla(0, 0%, 100%, 0.5)'};
                    `
                  )}
                  icon="bars"
                  fill="text"
                  variant="secondary"
                />
              </Dropdown>
              // </span>/
            )}
          </div>
        </div>
        <div className={styles.searchFlowWrapper}>
          <ngx-flow-out data-flow={flowDataJSON} is-simplify={isSimplify} theme={themeName} />
        </div>
      </div>

      <FlowModal
        fullData={data}
        modalIsOpen={modalIsOpen}
        modalData={modalData}
        onModalClose={onModalClose}
        themeName={themeName}
      />
    </div>
  );
};
export const SearchField = ({ _label, name, onChange }: any) => {
  const label = _label || name.split('_').join('-').toUpperCase();
  return (
    <InlineField grow={false} label={label}>
      <Input
        name={name}
        onChange={onChange}
        style={{ padding: '0.5rem', maxWidth: '150px' }}
        placeholder={label}
        prefix={<Icon name="search" />}
      />
    </InlineField>
  );
};
