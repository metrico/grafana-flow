import { isInSubnet } from 'is-in-subnet';
import * as moment from 'moment';


export const _colorBufer = {};
let logTime = 0;
// Alias Mapping Field List
export const amfList = [
    'server_type_in',
    'server_type_out',
    'ipgroup_in',
    'ipgroup_out',
    'source_ip',
    'destination_ip',
    'IPs',
];
//  alias mapping function to map fields into alias fields
//   (multi select field on protosearch usage)
//   AMF = Alias Mapping Field
export function isAMF(field: string): boolean {
    return amfList.includes(field);
}
// set Type of Alias Mapping field:
// servertype | group | alias => IP
export function getAMF(field: string): string | null {
    if (['server_type_in', 'server_type_out'].includes(field)) {
        return 'servertype';
    } else if (['ipgroup_in', 'ipgroup_out'].includes(field)) {
        return 'group';
    } else if (['source_ip', 'destination_ip', 'IPs'].includes(field)) {
        return 'alias';
    }
    return null;
}
// Alias Mapping IP
export function isAMIP(field: string): boolean {
    return ['source_ip', 'destination_ip', 'IPs'].includes(field);
}
export function isExternalUrl(url: string): boolean {
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    if (urlRegex.test(url)) {
        return true
    } else {
        return false
    }
}
export function log(...arg: any[]) {
    /** DEBUG PERFORMANCE */
    arg.forEach((_a, i) => {
        if (typeof _a === 'object') {
            arg[i] = cloneObject(_a);
        }
    });
    const dt = logTime ? performance.now() - logTime : 0;
    const dts = '[' + dt.toFixed(3) + 'ms]';
    console.warn.apply(null, [dts, ...arg]);
    logTime = performance.now();
}

