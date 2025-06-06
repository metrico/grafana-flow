// import moment from 'moment';
// import { Md5 } from 'ts-md5/dist/md5';
// import { isInSubnet } from 'is-in-subnet';
// import { ColorHash } from './colorHash';

// export const md5Hash = function (s: string) {
//     // const md5 = new Sha256()
//     // md5.update(s);
//     const md5Hash = md5(s)
//     let hex = ''
//     for (let i = 0; i < md5Hash.length; i++) {
//         hex += md5Hash.charCodeAt(i).toString(16);
//     }

//     return parseInt(hex, 16)
// }
// export class ColorHash {

//     L: number[];
//     S: number[];
//     hueRanges: { max: number, min: number }[]
//     hash: (str: string) => number;

//     constructor(options: {
//         lightness?: number | number[],
//         saturation?: number | number[],
//         hue?: number | { max: number, min: number } | { max: number, min: number }[],
//         hash?: string | ((str: string) => number);
//     } = {}) {
//         const [L, S] = [options.lightness, options.saturation].map(function (param) {
//             param = param !== undefined ? param : [0.35, 0.5, 0.65]; // note that 3 is a prime
//             return Array.isArray(param) ? param.concat() : [param];
//         });

//         this.L = L;
//         this.S = S;

//         if (typeof options.hue === 'number') {
//             options.hue = { min: options.hue, max: options.hue };
//         }
//         if (typeof options.hue === 'object' && !Array.isArray(options.hue)) {
//             options.hue = [options.hue];
//         }
//         if (typeof options.hue === 'undefined') {
//             options.hue = [];
//         }
//         this.hueRanges = options.hue.map(function (range) {
//             return {
//                 min: typeof range.min === 'undefined' ? 0 : range.min,
//                 max: typeof range.max === 'undefined' ? 360 : range.max
//             };
//         });

//         // this.hash = Sha256ToInt; // Default hash function
//         // this.hash = loseLoseHash;
//         this.hash = md5Hash

//         if (typeof options.hash === 'function') {
//             this.hash = options.hash;
//         }
//     }

//     /**
//      * Returns the hash in [h, s, l].
//      * Note that H ∈ [0, 360); S ∈ [0, 1]; L ∈ [0, 1];
//      *
//      * @param {String} str string to hash
//      * @returns {Array} [h, s, l]
//      */
//     hsl(str: string): [number, number, number] {
//         var H, S, L;
//         var hash = this.hash(str);
//         var hueResolution = 727; // note that 727 is a prime

//         if (this.hueRanges.length) {
//             const range = this.hueRanges[hash % this.hueRanges.length];
//             H = ((hash / this.hueRanges.length) % hueResolution) * (range.max - range.min) / hueResolution + range.min;
//         } else {
//             H = hash % 359; // note that 359 is a prime
//         }
//         hash = Math.ceil(hash / 360);
//         S = this.S[hash % this.S.length];
//         hash = Math.ceil(hash / this.S.length);
//         L = this.L[hash % this.L.length];

//         return [H, S, L];
//     }


//     /**
//      * Returns the hash in [r, g, b].
//      * Note that R, G, B ∈ [0, 255]
//      *
//      * @param {String} str string to hash
//      * @returns {Array} [r, g, b]
//      */
//     rgb(str: string) {
//         var hsl = this.hsl(str);
//         return HSL2RGB.apply(this, hsl);
//     }

//     /**
//      * Returns the hash in hex
//      *
//      * @param {String} str string to hash
//      * @returns {String} hex with #
//      */
//     hex(str: string) {
//         var rgb = this.rgb(str);
//         return RGB2HEX(rgb);
//     }

// }

/**
 * Convert RGB Array to HEX
 *
 * @param {Array} RGBArray - [R, G, B]
 * @returns {String} 6 digits hex starting with #
 */
// const RGB2HEX = function (RGBArray: number[]) {
//     let hex = '#';
//     RGBArray.forEach(function (value) {
//         if (value < 16) {
//             hex += 0;
//         }
//         hex += value.toString(16);
//     });
//     return hex;
// };

/**
 * Convert HSL to RGB
 *
 * @param {Number} H Hue ∈ [0, 360)
 * @param {Number} S Saturation ∈ [0, 1]
 * @param {Number} L Lightness ∈ [0, 1]
 * @returns {Array} R, G, B ∈ [0, 255]
 */
// const HSL2RGB = function (H: number, S: number, L: number) {
//     H /= 360;

//     let q = L < 0.5 ? L * (1 + S) : L + S - L * S;
//     let p = 2 * L - q;

