import React, { useEffect, useRef, useState } from 'react';
import { PanelProps, StandardEditorProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from '@emotion/css';
import './../../ngx-flow/widget/ngx-flow.js';
import ReactJson from 'react-json-view';
import { DateTime } from "luxon";
// @ts-ignore
import packets from '../libs/packets.js';
// @ts-ignore
import { configure } from 'pcap-generator'
import { Buffer } from 'buffer'
const ip = packets.ipPacket
const udp = packets.udpPacket
const tcp = packets.tcpPacket

import {
    Button,
    MultiSelect,
    Collapse,
    Modal,
    useStyles2,
    useTheme2,
    Dropdown,
    Menu
} from '@grafana/ui';



interface Props extends PanelProps<SimpleOptions> { }

type CustomElement<T> = Partial<T & React.DOMAttributes<T> & { children: any }>;

declare global {
    /* eslint-disable-next-line */
    namespace JSX {
        interface IntrinsicElements {
            ['ngx-flow-out']: CustomElement<any>;
        }
    }
}
export let valueLabelsName: string[] = [];
let bufferCheck = '';
export const TemplateEditor = ({ value, onChange }: StandardEditorProps<string>) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const themeName: string = useTheme2().name;
    const styles = useStyles2(getStyles);

    const templateData = JSON.stringify({
        actors: [], data: [{
            messageID: 'messageID',
            subTitle: 'subTitle',
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
export const SimpleEditor = ({ value, onChange }: StandardEditorProps<string[]>) => {
    const [selectValue, setSelectValue] = React.useState<any>();
    const [forRerender, setForRerender] = React.useState<any>(0);

    if (bufferCheck !== JSON.stringify(valueLabelsName) || valueLabelsName?.length === 0) {
        setTimeout(() => {
            bufferCheck = JSON.stringify(valueLabelsName)
            setSelectValue(value);
            setForRerender(forRerender + 1);
        }, 200)
    }

    return <MultiSelect
        options={valueLabelsName.map((i: any) => ({ label: i, value: i }))}
        value={selectValue}
        onChange={(v: any[]) => {
            setSelectValue(v);
            onChange(v.map((j: any) => j.value));
        }}
    />;
};

const getStyles = () => {
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
    `
    };
};

export const DetaiItem: React.FC<any> = ({ item, theme }: any): JSX.Element | null => {
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
                            if (navigator.clipboard) {
                                navigator.clipboard.writeText(JSON.stringify(src))
                            } else {
                                setCopyValue(JSON.stringify(src))
                                setTimeout(() => {
                                    copyToClipboard()
                                }, 0);
                            }
                        }}
                        quotesOnKeys={false}
                        name={false}

                    />
                </pre> :
                <pre className={styles.pre}>{value}</pre>
            }
        </> : <>
        </>}

    </div>);
}
let ngxFlowClickHandler: Function = function () { };

document.addEventListener('ngx-flow-click-item', function (e: any) {
    ngxFlowClickHandler(e)
});

function formattingDataAndSortIt(data: any, sortType = 'none') {

    let [firstField] = data || [];

    const unSortData = firstField?.values?.map((i: any, k: number) => {
        const outData: any = {};
        data.forEach((item: any) => {
            outData[item.name] = item?.values?.[k];
        });
        if (outData?.Time && typeof outData?.labels === 'object') {
            outData['labels'].timestamp = outData.Time;
        }
        return outData;
    }) || [];
    if (sortType === 'none') {
        return unSortData;
    }
    const sortData = unSortData.sort((itemA: any, itemB: any) => {
        if (itemA.tsNs && itemB.tsNs) {
            const a = itemA.tsNs;
            const b = itemB.tsNs;
            return a < b ? -1 : a > b ? 1 : 0;
        } else {
            const a = itemA.Time;
            const b = itemB.Time;
            return a < b ? -1 : a > b ? 1 : 0;
        }
    });
    if (sortType === 'time_old') {
        return sortData;
    }

    if (sortType === 'time_new') {
        return sortData.reverse();
    }

}




export const SimplePanel: React.FC<Props> = ({ options, data, width, height }: any) => {
    const [flowData, setFlowData] = React.useState({ actors: [], data: [] });
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [modalData, setModalData] = React.useState({});
    const [modalDataFields, setModalDataFields] = React.useState([]);

    const onModalClose = () => {
        setModalIsOpen(false);
    };
    // Export .txt
    useEffect(() => {
        const handler = (e: any) => {

            const [serie]: any = (data as any)?.series || [];
            const fields = serie?.fields || [];
            const lineField = fields.find((i: any) => i.name === 'Line') ?? [];
            const exportText = lineField?.values.map((i: string, index: number) => {
                let dt = DateTime.fromMillis(fields[0]?.values[index]?.timestamp).toISO()
                dt = dt?.replace('+', '000+') ?? '';
                if (fields[0]?.values[index]?.type !== 'sip') {
                    i = '';
                }
                let proto = 'proto:'
                if (i.includes('UDP')) {
                    proto += "UDP"
                } else if (i.includes('TCP')) {
                    proto += "TCP"
                }
                return `${proto} ${dt} ${fields[0]?.values[index]?.src_ip} ---> ${fields[0]?.values[index]?.dst_ip} \n\n${i}`
            }).join('\n');
            // Create element with <a> tag
            const link = document.createElement("a");

            // Create a blog object with the file content which you want to add to the file
            const file = new Blob([exportText], { type: 'text/plain' });

            // Add file content in the object URL
            link.href = URL.createObjectURL(file);

            // Add file name
            const date = new Date();
            link.download = `${date.toUTCString()}.txt`;
            link.click();
        }
        document.addEventListener('export-flow-as-text', handler);
        return () => {
            document.removeEventListener('export-flow-as-text', handler)
        }
    }, [data])
    // Export .pcap
    useEffect(() => {
        const handler = (e: any) => {

            const [serie]: any = (data as any)?.series || [];
            const fields = serie?.fields || [];
            const lineField = fields.find((i: any) => i.name === 'Line') ?? [];
            const packets2 = lineField?.values.map((field: string, index: number) => {

                const labels = fields[0]?.values[index]
                let proto = ''
                if (field.includes('UDP')) {
                    proto += "UDP"
                } else if (field.includes('TCP')) {
                    proto += "TCP"
                }
                const fieldObj = {
                    data: field,
                    srcIp: labels.src_ip,
                    dstIp: labels.dst_ip,
                    srcPort: labels.src_port,
                    dstPort: labels.dst_port,
                    ts: fields[0]?.values[index]?.timestamp,
                    proto: proto === 'UDP' ? 17 : 6,
                    type: fields[0]?.values[index]?.type,
                    trafficClass: 0,
                    flowLabel: 0,
                    nextHeader: proto === 'UDP' ? 17 : 6
                }
                const ipv4_regex = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm;

                const packet_data = proto === 'UDP' ? udp.encode({
                    sourcePort: fieldObj.srcPort,
                    destinationPort: fieldObj.dstPort,
                    data: Buffer.from(fieldObj.data)
                }) : tcp.encode({
                    sourcePort: fieldObj.srcPort,
                    destinationPort: fieldObj.dstPort,
                    data: Buffer.from(fieldObj.data)
                })
                let ip_packet = ip.encode({
                    version: ipv4_regex.test(fieldObj.srcIp) ? 4 : 6,
                    protocol: fieldObj.proto,
                    sourceIp: fieldObj.srcIp,
                    destinationIp: fieldObj.dstIp,
                    data: packet_data,
                    ttl: 112,
                    nextHeader: fieldObj.nextHeader,
                    trafficClass: fieldObj.trafficClass,
                    flowLabel: fieldObj.flowLabel
                })
                return {
                    timestamp: fieldObj.ts,
                    buffer: ip_packet,
                    type: fields[0]?.values[index]?.type
                }
            }).filter((packet: any) => packet.type === 'sip')
            const generator = configure({ Buffer: Buffer })
            const pcapFile = generator(packets2)
            const blob = new Blob([pcapFile], { type: 'application/vnd.tcpdump.pcap' });
            // // Create element with <a> tag
            const link = document.createElement("a");

            // Add file content in the object URL
            link.href = URL.createObjectURL(blob);

            // Add file name
            const date = new Date();
            link.download = `${date.toUTCString()}.pcap`;
            link.click();

        }
        document.addEventListener('export-flow-as-pcap', handler);
        return () => {
            document.removeEventListener('export-flow-as-pcap', handler)
        }
    }, [data])
    const styles = useStyles2(getStyles);
    React.useEffect(() => {
        const [serie]: any = (data as any)?.series || [];
        const fields = serie?.fields || [];
        if (fields) {
            const [firsField]: any = fields;
            const sortData = formattingDataAndSortIt(fields, options.sortoption);
            setModalDataFields(sortData);
            const outData = firsField?.values;

            if (outData) {
                valueLabelsName = Object.keys(outData?.[0] || {});
                setFlowData({
                    actors: [], data: sortData.map((item: any) => {
                        const message: string = item.Line || '';
                        const labelItem: any = item.labels || {};
                        const _ = (optionArr: string[] | string) => {
                            if (optionArr instanceof Array) {
                                return optionArr.map((option: string) => labelItem[option]).filter((a: any) => !!a).join(':');
                            }
                            return labelItem[optionArr] || '';
                        };
                        return {
                            messageID: _(options.colorGenerator) || 'Title',
                            subTitle: options.showbody && message,
                            source: _(options.source) || '...',
                            destination: _(options.destination) || '...',
                            title: _(options.title) || '',
                            aboveArrow: _(options.aboveArrow) || '',
                            belowArrow: _(options.belowArrow) || '',
                            sourceLabel: _(options.sourceLabel) || '',
                            destinationLabel: _(options.destinationLabel) || ''
                        }
                    })
                })

            }
        }
        /* eslint-disable-next-line */
    }, [data, options]);

    ngxFlowClickHandler = (e: any) => {
        const details: any = modalDataFields[e.detail];
        if (typeof details.labels === 'object') {
            details.labels = JSON.stringify(details.labels);
        }
        setModalData(details);
        setModalIsOpen(true);
    };
    const themeName: string = useTheme2().name;
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
            {data?.request?.app === 'dashboard' && (
                // <span >
                <Dropdown overlay={menu}>

                    <Button className={cx(
                        css`
              position: absolute;
              top: 15px;
              right: 40px;
              border: 1px solid ${themeName === 'Dark' ? 'hsla(240, 18.6%, 83.1%, 0.12)' : 'hsla(210, 12.2%, 16.1%, 0.12)'};
              border-radius: 2px;
              background-color: ${themeName === 'Dark' ? 'hsla(0, 0%, 0%, 0.5)' : 'hsla(0, 0%, 100%, 0.5)'};
              z-index: 2;
            `)} icon="bars" fill="text" variant="secondary" />
                </Dropdown>
                // </span>/
            )}
            {/* <pre>{JSON.stringify(flowData)}</pre> */}
            {/* <FlowMemo flowData={flowData} themeName={themeName} /> */}
            <ngx-flow-out data-flow={flowDataJSON} theme={themeName} />

            <Modal title="Message Details" isOpen={modalIsOpen} onDismiss={onModalClose}>
                {modalData && Object.entries(modalData).map((item: any, key: number) => (
                    // <p>{item} | {key}</p>
                    <DetaiItem item={item} key={key} theme={themeName} />
                ))}
                <Button variant="primary" onClick={onModalClose}>
                    Close
                </Button>
            </Modal>

        </div>
    );
};
