import { css, cx } from '@emotion/css';
import { GrafanaTheme2, PanelProps, StandardEditorProps } from '@grafana/data';
import React, { useEffect, useRef, useState } from 'react';
import ReactJson from 'react-json-view';
import './../../ngx-flow/widget/ngx-flow.js';

import {
    Button,
    Collapse,
    Dropdown,
    Menu,
    Modal,
    MultiSelect,
    useStyles2,
    useTheme2
} from '@grafana/ui';
import { filterFlowItems } from 'helpers/dataProcessors/filterFlowItems';
import { pcapExporter, textExporter } from 'helpers/exporters';
import { CopyText } from './CopyText/CopyText';
import { FilterPanel, Filters, defaultFilters } from './FilterPanel/FilterPanel';



interface Props extends PanelProps {
    options: any
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

export const TemplateEditor = ({ value, onChange }: StandardEditorProps<string>) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const themeName: string = useTheme2().name;
    const styles = useStyles2(getStyles);

    const templateData = JSON.stringify({
        actors: [], data: [{
            messageID: 'messageID',
            details: 'details',
            source: 'source',
            destination: 'destination',
            title: 'title',
            aboveArrow: 'aboveArrow',
            belowArrow: 'belowArrow',
            sourceLabel: 'sourceLabel',
            destinationLabel: 'destinationLabel',
        }]
    });
    return <Collapse label="Template" isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
        <div className={cx(
            styles.wrapper, css`
    height: 250px;
    `)}>
            <ngx-flow-out data-flow={templateData} theme={themeName} />
        </div>
    </Collapse>;
}
export const SimpleEditor = ({ value, onChange, context: { data } }: StandardEditorProps<string[]>) => {
    const [selectValue, setSelectValue] = React.useState<any>();
    const [labels, setLabels] = useState<string[]>([])

    useEffect(() => {
        const dataEntry = data?.[0];
        if (dataEntry && dataEntry.fields) {
            const labelField = dataEntry.fields[0];
            const labels = Object.keys(labelField.values[0])
            setLabels(labels)
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

export const DetailItem: React.FC<any> = ({ item, theme }: any): JSX.Element | null => {
    let [key, value]: any = item;
    const themeName: any = theme === 'Dark' ? 'railscasts' : 'rjv-default'
    let isJSON = false;
    const styles = useStyles2(getStyles);
    const isTimestamp = (new Date(value)).getTime() > 0;
    if (isTimestamp) {
        value = `${new Date(value).toISOString()} | ${value}`;
    }
    try {
        isJSON = typeof JSON.parse(value) === 'object';
    } catch (e) { }
    const textAreaRef: any = useRef(null);

    function copyToClipboard() {
        if (textAreaRef && textAreaRef.current) {
            textAreaRef.current.focus();
            textAreaRef.current.select();
            document.execCommand('copy');
        }
    };
    const [copyValue, setCopyValue] = useState('')
    return (<div>
        <textarea
            ref={textAreaRef} value={copyValue} style={{ pointerEvents: 'none', opacity: 0, position: 'fixed', left: 0, top: 0, border: 0, padding: 0 }} />
        {value ? <>
            <strong className={styles.label}>{key}</strong>
            {isJSON ?
                <pre>
                    <ReactJson
                        src={JSON.parse(value)}
                        theme={themeName}
                        displayDataTypes={false}
                        displayObjectSize={false}
                        enableClipboard={({ src }) => {
                            let textToCopy = JSON.stringify(src);
                            if (textToCopy.startsWith("\"") && textToCopy.endsWith("\"")) {
                                textToCopy = textToCopy.substring(1, textToCopy.length - 1);
                            }
                            if (navigator.clipboard) {
                                navigator.clipboard.writeText(textToCopy)
                            } else {
                                setCopyValue(textToCopy)
                                setTimeout(() => {
                                    copyToClipboard()
                                }, 0);
                            }
                        }}
                        quotesOnKeys={false}
                        name={false}

                    />
                </pre> :
                <span style={{ position: 'relative' }}>
                    <pre className={styles.pre}>
                        {value}
                    </pre>
                    <span style={{ position: 'absolute', right: 15, top: 32 }}>

                        <CopyText text={value} />
                    </span>
                </span>
            }
        </> : <>
        </>}

    </div>);
}
let ngxFlowClickHandler: Function = function () { };

document.addEventListener('ngx-flow-click-item', function (e: any) {
    ngxFlowClickHandler(e)
});
export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
    const [flowData, setFlowData] = React.useState({ actors: [], data: [] });
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [modalData, setModalData] = React.useState({});
    const [modalDataFields, setModalDataFields] = React.useState<Map<string, any>>();
    const [isSimplify, setIsSimplify] = useState(false);
    const onModalClose = () => {
        setModalIsOpen(false);
    };
    // Export .txt
    useEffect(() => {
        const handler = (e: any) => {
            textExporter(data);
        }
        document.addEventListener('export-flow-as-text', handler);
        return () => {
            document.removeEventListener('export-flow-as-text', handler)
        }
    }, [data])
    // Export .pcap
    useEffect(() => {
        const handler = (e: any) => {
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
    console.log(flowData)
    ngxFlowClickHandler = (e: any) => {
        const details: any = modalDataFields?.get(e.detail)
        if (typeof details.labels === 'object') {
            details.labels = JSON.stringify(details.labels);
        }
        setModalData(details);
        setModalIsOpen(true);
    };
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

            <Modal title="Message Details" isOpen={modalIsOpen} onDismiss={onModalClose}>
                {modalData && Object.entries(modalData).map((item: any, key: number) => (
                    // <p>{item} | {key}</p>
                    <DetailItem item={item} key={key} theme={themeName} />
                ))}
                <Button variant="primary" onClick={onModalClose}>
                    Close
                </Button>
            </Modal>

        </div>
    );
};
