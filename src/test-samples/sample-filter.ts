import { Filters } from "components/FilterPanel/FilterPanel"

const callidArray: Array<[string, boolean]> = [
    [
        "un1sub@127.0.0.1",
        true
    ],
    [
        "45fesl@127.0.0.1",
        true
    ],
    [
        "45fesl@127.0.0.1_b2b-1",
        true
    ],
    [
        "1cfb8q@127.0.0.1",
        true
    ],
    [
        "icp2q4@127.0.0.1_b2b-1",
        true
    ],
    [
        "icp2q4@127.0.0.1",
        true
    ],
    [
        "1cfb8q@127.0.0.1_b2b-1",
        true
    ],
    [
        "un1sub@127.0.0.1_b2b-1",
        true
    ]
]
const ipArray: Array<[string, boolean]> = [
    [
        "83.96.144.81",
        true
    ],
    [
        "142.232.9.64",
        true
    ],
    [
        "69.115.139.150",
        true
    ],
    [
        "104.142.49.134",
        true
    ],
    [
        "170.41.184.182",
        true
    ],
    [
        "244.176.88.63",
        true
    ],
    [
        "131.116.197.116",
        true
    ],
    [
        "203.165.68.183",
        true
    ],
    [
        "192.150.143.41",
        true
    ],
    [
        "197.169.225.80",
        true
    ],
    [
        "153.118.14.45",
        true
    ],
    [
        "18.58.29.53",
        true
    ],
    [
        "127.0.0.1",
        true
    ]
]

const methodArray: Array<[string, boolean]> = [
    [
        "407",
        true
    ],
    [
        "100",
        true
    ],
    [
        "INVITE",
        true
    ],
    [
        "200",
        true
    ],
    [
        "BYE",
        true
    ],
    [
        "ACK",
        true
    ],
    [
        "101",
        true
    ]
]
export const sampleFilter: Filters = {
    "ip": {
        "label": "ip",
        "tooltip": "Filter by \"dst_ip or src_ip\"",
        "values": new Map(ipArray),
        "title": "IP"
    },
    "method": {
        "label": "method",
        "tooltip": "Filter by \"response\"",
        "values": new Map(methodArray),
        "title": "Method"
    },
    "type": {
        "label": "type",
        "tooltip": "Filter by \"type\"",
        "values": new Map(['sip', 'rtcp', 'log'].map(x => [x, true])),
        "title": "Payload Type"
    },
    "callid": {
        "label": "callid",
        "tooltip": "Filter by \"callid\"",
        "values": new Map(callidArray),
        "title": "Callid"
    }
}
export const sampleFilterWithoutRTCP: Filters = {
    "ip": {
        "label": "ip",
        "tooltip": "Filter by \"dst_ip or src_ip\"",
        "values": new Map(ipArray),
        "title": "IP"
    },
    "method": {
        "label": "method",
        "tooltip": "Filter by \"response\"",
        "values": new Map(methodArray),
        "title": "Method"
    },
    "type": {
        "label": "type",
        "tooltip": "Filter by \"type\"",
        "values": new Map(['sip', 'rtcp', 'log'].map(x => [x, x !== 'rtcp'])),
        "title": "Payload Type"
    },
    "callid": {
        "label": "callid",
        "tooltip": "Filter by \"callid\"",
        "values": new Map(callidArray),
        "title": "Callid"
    }
}
