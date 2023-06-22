import * as moment from 'moment';
import 'moment-timezone';
import { FlowItemType } from '../models/flow-item-type.model';

import { protoCheck } from './functions';
export enum WorkerCommands {
    // transaction service / parsing transaction
    FLOW_PARSING,
    MEDIA_REPORT_PARSING,
    TRANSACTION_SERVICE_TRNS,
    TRANSACTION_SERVICE_DTMF,
    TRANSACTION_SERVICE_QOS,
    TRANSACTION_SERVICE_LOG,
    TRANSACTION_SERVICE_FULL,
    TRANSACTION_SERVICE_ONE_WAY_AUDIO,
    // clickhouse chart widget
    CLICKHOUSE_PARSE_DATA,
    CLICKHOUSE_PREPARE_RENDER_DATA
}
class Functions {
    static protoCheck(protocol: number) {
        return (
            {
                '1': 'udp',
                '2': 'tcp',
                '3': 'wss',
                '17': 'udp',
                '22': 'tls',
                '132': 'sigtran',
                '6': 'tcp',
                '4': 'sctp',
            }[protocol] || 'udp'
        );
    }
    static detectNAT(strIP = '') {
        /**
         * NAT IPs - 10.x.x.x, 192.168.x.x, 172.16.0.0 - 172.31.255.255
         */
        return strIP.match(
            /(^192\.168\.\d+\.\d+(\:\d+)?$)|(^10\.\d+\.\d+\.\d+(\:\d+)?$)|(^172\.(1[6-9]|2[0-9]|3[0-2])+\.\d+\.\d+(\:\d+)?$)/g
        );
    }
    static getMethodColor(str: any) {
        let color = 'hsl(0,0%,0%)';
        if (str === 'INVITE') {
            color = 'hsl(227.5,82.4%,51%)';
        } else if (str === 'BYE' || str === 'CANCEL') {
            color = 'hsl(120,100%,25%)';
        } else if (str >= 100 && str < 200) {
            color = 'hsl(0,0%,0%)';
        } else if (str >= 200 && str < 300) {
            color = 'hsl(120,70%,50%)';
        } else if (str >= 300 && str < 400) {
            color = 'hsl(280,100%,50%)';
        } else if (str >= 400 && str < 500) {
            color = 'hsl(15,100%,45%)';
        } else if (str >= 500 && str < 700) {
            color = 'hsl(0,100%,45%)';
        } else {
            color = 'hsl(0,0%,0%)';
        }
        return color;
    }
    static methodCheck(payload: number) {
        return (
            {
                '1': 'SIP',
                '5': 'RTCP',
                '8': 'ISUP',
                '38': 'DIAMETER',
                '39': 'GSM-MAP',
                '34': 'RTP-SHORT-R',
                '35': 'RTP-FULL-R',
                '100': 'LOG',
                '1000': 'JSON-DYN',
            }[payload] || 'HEP-' + payload
        );
    }
    static tosCheck(tos: number) {
        const dscp = tos >>> 2;

        if (dscp === 0) {
            return '0';
        }

        return (
            {
                '8': 'CS1',
                '10': 'AF11',
                '12': 'AF12',
                '14': 'AF13',
                '16': 'CS2',
                '18': 'AF21',
                '20': 'AF22',
                '22': 'AF23',
                '24': 'CS3',
                '26': 'AF31',
                '28': 'AF32',
                '30': 'AF33',
                '32': 'CS4',
                '34': 'AF41',
                '36': 'AF42',
                '38': 'AF43',
                '40': 'CS5',
                '46': 'EF',
                '48': 'CS6',
                '56': 'CS7',
            }[dscp] + `(${dscp})` || dscp + ''
        );
    }
    static hash(str: string, lenHash: number = 32) {
        lenHash = lenHash || 32;
        str = str || "";
        let ar = str.split('').map((a) => a.charCodeAt(0)),
            s2alength = ar.length || 1,
            i = ar.length ? ar.reduce((p, c) => p + c) : 1,
            s = "",
            A,
            B,
            k = 0,
            tan = Math.tan;
        while (s.length < lenHash) {
            A = ar[k++ % s2alength] || 0.5;
            B = ar[k++ % s2alength ^ lenHash] || 1.5 ^ lenHash;
            i = i + (A ^ B) % lenHash;
            s += tan(i * B / A).toString(16).split('.')[1].slice(0, 10);
        }
        return s.slice(0, lenHash);
    }

    static md5(str: string): string {
        str = str || '';
        return Functions.hash(str) + '';
    }

    static md5object(obj: any): string {
        try {
            return Functions.md5(JSON.stringify(obj) || '');
        } catch (err) {
            return Functions.md5('');
        }
    }

