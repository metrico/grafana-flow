import { PanelData } from "@grafana/data";
export interface FlowItem {
    labels: Labels;
    Time: number;
    Line: string;
    tsNs: string;
    id: string;
    callid: string;
    correlationId: string | null;
    traceId: string | null;
    traceID: string | null;
}


export interface Labels {
    callid?: string;
    dst_ip: string;
    dst_port: string;
    hostname: string;
    job: string;
    method?: string;
    node: string;
    response?: string;
    src_ip: string;
    src_port: string;
    type: Type;
    timestamp: number;
    protocol?: string;
}


export enum Type {
    Log = "log",
    Rtcp = "rtcp",
    SIP = "sip",
}

export const formatAndSortFlowItems = (data: PanelData | undefined, sortType: "none" | "time_old" | "time_new" = 'none'): FlowItem[] => {
    if (typeof data === 'undefined') {
        return [];
    }
    const [serie] = data?.series || [];
    const fields = serie?.fields || [];
    if (fields) {
        const [firstField] = fields;

        const unSortData = firstField?.values?.map((i: any, k: number) => {
            const outData: any = {};
            fields.forEach((item: any) => {
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
            console.log(sortData);
            return sortData;
        }

        if (sortType === 'time_new') {
            console.log(sortData.reverse());
            return sortData.reverse();
        }

    }
    return []
}
