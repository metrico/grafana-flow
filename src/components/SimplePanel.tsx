import { css, cx } from '@emotion/css';
import { GrafanaTheme2, PanelProps, StandardEditorProps } from '@grafana/data';
import { DateTime } from "luxon";
import React, { useEffect, useRef, useState } from 'react';
import ReactJson from 'react-json-view';
import './../../ngx-flow/widget/ngx-flow.js';
// @ts-ignore
import packets from '../libs/packets.js';
import { Buffer } from 'buffer';
// @ts-ignore
import { configure } from 'pcap-generator';
const ip = packets.ipPacket
const udp = packets.udpPacket
const tcp = packets.tcpPacket
const ethernet = packets.ethernetPacket


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
import { convertDateToFileName } from 'helpers/convertDateToFileName';
import { hash } from 'helpers/hash';
import { labelFormatter } from 'helpers/labelFormatter';
import { CopyText } from './CopyText/CopyText';
import { FilterPanel, Filters } from './FilterPanel/FilterPanel';



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

interface Labels {
    [key: string]: string
}


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
            link.download = `${convertDateToFileName(date)}.txt`;
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
            const values = fields[0]?.values.map((item: any, index: number) => {
                item.line = lineField?.values[index];
                return item
            }).filter((packet: any) => packet.type === 'sip')
            const sequenceMap = new Map<string, number>();
            const ipv4_regex = /(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}/;
            const packets2 = values.sort((a: any, b: any) => {
                return a.timestamp - b.timestamp
            }).map((labels: Labels, index: number) => {
                let line = labels.line
                let proto = ''
                line = line?.replace('UDP', 'TCP')
                if (line.includes('UDP')) {
                    proto += "UDP"
                } else if (line.includes('TCP')) {
                    proto += "TCP"
                }
                const fieldObj = {
                    data: line,
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
                const hash = `${fieldObj.srcIp}:${fieldObj.srcPort}->${fieldObj.dstIp}:${fieldObj.dstPort}`
                const sequence = sequenceMap.get(hash) ?? 1
                const packet_data = proto === 'UDP' ? udp.encode({
                    sourcePort: fieldObj.srcPort,
                    destinationPort: fieldObj.dstPort,
                    data: Buffer.from(line)
                }) : tcp.encode({
                    sourcePort: fieldObj.srcPort,
                    destinationPort: fieldObj.dstPort,
                    data: Buffer.from(line),
                    sequenceNumber: sequence,
                    acknowledgmentNumber: 0,
                    ack: true,
                    psh: true,
                    syn: false,
                })

                let ip_packet = ip.encode({
                    version: ipv4_regex.test(fieldObj.dstIp) ? 4 : 6,
                    protocol: fieldObj.proto,
                    sourceIp: fieldObj.srcIp,
                    destinationIp: fieldObj.dstIp,
                    data: packet_data,
                    ttl: 112,
                    nextHeader: fieldObj.nextHeader,
                    trafficClass: fieldObj.trafficClass,
                    flowLabel: fieldObj.flowLabel
                })
                let ethernetPacket = ethernet.encode({
                    data: ip_packet,
                    type: ipv4_regex.test(fieldObj.dstIp) ? '0800' : '86dd'
                })
                if (proto === 'TCP') {
                    sequenceMap.set(hash, (sequenceMap.get(hash) ?? 1) + Buffer.from(line).length)
                }
                return {
                    timestamp: fieldObj.ts,
                    buffer: ethernetPacket,
                    type: fields[0]?.values[index]?.type
                }
            })
            const generator = configure({ Buffer: Buffer, snapshotLength: 102400, linkLayerType: 1 })
            const pcapFile = generator(packets2)
            const blob = new Blob([pcapFile], { type: 'application/vnd.tcpdump.pcap' });
            // // Create element with <a> tag
            const link = document.createElement("a");

            // Add file content in the object URL
            link.href = URL.createObjectURL(blob);

            // Add file name
            const date = new Date();
            link.download = `${convertDateToFileName(date)}.pcap`;
            link.click();

        }
        document.addEventListener('export-flow-as-pcap', handler);
        return () => {
            document.removeEventListener('export-flow-as-pcap', handler)
        }
    }, [data])
    const themeName: string = useTheme2().name;
    const styles = useStyles2(getStyles);
    const [filters, setFilters] = useState<Filters>({ ip: {}, port: {}, ipPort: {}, method: {}, type: {}, callid: {} });
    // Set flow data and sort
    useEffect(() => {
        console.log(filters)
        const [serie]: any = (data as any)?.series || [];
        const fields = serie?.fields || [];
        if (fields) {
            const [firsField]: any = fields;
            const sortData = formattingDataAndSortIt(fields, options.sortoption);
            const outData = firsField?.values;
            const map = new Map();
            if (outData) {
                setFlowData({
                    actors: [], data: sortData.map((item: any) => {
                        const message: string = item.Line || '';
                        const labelItem: any = item.labels || {};
                        const getOptionValue = (optionArr: string[] | string) => {
                            if (optionArr instanceof Array) {
                                return optionArr.map((option: string) => labelFormatter(labelItem[option], option)).filter((a: any) => !!a).join(':');
                            }
                            return labelItem[optionArr] || '';
                        };
                        const itemHash = hash(JSON.stringify(item))
                        map.set(itemHash, item);

                        const isSrcIPDisabled = !(filters?.['ip']?.[labelItem.src_ip] ?? true)
                        const isDstIPDisabled = !(filters?.['ip']?.[labelItem.dst_ip] ?? true)
                        const isSrcPortDisabled = !(filters?.['port']?.[labelItem.src_port] ?? true)
                        const isDstPortDisabled = !(filters?.['port']?.[labelItem.dst_port] ?? true)
                        const isSrcIpPortDisabled = !(filters?.['ipPort']?.[labelItem.src_ip + ':' + labelItem.src_port] ?? true)
                        const isDstIpPortDisabled = !(filters?.['ipPort']?.[labelItem.dst_ip + ':' + labelItem.dst_port] ?? true)
                        const isMethodDisabled = !(filters?.['method']?.[labelItem.response] ?? true)
                        const isTypeDisabled = !(filters?.['type']?.[labelItem.type] ?? true)
                        const isCallidDisabled = !(filters?.['callid']?.[labelItem.callid] ?? true)
                        const hidden = isSrcIPDisabled || isDstIPDisabled || isSrcPortDisabled || isDstPortDisabled || isSrcIpPortDisabled || isDstIpPortDisabled || isMethodDisabled || isTypeDisabled || isCallidDisabled

                        return {
                            messageID: getOptionValue(options.colorGenerator) || 'Title',
                            details: getOptionValue(options.details) || '',
                            line: options.showbody && message || '',
                            source: getOptionValue(options.source) || '...',
                            destination: getOptionValue(options.destination) || '...',
                            title: getOptionValue(options.title) || '',
                            aboveArrow: getOptionValue(options.aboveArrow) || '',
                            belowArrow: getOptionValue(options.belowArrow) || '',
                            sourceLabel: getOptionValue(options.sourceLabel) || '',
                            destinationLabel: getOptionValue(options.destinationLabel) || '',
                            hidden,
                            hash: itemHash
                        }
                    }).filter((item: any) => !item.hidden)
                })
                setModalDataFields(map);
            }
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

                <FilterPanel data={data} onFilter={setFilters} onSimplify={setIsSimplify} />
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