export function newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r: any = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
export function hash(str: string, lenHash: number = 32) {
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
export function cloneObject(src: any): any {
    try {
        return JSON.parse(JSON.stringify(src));
    } catch (err) { }

    return src;
}
export function md5(str: string): string {
    str = str || '';
    return hash(str) + '';
}
export function md5object(obj: any): string {
    try {
        return md5(JSON.stringify(obj) || '');
    } catch (err) {
        return md5('');
    }
}
export function HslToHex(h: any, s: any, l: any) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: any) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, '0'); // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}
export function getColorByStringHEX(str: string) {
    if (str === 'LOG') {
        return 'FFA562';
    }
    let hash = 0;
    let i = 0;
    str = md5(str);
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
export function getColorByString(
    str: string,
    saturation?: number,
    lightness?: number,
    alpha?: number,
    offset?: number
) {
    const col = getColorByStringHEX(str);

    const result: any = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(col);

    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);
    (r /= 255), (g /= 255), (b /= 255);
    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h: any,
        s: any,
        l = (max + min) / 2;
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
export function getColorByStringFromArray(str: string, arr: any[]) {
    // str = str.substring(0, 16)
    if (str.length == 0) {
        return arr[1];
    }
    let hash = 0,
        c = typeof str === 'string' ? str.length : 0,
        i = 0;

    while (i < c) {
        hash = ((hash << 5) - hash + str.charCodeAt(i++)) >>> 0;
    } // Added >>> 0

    hash =
        hash < 0
            ? hash * -1 + 0xffffffff
            : hash; /* convert to unsigned int */
    return arr[hash % arr.length];
}
export function MOSColorGradient(num: number, s?: any, l?: any): string {
    // https://www.w3schools.com/colors/colors_hsl.asp
    // adjusts value of mos have steeper gradient
    const modifier =
        num > 430
            ? 1
            : num > 400
                ? 0.8
                : num > 300
                    ? 0.75
                    : num < 200
                        ? 0.3
                        : 0.7;
    // converts mos with modifier to percentage and uses it as raw number for hue
    const hue = (num * modifier) / (450 / 100);
    return `hsl(${hue}, ${s ? s + '%' : '85%'}, ${l ? l + '%' : '55%'})`;
}
export function getColorByStatus(status: any) {
    let color = '#000';
    if (status === 1) {
        color = '#ea4b35';
    } else if (status === 2) {
        color = 'rgb(255, 51, 50)';
    } else if (status === 3) {
        color = 'rgb(184, 242, 255)';
    } else if (status === 4) {
        color = 'rgb(184, 242, 255)';
    } else if (status === 5) {
        color = '#44c51a';
    } else if (status === 6) {
        color = 'grey';
    } else if (status === 7) {
        color = '#FFF6BA';
    } else if (status === 8) {
        color = 'rgb(244, 30, 199)';
    } else if (status === 9) {
        color = 'rgb(244, 30, 199)';
    } else if (status === 10) {
        color = '#7bd062';
    } else if (status === 11) {
        color = 'rgb(255, 246, 186)';
    } else if (status === 12) {
        color = 'rgb(255, 127, 126)';
    } else if (status === 13) {
        color = 'rgb(255, 127, 126)';
    } else if (status === 14) {
        color = '#F41EC7';
    } else if (status === 15) {
        color = 'grey';
    }
    return color;
}
export function getMethodColor(str: any) {
    let color = 'hsl(0,0%,0%)';
    const regex = /\s*\(SDP\)\s*/;
    str = (str + '').replace(regex, '');
    if (str === 'INVITE') {
        color = 'hsla(227.5, 82.4%, 51%, 1)';
    } else if (str === 'BYE' || str === 'CANCEL') {
        color = 'hsla(120, 100%, 25%, 1)';
    } else if (str >= 100 && str < 200) {
        color = 'hsla(0, 0%, 0%, 1)';
    } else if (str >= 200 && str < 300) {
        color = 'hsla(120, 70%, 50%, 1)';
    } else if (str >= 300 && str < 400) {
        color = 'hsla(280, 100%, 50%, 1)';
    } else if (str >= 400 && str < 500) {
        color = 'hsla(15, 100%, 45%, 1)';
    } else if (str >= 500 && str < 700) {
        color = 'hsla(0, 100%, 45%, 1)';
    } else {
        color = 'hsla(0, 0%, 0%, 1)';
    }
    return color;
}
export function colorByMos(mos: number) {
    let color = '';
    if (mos < 200) {
        color = 'red';
    } else if (mos < 300) {
        color = 'orange';
    } else if (mos < 400) {
        color = '#e9d600';
    } else {
        color = 'green';
    }
    return color;
}
export function colorByMethod(method: string, payload: number) {
    return method
        ? {
            INVITE: '#00cc00',
            BYE: '#6600cc',
            CANCEL: 'red',
            '180': '#0099cc',
            '183': '#0099cc',
            '200': '#0000cc',
            '401': '#cc0033',
            '407': '#cc0033',
            '404': '#cc0033',
            '486': '#cc6600',
        }[method] || 'black'
        : {
            '5': 'blue',
            '8': 'blue',
            '38': 'blue',
            '39': 'green',
            '34': 'green',
            '35': 'blue',
            '100': 'red',
        }[payload] || 'red';
}
export function colorsByStatus(status: number, proto: string = '') {
    switch (proto) {
        case '60_call_h20':
        default:
            return (
                [
                    'white',
                    '#CC1900',
                    '#FF3332',
                    '#B8F2FF',
                    '#B8F2FF',
                    '#44c51a',
                    '#D7CAFA',
                    '#FFF6BA',
                    '#F41EC7',
                    '#F41EC7',
                    '#4bb42b',
                    '#FFF6BA',
                    '#FF7F7E',
                    '#FF7F7E',
                    '#F41EC7',
                    '#F41EC7',
                ][status] || '#FFF6BA'
            );
        case '60_registration_h20':
            return (
                [
                    '#b5b5b5',
                    '#dd5555',
                    '#ff4444',
                    '#2299bb',
                    '#aa55dd',
                    '#dd33dd',
                    '#aaaaee',
                    '#eecb1b',
                    '#ff8811',
                    '#eeaa66',
                ][status] || '#FFF6BA'
            );
    }
}

export function msToTime(ms: number): string {
    if (ms < 0) {
        throw new RangeError('ms must be a positive integer');
    }
    const milliseconds = ms % 1000;
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const milrest = milliseconds / 10 >> 0 || 0;
    const secrest = seconds / 0.6 >> 0 || 0;
    const minrest = minutes / 0.6 >> 0 || 0;
    const secs = seconds + (milrest > 0 ? '.' + (milrest < 10 ? '0' + milrest : milrest) : '');
    const mins = minutes + (secrest > 0 ? '.' + (secrest < 10 ? '0' + secrest : secrest) : '');
    const hrs = hours + (minrest > 0 ? '.' + (minrest < 10 ? '0' + minrest : minrest) : '');


    if (hours > 0) {
        return `${hrs} h`;
    } else if (minutes > 0) {
        return `${mins} min`;
    } else {
        return `${secs} s`;
    }
}

export function idColorHash(str: string) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xff;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}
export function stylingRowText(raw: string) {
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
                return `<span style="font-weight:bold">${a}:</span><span style="color:${color}">${c}</span>`;
            })
            .replace(regexpTag, (g, a) => {
                color = 'red';
                return `<span style="font-weight:bold;color:${color}">${g}</span>`;
            })
            .replace(regexpSDP, (g, a) => {
                color = 'red';
                return `<span style="font-weight:bold;color:${color}">${g}</span>`;
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

                return `<span style="font-weight:bold;color:${color}">${g}</span>`;
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

                return `<span style="font-weight:bold">${a}</span> <span style="font-weight:bold;color:${color}">${c}</span> `;
            })
            .replace(regexHeaders, (g, a) => {
                return `<span style="font-weight:bold">${g}</span> `;
            });
    }
    return raw;
}