    static cloneObject(src: any): any {
        try {
            return JSON.parse(JSON.stringify(src));
        } catch (err) { }

        return src;
    }
    static getColorByString(
        str: string,
        saturation?: number,
        lightness?: number,
        alpha?: number,
        offset?: number
    ) {
        const col = Functions.getColorByStringHEX(str);
        /* const num = parseInt(col, 16) % 360; */
        const result:any = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(col);

        let r = parseInt(result[1], 16);
        let g = parseInt(result[2], 16);
        let b = parseInt(result[3], 16);
        (r /= 255), (g /= 255), (b /= 255);
        const max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        let h:any,
            s:any,
            l:number = (max + min) / 2;
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        h = Math.round(h * 360);
        saturation = saturation || Math.round(s * 100);
        lightness = lightness || Math.round(l * 100);
        alpha = alpha || 1;
        offset = offset || 0;
        return `hsl(${h - offset}, ${saturation}%, ${lightness}%,${alpha})`;
    }

    static getColorByStringHEX(str: string) {
        if (str === 'LOG') {
            return 'FFA562';
        }
        let hash = 0;
        let i = 0;
        str = this.md5(str);
        for (i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        i = hash;
        let col =
            ((i >> 24) & 0xaf).toString(16) +
            ((i >> 16) & 0xaf).toString(16) +
            ((i >> 8) & 0xaf).toString(16) +
            (i & 0xaf).toString(16);
        if (col.length < 6) {
            col = col.substring(0, 3) + '' + col.substring(0, 3);
        }
        if (col.length > 6) {
            col = col.substring(0, 6);
        }
        return col;
    }
    static arrayUniques(arr: string[]): string[] {
        return arr.sort().filter((i, k, a) => i !== a[k - 1]);
    }
    static msToTime(ms: number) {
        var milliseconds = ms % 1000 >> 0,
            seconds = Math.floor((ms / 1000) % 60),
            minutes = Math.floor((ms / (1000 * 60)) % 60),
            hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        let milrest = (milliseconds / 10) >> 0 || '';
        milrest = milrest < 10 ? '0' + milrest : milrest;
        let secrest = (seconds / 0.6) >> 0 || '';
        secrest = secrest < 10 && minutes > 0 ? '0' + secrest : secrest;
        let minrest = (minutes / 0.6) >> 0 || '';
        minrest = minrest < 10 && hours > 0 ? '0' + minrest : minrest;
        let secs = seconds + (milrest > 0 ? '.' + milrest : '');
        let mins = minutes + (secrest > 0 ? '.' + secrest : '');
        let hrs = hours + (minrest > 0 ? '.' + minrest : '');

        if (hours > 0) {
            return hrs + ' h';
        } else if (minutes > 0) {
            return mins + ' min';
        } else {
            return secs + ' s';
        }
    }
}
export class TransactionServiceProcessor {
    public pipeDataTransaction(transactionData: any) {
        if (!transactionData || !transactionData.data) {
            return transactionData;
        }

        transactionData.data.ipaliases = Object.values(transactionData.data?.ipalias || {});
        const { SIP, SDP, DTMF, RTP, RTCP, LOG } = FlowItemType;
        const {
            calldata,
            messages,
            hosts,
            hostinfo,
            callid,
            uac,
            sdp,
            transaction,
            ipaliases = [],
        } = transactionData.data;
        let { alias } = transactionData.data;
        const aliasNonIps = Object.entries(alias)
            .filter(([key, val]) => key !== val)
            .reduce((a:any, b) => {
                const [key, value] = b;
                a[key] = value;
                return a;
            }, {});

        const ipaliasesAggrigated = ipaliases
            .filter((i: any) => i.ip)
            .map((i: any) => ({ [i.ip + ':' + i.port]: i.alias }))
            .reduce((a: any, b: any) => {
                const [key] = Object.keys(b);
                a[key] = b[key];
                return a;
            }, {});

        alias = Object.assign({}, ipaliasesAggrigated, aliasNonIps);
        const fullCallData = messages.map((messageItem: any) => {
            const callDataItem = calldata.find((j: any) => {
                return (
                    j.create_date === messageItem.create_date && j.id === messageItem.id
                );
            });
            const messagesKeys: any = Object.keys(messageItem);
            const calldataKeys: any = Object.keys(callDataItem);
            const allKeys = Functions.arrayUniques(
                [].concat(messagesKeys, calldataKeys)
            );

            const compareData: any = allKeys
                .map((key) => {
                    const [m, c] = [messageItem[key], callDataItem[key]];
                    if ('data' === key) {
                        try {
                            return { data: JSON.parse(m) };
                        } catch (_) {
                            return { data: m };
                        }
                    }

                    if (['micro_ts', 'table'].includes(key)) {
                        return { [key]: m };
                    }
                    let outObj = [m, c];
                    if (m === c) {
                        outObj = m;
                    } else if (
                        m === null ||
                        c === null ||
                        m === undefined ||
                        c === undefined
                    ) {
                        outObj = typeof m !== 'undefined' ? m : c;
                    }
                    return { [key]: outObj };
                })
                .reduce((a, b) => {
                    Object.assign(a, b);
                    return a;
                }, {});

            compareData.typeItem = SIP;

            return compareData;
        });

        transaction?.forEach((trans: any) => {
            ['data', 'vqr_a', 'vqr_b'].forEach((name) => {
                try {
                    if (trans && trans.hasOwnProperty(name)) {
                        trans[name] = JSON.parse(trans[name]);
                    }
                } catch (_) { }
            });
        });
        const getAliasByIp = (ip: any) => this.getAliasByIp(ip, alias);
        let fullHosts: any = Object.values(hosts).map((m: any) => {
            if (!m.host) {
                throw console.error('HTTP ERROR: hosts is broken');
            }
            const [_ip] = m.host;

            const isIPv4 = _ip.match(/^\d+\.\d+\.\d+\.\d+(\:\d+)?$/g) !== null;
            let PORT = isIPv4
                ? _ip
                    ?.match(/\:\d+/g)
                    ?.find((j: any) => !!j)
                    .split(':')[1] * 1
                : null;
            let IP = isIPv4
                ? _ip?.match(/^\d+\.\d+\.\d+\.\d+/g)?.find((j: any) => !!j)
                : _ip;
            if (!isIPv4) {
                // do parsing IPv6
                PORT = _ip.split(/\:/g).pop() * 1;
                IP = _ip
                    .split(/\:\d+$/g)
                    .shift()
                    .replace(/\[|\]/g, '');
            }

            return {
                alias: getAliasByIp(_ip),
                host: isIPv4 ? _ip : `[${IP}]:${PORT}`,
                ip: IP,
                port: PORT || 0,
                isIPv4,
                position: m.position,
            };
        });

        fullHosts = Array.from({ length: fullHosts.length }, (m, k) => {
            return fullHosts.find((j: any) => j.position === k);
        });

        if (uac) {
            Object.entries(uac).forEach((uacItem: any) => {
                const [ip, obj]: [string, any] = uacItem;
                delete obj?.alias;
                Object.assign(
                    fullHosts.find((h: any) => h.ip === ip),
                    obj
                );
            });
        }

        const sdpFlowItems: any = this.sdpFormatterToFlowItem(sdp);

        const out = {
            filters: {
                payload: {
                    [SIP]: true,
                    [SDP]: sdpFlowItems.length > 0,
                    [DTMF]: false,
                    [RTP]: false,
                    [RTCP]: false,
                    [LOG]: false,
                },
                callid,
            },
            ipaliases,
            alias,
            hosts: fullHosts,
            hostinfo: hostinfo || {},
            messages: [].concat(fullCallData, sdpFlowItems),
            callid: callid || [],
            uac: uac || {},
            data: transactionData.data,
        };
        return out;
    }
    public pipeDataQos(resData: any) {
        if (resData?.data?.reports || resData?.data?.uac) {
            let { reports, uac } = resData?.data || {};
            if (!reports) {
                reports = [];
            }

            if (!uac) {
                uac = [];
            }


            const formattingItem = (item: any, tabType: any) => {
                try {
                    item.data = JSON.parse(item.data);
                    try {
                        item.message = JSON.parse(item?.message);
                    } catch (err) { }
                    item.tabType = tabType;
                    item.messageType =
                        item.message.SOURCE && item.message.SOURCE === FlowItemType.RTCP
                            ? FlowItemType.RTCP
                            : FlowItemType.RTP;

                    const { create_ts, micro_ts } = item;
                    const toUnix = (t: any) =>
                        t.toString(16).length > 8 ? Math.floor(t / 1000) : t;
                    const min_ts = Math.min(create_ts, micro_ts);
                    const {
                        REPORT_END = toUnix(min_ts), // default value is min_ts if
                        REPORT_START = toUnix(min_ts),
                        REPORT_TS = toUnix(min_ts),
                        RTP_START = min_ts,
                        RTP_STOP = min_ts,
                    } = item?.message || {};

                    item.dateTime = {
                        REPORT_END,
                        REPORT_START,
                        REPORT_TS,
                        RTP_START,
                        RTP_STOP,
                        create_ts,
                    };
                    if (RTP_START && RTP_STOP) {
                        item.dateTime.RTP_DELAY = RTP_STOP - RTP_START;
                    }
                } catch (err) {
                    console.error(err);
                }
                return item;
            };

            reports.forEach(
                (item: any) => (item = formattingItem(item, 'NetworkReport'))
            );

            if (!reports.find((r: any) => typeof r?.message?.ONE_WAY_RTP === 'number')) {
                const PERIODIC = "PERIODIC";
                const reports_RTP_DELAY = reports.filter((i: any) => i.dateTime.RTP_DELAY && i.message?.TYPE === PERIODIC);
                const RTP_MEAN_DELAY = reports_RTP_DELAY.map((i: any) => i.dateTime.RTP_DELAY)
                    .reduce((a: any, b: any) => a + b, 0) / reports_RTP_DELAY.length;

                reports_RTP_DELAY.forEach((i: any) => {
                    i.RTP_DELAY_DEVIATION = (i.dateTime.RTP_DELAY / RTP_MEAN_DELAY) ** (1 / 2)
                    i.UI_RTP_ONE_WAY_AUDIO = (i.RTP_DELAY_DEVIATION > 1.04 || i.RTP_DELAY_DEVIATION < 0.96) && i.message?.TYPE === PERIODIC
                    const finalItem = reports.find((r: any) => {
                        return i.UI_RTP_ONE_WAY_AUDIO && ((
                            r.destination_ip === i.destination_ip &&
                            r.source_ip === i.source_ip
                        ) || (
                                r.source_ip === i.destination_ip &&
                                r.destination_ip === i.source_ip

                            )) && r.message.TYPE === "FINAL";
                    })
                    if (finalItem) {
                        finalItem.ONE_WAY_AUDIO = true;
                    }
                })
            }

            uac?.forEach((item: any) => (item = formattingItem(item, 'UAReport')));
            return [...reports, ...uac];
        }
        return [];
    }
    public pipeDataDtmf(dtmfData: any) {
        const parseJson = (obj: any, srcData: string | Array<string>): any => {
            if (srcData instanceof Array) {
                srcData.forEach((i) => {
                    try {
                        obj[i] = JSON.parse(obj[i]);
                    } catch (err) { }
                });
            } else if (typeof srcData === 'string') {
                try {
                    obj[srcData] = JSON.parse(obj[srcData]);
                } catch (err) { }
            }
        };
        const parseDTMF = (src: string): any => {
            let itams: Array<any> = src.split(';').filter((i) => !!i);
            itams = itams.map((row) => {
                const out: any = row.split(',').reduce((a: any, i: any) => {
                    const [key, value] = i.split(':');
                    a[key] = value * 1;
                    return a;
                }, {});
                out.NUM =
                    [, , , , , , , , , , '*', '#', 'A', 'B', 'C', 'D'][out.e] ||
                    out.e + '';
                out.duration = out.d;
                out.create_ts = (out.ts * 1000000 + out.tsu) / 1000;
                return out;
            });
            return itams;
        };

        const { data } = dtmfData || {};
        if (data) {
            data.forEach((item: any) => {
                parseJson(item, ['message', 'data']);
                item.DTMF = parseDTMF(item.message.DTMF || '');
            });
        }
        return dtmfData;
    }
    public pipeDataLogs(logsData: any) {
        // heplog processor
        return logsData;
    }
    private sdpFormatterToFlowItem(sdp: Array<any>): Array<any> {
        if (!sdp || sdp.length === 0) {
            return [];
        }
        const out: any[] = Object.entries(sdp).map(([key, value]: any) => {
            return Object.entries(value).map(([k, v]: any) => {
                const outItem: any = v;
                outItem.callid = key;
                outItem.directionString = k;
                outItem.typeItem = FlowItemType.SDP;
                return outItem;
            });
        })
        const outSDP: any= [].concat(...out);
        return outSDP;
    }

