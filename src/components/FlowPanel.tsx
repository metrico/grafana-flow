import { css, cx } from '@emotion/css';
import { GrafanaTheme2, PanelProps } from '@grafana/data';
import React, { useEffect, useState } from 'react';
import '../../ngx-flow/widget/ngx-flow.js';

import {
    Button,
    Dropdown,
    Menu,
    useStyles2,
    useTheme2
} from '@grafana/ui';
import { filterFlowItems } from 'helpers/dataProcessors/filterFlowItems';
import { pcapExporter, textExporter } from 'helpers/exporters';
import { FlowOptions } from 'types.js';
import { FilterPanel, Filters, defaultFilters } from './FilterPanel/FilterPanel';
import { FlowModal } from './FlowModal/FlowModal';
import { sampleData } from 'test-samples/sample-data';



export interface MyPanelProps extends PanelProps {
    options: FlowOptions
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

const getStyles = ({ name: themeName }: GrafanaTheme2) => {
    return {
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
        buttonWrapper: css`
       position: absolute;
       right: 20px; 
       top: -15px; 
       display: flex; 
       z-index: 3;
       border: 1px solid ${themeName === 'Dark' ? 'hsla(240, 18.6%, 83.1%, 0.12)' : 'hsla(210, 12.2%, 16.1%, 0.12)'};
       border-radius: 2px;
        padding: 0.2em;
       > * {
         margin: 0 5px;
         
       }
       &:hover {
           background-color: ${themeName === 'Dark' ? 'hsla(0, 0%, 0%, 0.8)' : 'hsla(0, 0%, 100%, 0.8)'};
       }

    `

    };
};




export const FlowPanel = ({ options, data, width, height }: MyPanelProps) => {
    data = sampleData    
    const [flowData, setFlowData] = useState({ actors: [], data: [] });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalData, setModalData] = useState({});
    const [modalDataFields, setModalDataFields] = useState<Map<string, any>>();
    const [isSimplify, setIsSimplify] = useState(false);
    const onModalClose = () => {
        setModalIsOpen(false);
    };
    // Export .txt
    useEffect(() => {
        const handler = () => {
            textExporter(data);
        }
        document.addEventListener('export-flow-as-text', handler);
        return () => {
            document.removeEventListener('export-flow-as-text', handler)
        }
    }, [data])
    // Export .pcap
    useEffect(() => {
        const handler = () => {
            pcapExporter(data);
        }
        document.addEventListener('export-flow-as-pcap', handler);
        return () => {
            document.removeEventListener('export-flow-as-pcap', handler)
        }
    }, [data])
    const themeName: string = useTheme2().name;
    const styles = useStyles2(getStyles);
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    // Set flow data and sort
    useEffect(() => {
        if (data && options) {
            filterFlowItems(data, options, setFlowData, setModalDataFields, filters);
        }
    }, [data, options, filters]);
    useEffect(() => {
        const ngxFlowClickHandler = (e: any) => {
            const details: any = modalDataFields?.get(e.detail)
            if (typeof details?.labels === 'object') {
                details.labels = JSON.stringify(details.labels);
            }
            setModalData(details);
            setModalIsOpen(true);
        };
        document.addEventListener('ngx-flow-click-item', function (e: any) {
            ngxFlowClickHandler(e)
        });

        return () => {
            document.removeEventListener('ngx-flow-click-item', ngxFlowClickHandler);
        }
    }, [modalDataFields]);

    const flowDataJSON = JSON.stringify(flowData);
    const menu = (
        <Menu>
            <Menu.Item
                onClick={() => {
                    document.dispatchEvent(new CustomEvent('export-flow-as-png'));
                }}
                label='Export flow as PNG'
            ></Menu.Item>
            <Menu.Item
                onClick={() => {
                    document.dispatchEvent(new CustomEvent('export-flow-as-text'));
                }}
                label='Export flow as TXT'
            ></Menu.Item>
            <Menu.Item
                onClick={() => {
                    document.dispatchEvent(new CustomEvent('export-flow-as-pcap'));
                }}
                label='Export flow as PCAP'
            ></Menu.Item>
        </Menu>
    )
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
            <div id="buttons" className={styles.buttonWrapper}>

                <FilterPanel data={data} onFilter={setFilters} onSimplify={setIsSimplify} options={options} />
                {(data?.request?.app !== 'app') && (
                    // <span >
                    <Dropdown overlay={menu}>

                        <Button className={cx(
                            css`
              border: 1px solid ${themeName === 'Dark' ? 'hsla(240, 18.6%, 83.1%, 0.12)' : 'hsla(210, 12.2%, 16.1%, 0.12)'};
              border-radius: 2px;
              background-color: ${themeName === 'Dark' ? 'hsla(0, 0%, 0%, 0.5)' : 'hsla(0, 0%, 100%, 0.5)'};
            `)} icon="bars" fill="text" variant="secondary" />
                    </Dropdown>
                    // </span>/
                )}
            </div>
            {/* <pre>{JSON.stringify(flowData)}</pre> */}
            {/* <FlowMemo flowData={flowData} themeName={themeName} /> */}
            <ngx-flow-out data-flow={flowDataJSON} is-simplify={isSimplify} theme={themeName} />

            <FlowModal fullData={data} modalIsOpen={modalIsOpen} modalData={modalData} onModalClose={onModalClose} themeName={themeName} />

        </div>
    );
};