//     return [H + 1 / 3, H, H - 1 / 3].map(function (color) {
//         if (color < 0) {
//             color++;
//         }
//         if (color > 1) {
//             color--;
//         }
//         if (color < 1 / 6) {
//             color = p + (q - p) * 6 * color;
//         } else if (color < 0.5) {
//             color = q;
//         } else if (color < 2 / 3) {
//             color = p + (q - p) * 6 * (2 / 3 - color);
//         } else {
//             color = p;
//         }
//         return Math.round(color * 255);
//     });
// };
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
export function getAMF(field: any): string {
    if (['server_type_in', 'server_type_out'].includes(field)) {
        return 'servertype';
    } else if (['ipgroup_in', 'ipgroup_out'].includes(field)) {
        return 'group';
    } else if (['source_ip', 'destination_ip', 'IPs'].includes(field)) {
        return 'alias';
    }
    return '';
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
export function log(...arg: any) {
    /** DEBUG PERFORMANCE */
    arg.forEach((_a: any, i: number) => {
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

export function cloneObject(src: any): any {
    try {
        return JSON.parse(JSON.stringify(src));
    } catch (err) { }

    return src;
}
// export function md5(str: string): string {
//     str = str || '';
//     return Md5.hashAsciiStr(str) + '';
// }
// export function md5object(obj: any): string {
//     try {
//         return md5(JSON.stringify(obj) || '');
//     } catch (err) {
//         return md5('');
//     }
// }
export function HslToHex(h: number, s: any, l: any) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, '0'); // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}
// export function getColorByStringHEX(str: string) {
//     if (str === 'LOG') {
//         return 'FFA562';
//     }
//     let hash = 0;
//     let i = 0;
//     str = md5(str);
//     for (i = 0; i < str.length; i++) {
//         hash = str.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     i = hash;
//     let col =
//         ((i >> 24) & 0xaf).toString(16) +
//         ((i >> 16) & 0xaf).toString(16) +
//         ((i >> 8) & 0xaf).toString(16) +
//         (i & 0xaf).toString(16);
//     if (col.length < 6) {
//         col = col.substring(0, 3) + '' + col.substring(0, 3);
//     }
//     if (col.length > 6) {
//         col = col.substring(0, 6);
//     }
//     return col;
// }
// export function getColorByString(
//     str: string,
//     saturation?: number,
//     lightness?: number,
//     alpha?: number,
//     offset?: number
// ) {
//     const col = getColorByStringHEX(str);

//     const result: any = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(col);

//     let r = parseInt(result[1], 16);
//     let g = parseInt(result[2], 16);
//     let b = parseInt(result[3], 16);
//     (r /= 255), (g /= 255), (b /= 255);
//     const max = Math.max(r, g, b),
//         min = Math.min(r, g, b);
//     let h: any,
//         s: any,
//         l: number = (max + min) / 2;
//     if (max === min) {
//         h = s = 0; // achromatic
//     } else {
//         const d = max - min;
//         s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
//         switch (max) {
//             case r:
//                 h = (g - b) / d + (g < b ? 6 : 0);
//                 break;
//             case g:
//                 h = (b - r) / d + 2;
//                 break;
//             case b:
//                 h = (r - g) / d + 4;
//                 break;
//         }
//         h /= 6;
//     }
//     h = Math.round(h * 360);
//     saturation = saturation || Math.round(s * 100);
//     lightness = lightness || Math.round(l * 100);
//     alpha = alpha || 1;
//     offset = offset || 0;
//     return `hsl(${h - offset}, ${saturation}%, ${lightness}%,${alpha})`;
// }
export function getColorByStringFromArray(str = '', arr: any[]) {
    // str = str.substring(0, 16)
    if (str.length === 0) {
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
// export const configuredColorHash = new ColorHash({
//     hue: (() => {
//         const arr: { max: number; min: number; }[] = []
//         const hueOffset = 12;
//         for (let index = 0; index < 360 / hueOffset; index++) {
//             arr.push({ min: index * hueOffset, max: index * hueOffset })
//         }
//         return arr
//     })(),
//     saturation: [0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7],
//     lightness: [0.7, 0.75, 0.8]
// })
// export function getColorHashHSL(input: string) {
//     return configuredColorHash.hsl(input);
// }
export function getFormattedColorFromColorHashOutput(output: [number, number, number], callid: string) {
    const hue = output[0];
    const saturation = Math.round(output[1] * 100);
    const lightness = Math.round(output[2] * 100);
    return {
        callID: callid,
        backgroundColor: `hsla(${hue}, ${saturation}%, ${lightness}%, ${0.8})`,
        decompiledColor: {
            hue: hue,
            saturation: saturation,
            lightness: lightness,
            alpha: 0.8
        },
        textColor: `hsla(${hue + 180 || 180}, 100%, 15%, 1)`,
    };
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
export function getColorByStatus(status: number) {
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
    const regex = /\s*\(.*/g;
    str = (str + '').replace(regex, '');
    if (str === 'INVITE' || str === 're-INVITE') {
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
export function colorsByStatus(status: number, proto: any = '') {
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

// export function msToTime(ms: any) {
//     var milliseconds = ms % 1000 >> 0,
//         seconds = Math.floor((ms / 1000) % 60),
//         minutes = Math.floor((ms / (1000 * 60)) % 60),
//         hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
//     let milrest = (milliseconds / 10) >> 0 || '';
//     milrest = +milrest < 10 ? '0' + milrest : milrest;
//     let secrest = (seconds / 0.6) >> 0 || '';
//     secrest = +secrest < 10 && minutes > 0 ? '0' + secrest : secrest;
//     let minrest = (minutes / 0.6) >> 0 || '';
//     minrest = +minrest < 10 && hours > 0 ? '0' + minrest : minrest;
//     let secs = seconds + (+milrest > 0 ? '.' + milrest : '');
//     let mins = minutes + (+secrest > 0 ? '.' + secrest : '');
//     let hrs = hours + (+minrest > 0 ? '.' + minrest : '');

//     if (hours > 0) {
//         return hrs + ' h';
//     } else if (minutes > 0) {
//         return mins + ' min';
//     } else {
//         return secs + ' s';
//     }
// }
// export function idColorHash(str: string) {
//     var hash = 0;
//     for (var i = 0; i < str.length; i++) {
//         hash = str.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     var colour = '#';
//     for (var i = 0; i < 3; i++) {
//         var value = (hash >> (i * 8)) & 0xff;
//         colour += ('00' + value.toString(16)).substr(-2);
//     }
//     return colour;
// }
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
                a = a.replace(/\s/g, '');
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
                g = g.replace(/\s/g, '');
                return `<span style="font-weight:bold">${g}</span> `;
            });
    }
    return raw;
}

export function detectNAT(strIP: string) {
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
export function arrayUniques(ar: any): any {
    const arr = ar as any;
    const isObject = !!arr.find((i: any) => typeof i === 'object');
    if (isObject) {
        return arr
            .map((i: any) => JSON.stringify(i))
            .sort()
            .filter((i: any, k: number, a: any) => i !== a[k - 1])
            .filter((i: any) => !!i)
            .map((i: any) => JSON_parse(i));
    }

    return arr
        .sort()
        .filter((i: any, k: number, a: any) => i !== a[k - 1])
        .filter((i: any) => !!i);
}
export function shortId() {
    function chr4() {
        return Math.random().toString(16).slice(-4);
    }
    return chr4() + chr4() + '-' + chr4() + '-' + chr4() + chr4();
}
// export function validateTime(startTime: any, endTime: any) {
//     startTime = moment(startTime).format('x');
//     endTime = moment(endTime).format('x');
//     if (startTime >= endTime) {
//         return true;
//     }
//     return false;
// }
export function secondsToHour(data: any = 0) {
    return new Date(data * 1000).toISOString().substr(11, 8);
}

export function isMask(field: any) {
    return field?.mask < 32;
}
export function addMask(field: any) {
    return field?.mask && field?.mask < 32 ? '/' + field.mask : '';
}
export function getAliasFields(aliasList: any[], field_name: any = null): Object {
    const fields: any = {};
    if (field_name) {
        fields[field_name] = aliasList.map((m) => ({
            name: m[getAMF(field_name)],
            value: isAMIP(field_name)
                ? m['ip'] + addMask(m)
                : m[getAMF(field_name)], //m[this.isAMIP(f) ? 'ip' : this.getAMF(f)]
            ipnet: isMask(m),
        }));
        return fields[field_name];
    } else {
        amfList.forEach((f) => {
            fields[f] = aliasList.map((m) => ({
                name: m[getAMF(f)],
                value: isAMIP(f)
                    ? m['ip'] + addMask(m)
                    : m[getAMF(f)], //m[this.isAMIP(f) ? 'ip' : this.getAMF(f)]
                ipnet: isMask(m),
            }));
        });
    }
    return fields;
}
// export function isIpInSubnet(ip: string, ipWithSubnet: string) {
//     return isInSubnet(ip, ipWithSubnet);
// }
export function isSameHost(host1: string, host2: string): boolean {
    try {
        const host1Obj = new URL(host1);
        const host2Obj = new URL(host2);
        return host1Obj.origin === host2Obj.origin;
    } catch (e) {
        return false;
    }
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



export function messageFormatter(dist: any[]) {
    return dist;
}
export function isValidJSON(input: any): boolean {
    if (!input) {
        return false;
    }
    let isValid = true;
    try {
        JSON.parse(input)
    } catch (e) {
        isValid = false;
    }
    return isValid
}