    public parseJson(obj: any, srcData: string | Array<string>): any {
        if (srcData instanceof Array) {
            srcData.forEach((i) => {
                try {
                    obj[i] = JSON.parse(obj[i]);
                } catch (err) { }
            });
        } else if (typeof srcData === 'string') {
            try {
                obj[srcData] = JSON.parse(obj[srcData]);
            } catch (err) { }
        }
    }
    public parseDTMF(src: string): any {
        let itams: Array<any> = src.split(';').filter((i) => !!i);
        itams = itams.map((row) => {
            const out: any = row.split(',').reduce((a: any, i: any) => {
                const [key, value] = i.split(':');
                a[key] = value * 1;
                return a;
            }, {});
            out.NUM =
                [, , , , , , , , , , '*', '#', 'A', 'B', 'C', 'D'][out.e] || out.e + '';
            out.duration = out.d;
            out.create_ts = (out.ts * 1000000 + out.tsu) / 1000;
            return out;
        });
        return itams;
    }
    public setFlagOneWayAudio(data: any): any {
        const { messages = [] } = data || {};
        const mesRTP = messages.filter((i: any) => i.typeItem === 'RTP');
        data?.data?.transaction?.forEach((trans: any) => {
            const { source_ip, destination_ip, destination_port, source_port } =
                trans || {};

            const boolAB = !!mesRTP.find(
                (i: any) =>
                    i.source_ip == source_ip &&
                    i.source_port == source_port &&
                    i.destination_ip == destination_ip &&
                    i.destination_port == destination_port
            );

            const boolBA = !!mesRTP.find(
                (i: any) =>
                    i.source_ip == destination_ip &&
                    i.source_port == destination_port &&
                    i.destination_ip == source_ip &&
                    i.destination_port == source_port
            );

            trans.one_way_audio = (boolAB || boolBA) && boolAB !== boolBA;
        });
        return data;
    }
    public fullTransaction(data: any) {
        switch (data.type) {
            case 'full':
                break;
            case 'dtmf':
                data.tData.messages = this.extractDTMFitems(
                    data.dtmfData,
                    data.tData.messages
                );
                break;
            case 'logs':
                data.tData.messages = this.extractLOGitems(
                    data.logsData,
                    data.tData.messages
                );
                break;
            case 'qos':
                data.tData.messages = this.extractQOSitems(
                    data.qosData,
                    data.tData.messages
                );
                break;
        }
        data.tData.hosts = this.reCheckHost(data.tData);
        data.tData.messages = this.formattingAsFLOWItem(data.tData, false);
        return data.tData;
    }