export function detectNAT(strIP: any) {
    /**
     * NAT IPs - 10.x.x.x, 192.168.x.x, 172.16.0.0 - 172.31.255.255
     */
    return strIP.match(
        /(^192\.168\.\d+\.\d+(\:\d+)?$)|(^10\.\d+\.\d+\.\d+(\:\d+)?$)|(^172\.(1[6-9]|2[0-9]|3[0-2])+\.\d+\.\d+(\:\d+)?$)/g
    );
}
export function protoCheck(protocol: number) {
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
export function arrayUniques(arr: any[]): any[] {
    const isObject = !!arr.find((i) => typeof i === 'object');
    if (isObject) {
        return arr
            .map((i) => JSON.stringify(i))
            .sort()
            .filter((i, k, a) => i !== a[k - 1])
            .filter((i) => !!i)
            .map((i) => JSON_parse(i));
    }

    return arr
        .sort()
        .filter((i, k, a) => i !== a[k - 1])
        .filter((i) => !!i);
}
export function shortId() {
    function chr4() {
        return Math.random().toString(16).slice(-4);
    }
    return chr4() + chr4() + '-' + chr4() + '-' + chr4() + chr4();
}
export function validateTime(startTime: any, endTime: any) {
    startTime = moment(startTime).format('x');
    endTime = moment(endTime).format('x');
    if (startTime >= endTime) {
        return true;
    }
    return false;
}
export function secondsToHour(data: number = 0) {
    return new Date(data * 1000).toISOString().substr(11, 8);
}

export function isMask(field: any) {
    return field?.mask < 32;
}
export function addMask(field: any) {
    return field?.mask && field?.mask < 32 ? '/' + field.mask : '';
}
export function getAliasFields(aliasList: Array<any>, field_name: string | null = null): Object {
    const fields: any = {};
    if (field_name) {
        fields[field_name] = aliasList.map((m) => ({
            name: m[getAMF(field_name) || ''],
            value: isAMIP(field_name)
                ? m['ip'] + addMask(m)
                : m[getAMF(field_name) || ''], //m[this.isAMIP(f) ? 'ip' : this.getAMF(f)]
            ipnet: isMask(m),
        }));
        return fields[field_name];
    } else {
        amfList.forEach((f) => {
            fields[f] = aliasList.map((m) => ({
                name: m[getAMF(f) || ''],
                value: isAMIP(f)
                    ? m['ip'] + addMask(m)
                    : m[getAMF(f) || ''], //m[this.isAMIP(f) ? 'ip' : this.getAMF(f)]
                ipnet: isMask(m),
            }));
        });
    }
    return fields;
}
export function isIpInSubnet(ip: string, ipWithSubnet: string) {
    return isInSubnet(ip, ipWithSubnet);
}
export function JSON_parse(jsonString: string): any {
    try {
        if (typeof JSON.parse(jsonString) === 'object') {
            return JSON.parse(jsonString);
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
}
export function setStorage(key: string, value: any): void {
    // saving JSON from object data
    // log('setStorage >>>', key, value);
    return localStorage.setItem(key, JSON.stringify(value));
}
export function getStorage(key: string): any {
    // log('getStorage <<<', key, Functions.JSON_parse(localStorage.getItem(key)));
    const lData = localStorage.getItem(key);
    if (!lData) {
        return null;
    }
    return JSON_parse(lData);
}
export function methodCheck(payload: number) {
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



export function messageFormatter(dist: Array<any>) {
    return dist;
}

export const convertDateToFileName = (date: Date) => {

    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}_${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
