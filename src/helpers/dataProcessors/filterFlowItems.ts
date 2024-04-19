import { PanelData } from "@grafana/data";
import { Filters } from "components/FilterPanel/FilterPanel";
import { hash } from "helpers/hash";
import { labelFormatter } from "helpers/labelFormatter";
import { formatAndSortFlowItems } from "./formatAndSortFlowItems";

export const filterFlowItems = (data: PanelData, options: any, setFlowData: Function, setModalDataFields: Function, filters: Filters) => {
    console.log(filters)
    const [serie] = (data)?.series || [];
    const fields = serie?.fields || [];
    if (fields) {
        const [firstField] = fields;
        const sortData = formatAndSortFlowItems(data, options.sortoption);
        const outData = firstField?.values;
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
}