    public reCheckHost({ messages = [], hosts = [], alias }: any) {
        const arrIPs = [].concat
            .apply(
                [],
                messages.map((i: any) => {
                    const source_ipisIPv6 = i?.source_ip?.match(/\:/g)?.length > 1;
                    const destination_ipisIPv6 =
                        i?.destination_ip?.match(/\:/g)?.length > 1;
                    const sIP = source_ipisIPv6 ? `[${i.source_ip}]` : i.source_ip;
                    const dIP = destination_ipisIPv6
                        ? `[${i.destination_ip}]`
                        : i.destination_ip;
                    return [
                        i.source_port ? `${sIP}:${i.source_port}` : sIP,
                        i.destination_port ? `${dIP}:${i.destination_port}` : dIP,
                    ];
                })
            )
            .sort()
            .filter((i, k, a) => a[k - 1] !== i);

        const getAliasByIp = ((ip: any) => this.getAliasByIp(ip, alias));

        arrIPs
            .filter((_ip: any) => !hosts.find((i: any) => i.host === _ip))
            .forEach((_ip: any) => {
                const isIPv4 = _ip.match(/^\d+\.\d+\.\d+\.\d+(\:\d+)?$/g) !== null;

                let PORT = isIPv4
                    ? _ip
                        ?.match(/\:\d+/g)
                        ?.find((j: any) => !!j)
                        ?.split(':')[1] * 1
                    : null;
                let IP = isIPv4
                    ? _ip?.match(/^\d+\.\d+\.\d+\.\d+/g)?.find((j: any) => !!j)
                    : _ip;
                if (!isIPv4) {
                    // do parsing IPv6
                    PORT = _ip.split(/\:/g).pop() * 1;
                    IP = _ip
                        .split(/\:\d+$/g)
                        .shift()
                        .replace(/\[|\]/g, '');
                }

                hosts.push({
                    alias: getAliasByIp(_ip),
                    host: isIPv4 ? _ip : `[${IP}]:${PORT}`,
                    ip: IP,
                    port: PORT || 0,
                    isIPv4,
                    position: hosts.length,
                });
            });
        hosts.forEach((h: any) => {
            if (!h.alias) {
                h.alias = getAliasByIp(h.host);
            }
        });

        return hosts;
    }
    private getAliasByIp(ip: any, alias: any) {
        const isIPv4 = ip.match(/^\d+\.\d+\.\d+\.\d+(\:\d+)?$/g) !== null;
        let PORT = isIPv4
            ? ip
                ?.match(/\:\d+/g)
                ?.find((j: any) => !!j)
                ?.split(':')[1] * 1
            : null;
        let IP = isIPv4 ? ip?.match(/^\d+\.\d+\.\d+\.\d+/g)?.find((j: any) => !!j) : ip;
        let IP_PORT = ip;
        if (!isIPv4) {
            PORT = ip.split(/\:/g).pop() * 1;
            IP = ip
                .split(/\:\d+$/g)
                .shift()
                .replace(/\[|\]/g, '');
            IP_PORT = `[${IP}]:${PORT}`;
        }
        return alias[IP_PORT] || alias[IP + ':0'] || IP;
    }

    public formattingAsFLOWItem(
        {
            messages = [],
            filters,
            hosts,
            alias,
            data,
            dateFormat = 'YYYY-MM-DD HH:mm:ss.SSS Z',
            timeZone = 'UTC',
        }: any,
        __type = false
    ) {
        moment.tz.setDefault(timeZone);
        const { transaction } = data || {};
        let prevTs = 0;
        let absoluteTs = 0;
        let diffTs = 0;
        let diffTs_absolute = 0;

        const getAliasByIp = (ip: any) => this.getAliasByIp(ip, alias);

        messages.forEach((i: any) => {
            i.milli_ts = i?.source_data?.milliTimeseconds || i.micro_ts * 1000;
        });
        let RTP_MEAN_DELAY;

        return messages
            .sort((itemA: any, itemB: any) => {
                const a = itemA.milli_ts;
                const b = itemB.milli_ts;
                return a < b ? -1 : a > b ? 1 : 0;
            })
            .map((item: any, pid: any, arr: any[]) => {
                const transactionByCallId =
                    transaction?.find((c: any) => c.callId === item.callId) || {};
                const [codecDataJSON] = transactionByCallId?.Codecs || [];
                const codecData = codecDataJSON ? JSON.parse(codecDataJSON) : null;
                const i = item.__is_flow_item__ ? item.source_data : item;
                const ts = parseInt(moment(i.micro_ts).format('x'), 10);
                const { SIP, SDP, RTP, RTCP, DTMF, LOG } = FlowItemType;
                let sdpInfo = '';
                if (item.typeItem === SDP) {
                    item.dstPort = item.dstPort || arr[pid - 1].dstPort;
                    item.srcPort = item.srcPort || arr[pid - 1].srcPort;
                    const sdpInfoArr = [];
                    if (item.mediaIpAudio) {
                        sdpInfoArr.push(`AUDIO: ${item.mediaIpAudio}:${item.mediaPortAudio}`);
                    }

                    if (item.mediaIpVideo) {
                        sdpInfoArr.push(`VIDEO: ${item.mediaIpVideo}:${item.mediaPortVideo}`);
                    }
                    sdpInfo = sdpInfoArr.join(', ');
                }

                if (prevTs === 0) {
                    prevTs = ts;
                    absoluteTs = ts;
                }
                diffTs = ts - prevTs;

                diffTs_absolute = ts - absoluteTs;
                if (item.__is_flow_item__) {
                    item.diff =
                        diffTs < 1000 ? `+${diffTs} ms` : `+${Functions.msToTime(diffTs)}`;
                    item.diff_absolute =
                        diffTs_absolute < 1000
                            ? `+${diffTs_absolute} ms`
                            : `+${Functions.msToTime(diffTs_absolute)}`;
                    (item.diff_num = diffTs), (prevTs = ts);
                    return item;
                }

                ((f) => {
                    f[SIP] = f[SIP] || i.typeItem === SIP;
                    f[SDP] = f[SDP] || i.typeItem === SDP;
                    f[RTP] = f[RTP] || i.typeItem === RTP;
                    f[RTCP] = f[RTCP] || i.typeItem === RTCP;
                    f[DTMF] = f[DTMF] || i.typeItem === DTMF;
                    f[LOG] = f[LOG] || i.typeItem === LOG;
                })(filters.payload);

                let sIP = i.source_ip || i.srcIp || i.sourceSipIP;
                let dIP = i.destination_ip || i.dstIp || i.destinationSipIP;
                const sPORT = i.source_port || i.srcPort || i.mediaPortAudio || 0;
                const dPORT = i.destination_port || i.dstPort || i.mediaPortAudio || 0;

                if (!(i.destination_port && i.dstPort && i.mediaPortAudio)) {
                    i.dstPort = dPORT;
                }

                if (!(i.source_port && i.srcPort && i.mediaPortAudio)) {
                    i.srcPort = sPORT;
                }

                const eventName = i.raw
                    ? i.method_text
                    : i.QOS
                        ? i.type
                        : i.typeItem === DTMF
                            ? DTMF + ` [${i.DTMFSingleData.NUM}]`
                            : i.typeItem === LOG
                                ? LOG
                                : 'SIP/SDP';

                const protoName = Functions.protoCheck(i.protocol).toUpperCase();
                if (i.raw) {
                    i.raw_source = '' + i.raw;
                }

                i.raw = this.stylingRowText(i.raw);
                const [sAlias, dAlias] = [
                    getAliasByIp(`${sIP}:${sPORT}`),
                    getAliasByIp(`${dIP}:${dPORT}`),
                ];
                i.srcAlias = sAlias || sIP;
                i.dstAlias = dAlias || dIP;

                const { pt, rate, name } = codecData || {};

                const isSDP = item.typeItem === SDP;
                const isRTP =
                    i.typeItem === RTP || i.typeItem === RTCP;
                i.codecData = codecData;
                // PCMU/8000/PT:0
                const codecString = `${name || '--'}/${!isNaN(rate) ? rate : '--'}/PT:${!isNaN(pt) ? pt : '--'
                    }`;
                const {
                    REPORT_END,
                    REPORT_START,
                    REPORT_TS,
                    RTP_START,
                    RTP_STOP,
                    create_ts,
                } = i?.QOS?.dateTime || {};
                const start_ts =
                    Math.min(REPORT_START * 1000) ||
                    Math.min(REPORT_END * 1000, REPORT_TS * 1000, RTP_START, RTP_STOP) ||
                    Math.min(create_ts, i.micro_ts);
                let method_text = i.sdp ? eventName + ` (SDP)` : eventName
                method_text = i.msg_info ? method_text + i.msg_info : method_text;


                const outDataItem: any = {
                    id: i.id,
                    codecData,
                    callid: i.callid,
                    start_ts,
                    method_text: method_text,
                    method: eventName,
                    /** unused, but can be need in future for FLOW items */
                    ipDirection: `[${i.id || '#' + (pid + 1)
                        }] [${protoName}] ${sIP}:${sPORT} --> ${dIP}:${dPORT}`,
                    description:
                        isSDP ? (sdpInfo) : (i.ruri_user ||
                            (isRTP && (pt || name || rate)
                                ? codecString
                                : `${sIP}:${sPORT} --> ${dIP}:${dPORT}`)
                        ),
                    info_date: `[${i.id || '#' + (pid + 1)}] [${protoName}] ${moment(
                        i.micro_ts
                    ).format(dateFormat)}`,
                    info_date_absolute: `[${i.id || '#' + (pid + 1)
                        }] [${protoName}] ${moment(i.micro_ts).utc().format(dateFormat)}`,
                    diff:
                        diffTs < 1000 ? `+${diffTs} ms` : `+${Functions.msToTime(diffTs)}`,
                    diff_absolute:
                        diffTs_absolute < 1000
                            ? `+${diffTs_absolute} ms`
                            : `+${Functions.msToTime(diffTs_absolute)}`,
                    diff_num: diffTs,
                    source_ip: sIP,
                    source_port: sPORT,
                    destination_ip: dIP,
                    destination_port: dPORT,
                    micro_ts: i.micro_ts,
                    source_data: i,
                    typeItem: i.typeItem,

                    QOS: i.QOS,
                    //   &&{
                    //   ...i.QOS,
                    //   ...{
                    //     isNAT_source_ip,
                    //     isNAT_destination_ip,
                    //   },
                    // },
                    MOS: i.MOS,
                    pid: pid,
                    srcAlias: i.srcAlias,
                    dstAlias: i.dstAlias,
                    __is_flow_item__: true,
                    messageData: {
                        codecData,
                        id: i.id || '--',
                        create_date: moment(i.micro_ts).format('YYYY-MM-DD'),
                        timeSeconds: moment(i.micro_ts).format('HH:mm:ss.SSS Z'),
                        diff:
                            diffTs < 1000
                                ? `+${diffTs} ms`
                                : `+${Functions.msToTime(diffTs)}`,
                        diff_absolute:
                            diffTs_absolute < 1000
                                ? `+${diffTs_absolute} ms`
                                : `+${Functions.msToTime(diffTs_absolute)}`,
                        diff_num: diffTs,
                        captid: i.captid,
                        method: eventName,
                        mcolor: Functions.getMethodColor(eventName),
                        Msg_Size: i.raw ? (i.raw + '').length : '--',
                        srcIp: sIP,
                        dstIp: dIP,
                        srcAlias: i.srcAlias,
                        dstAlias: i.dstAlias,
                        /* srcIp_srcPort: `${sIP}:${sPORT}`,
                        dstIp_dstPort: `${dIP}:${dPORT}`, */
                        srcAlias_srcPort: `${i.srcAlias}:${sPORT}`,
                        dstAlias_dstPort: `${i.dstAlias}:${dPORT}`,
                        dstPort: dPORT,
                        srcPort: sPORT,
                        proto: protoName,
                        type: i.typeItem,
                        typeDisplay: Functions.methodCheck(i.proto || i.hepproto),
                        tosDisplay:
                            typeof i.ip_tos !== 'undefined'
                                ? Functions.tosCheck(i.ip_tos)
                                : '--',
                        ip_tos: i.ip_tos,
                        vlan: i.vlan,
                        item: i,
                    },
                };
                if (i.typeItem === RTP && RTP_START && RTP_STOP) {
                    outDataItem.RTP_DELTA = RTP_STOP - RTP_START
                }
                return outDataItem;
            })
            .map((i: any) => {
                return i;
            })
            .map((i: any) => {
                i.__item__index__ = i.messageData.uniqueId = Functions.md5object(i);
                return i;
            });
    }
    stylingRowText(raw: string) {
        if (raw) {
            raw += '';
            const regexMethod = new RegExp(
                'INVITE|CANCEL|PRACK|ACK|BYE|OPTIONS',
                'g'
            );
            const regexReply = new RegExp(
                '(SIP/2.0) (100|180|200|404|407|500|503) ',
                'g'
            );
            const regexpCallid = new RegExp('(Call-ID):(.*)', 'g');
            const regexpSDP = new RegExp('(m=(audio|video)) (.*)', 'g');
            const regexpTag = new RegExp('tag=.*', 'g');
            const regexHeaders = new RegExp('(.*): ', 'g');
            let color: string;
            raw = raw
                .replace(/\</g, '&lt;')
                .replace(/\>/g, '&gt;')
                .replace(regexpCallid, (g, a, c) => {
                    color = 'blue';
                    return `<span style="font-weight:bold">${a}:</span><span style="color:${color}" data-type="callid">${c}</span>`;
                })
                .replace(regexpTag, (g, a) => {
                    color = 'red';
                    return `<span style="font-weight:bold;color:${color}" data-type="tag">${g}</span>`;
                })
                .replace(regexpSDP, (g, a) => {
                    color = 'red';
                    return `<span style="font-weight:bold;color:${color}" data-type="sdp">${g}</span>`;
                })
                .replace(regexMethod, (g) => {
                    color = 'blue';
                    switch (g) {
                        case 'INVITE':
                            color = 'hsl(227.5,82.4%,51%)';
                            break;
                        case 'CANCEL':
                            color = 'green';
                            break;
                        case 'BYE':
                            color = 'hsl(120,100%,25%)';
                            break;
                        case 'ACK':
                            color = 'orange';
                            break;
                    }

                    return `<span style="font-weight:bold;color:${color}" data-type="method">${g}</span>`;
                })
                .replace(regexReply, (g, a, c: any) => {
                    color = 'red';
                    const b = parseInt(c, 10);
                    switch (b) {
                        case 100:
                            color = 'orange';
                            break;
                        case 180:
                            color = 'blue';
                            break;
                        case 183:
                            color = 'blue';
                            break;
                        case 200:
                            color = 'green';
                            break;
                        default:
                            if (b >= 300 && b < 400) {
                                color = 'blue';
                            }
                            break;
                    }

                    return `<span style="font-weight:bold">${a}</span> <span style="font-weight:bold;color:${color}" data-type="reply">${c}</span> `;
                })
                .replace(regexHeaders, (g, a) => {
                    return `<span style="font-weight:bold">${g}</span> `;
                });
        }
        return raw;
    }
    public extractQOSitems(qosData: any, messages: Array<any>): Array<any> {
        if (!qosData || !Array.isArray(qosData)) {
            return messages;
        }
        const messagesLength = messages.length;

        const qos = qosData.map((item, key) => {
            let qosDetails: any;
            if (item.tabType && item.tabType === 'NetworkReport') {
                try {
                    qosDetails = item.message;
                    item.MOS = qosDetails.MOS || qosDetails.MEAN_MOS;
                    item.qosTYPE = qosDetails.TYPE;
                    item.qosTYPEless = qosDetails.TYPE.slice(0, 1).toUpperCase();
                } catch (_) {
                    console.error(item.message);
                    item.MOS = 0;
                }
            }

            return {
                QOS: item,
                typeItem: item.messageType,
                id: messagesLength + key + 1,
                type: item.messageType,
                source_ip: item.source_ip,
                source_port: item.source_port,
                destination_ip: item.destination_ip,
                destination_port: item.destination_port,
                callid: item.callid,
                method: item.type,
                method_ext: `${item.source_ip} --> ${item.destination_ip}`,
                micro_ts: item.create_ts,
            };
        });

        return [...messages, ...qos];
    }
    private extractDTMFitems(dtmfData: any, messages: Array<any>): Array<any> {
        if (!dtmfData) {
            return messages;
        }

        const messagesLength = messages.length;
        const inc = 0;
        const dtmf: Array<any> = [];
        dtmfData.forEach((item: any) => {
            if (item.DTMF && item.DTMF.length > 0) {
                item.DTMF.forEach((i: any) => {
                    const _item: any = Functions.cloneObject(item);
                    _item.create_ts = Math.round(i.create_ts);
                    dtmf.push({
                        DTMFSingleData: i,
                        DTMFitem: _item,
                        typeItem: FlowItemType.DTMF,
                        // id: messagesLength + (++inc) + 300,
                        type: FlowItemType.DTMF,
                        source_ip: _item.source_ip,
                        source_port: _item.source_port,
                        destination_ip: _item.destination_ip,
                        destination_port: _item.destination_port,
                        callid: _item.callid,
                        method: FlowItemType.DTMF,
                        method_ext: `${_item.source_ip} --> ${_item.destination_ip}`,
                        micro_ts: _item.create_ts,
                    });
                });
            }
        });

        return [...messages, ...dtmf];
    }
    private extractLOGitems(logsData: any, messages: Array<any>): Array<any> {
        if (!logsData) {
            return messages;
        }

        const messagesLength = messages.length;
        const logs = logsData.map((item: any, key: any) => {
            this.parseJson(item, ['data']);

            item.raw = item.raw || item.message;
            item.type = FlowItemType.LOG;
            return {
                item,
                typeItem: FlowItemType.LOG,
                id: messagesLength + key + 1,
                type: FlowItemType.LOG,
                source_ip: item.source_ip,
                source_port: item.source_port,
                destination_ip: item.destination_ip,
                destination_port: item.destination_port,
                callid: item.callid,
                method: item.type,
                method_ext: `${item.source_ip} --> ${item.destination_ip}`,
                micro_ts: item.create_ts,
            };
        });
        logsData.forEach((item: any) => { });

        return [...messages, ...logs];
    }
}
export class TransactionProcessor {
    public transactionData(data: any, type: any) {
        const p = new TransactionServiceProcessor();
        switch (type) {
            case WorkerCommands.TRANSACTION_SERVICE_TRNS:
                return p.pipeDataTransaction(data.transactionData);
            case WorkerCommands.TRANSACTION_SERVICE_QOS:
                return p.pipeDataQos(data);
            case WorkerCommands.TRANSACTION_SERVICE_DTMF:
                return p.pipeDataDtmf(data);
            case WorkerCommands.TRANSACTION_SERVICE_FULL:
                return p.fullTransaction(data);
            case WorkerCommands.TRANSACTION_SERVICE_ONE_WAY_AUDIO:
                return p.setFlagOneWayAudio(data);
        }
    }
}
