export interface ParsedLabel {
    title: string
    labels: string[]
    separator?: string
    tooltip: string
    parser?: (input: string) => string
    isJSON?: boolean
    UUID: string
}
type DataScheme = ParsedLabel[]
export const dataScheme: DataScheme = [{
    title: "Call ID",
    tooltip: "Data extracted from the `callid` label",
    labels: ["callid"],
    UUID: "1b2bfa59-4444-4444-b7ce-6116bab380ad",
}, {
    title: "Destination",
    tooltip: "Data extracted from the `dst_ip` and `dst_port` labels",
    labels: ["labels.dst_ip", "labels.dst_port"],
    separator: ":",
    UUID: "1b2bfa59-4444-4444-b7ce-6116bab380ae",
}, {
    title: "Source",
    tooltip: "Data extracted from the `src_ip` and `src_port` labels",
    labels: ["labels.src_ip", "labels.src_port"],
    separator: ":",
    UUID: "1b2bfa59-4444-4444-b7ce-6116bab380af",
}, {
    title: "Method",
    tooltip: "Data extracted from the `response` label",
    labels: ["labels.response"],
    UUID: "1b2bfa59-4444-4444-b7ce-6116bab380b0",
}, {
    title: "CSeq",
    tooltip: "Data extracted from the `response` label",
    labels: ["labels.method"],
    UUID: "1b2bfa59-4444-4444-b7ce-6116bab380b1",
}, {
    title: "Payload Type",
    tooltip: "Data extracted from the `type` label",
    labels: ["labels.type"],
    parser: (input: string) => input.toUpperCase(),
    UUID: "1b2bfa59-4444-4444-b7ce-6116bab380b2",
}, {
    title: "Message",
    tooltip: "Data extracted from the `Line` field",
    labels: ["Line"],
    UUID: "1b2bfa59-4444-4444-b7ce-6116bab380b3",
}, {
    title: "Sender Information",
    tooltip: "Data extracted from the `sender_information` field",
    labels: ["Line.sender_information"],
    isJSON: true,
    UUID: "1b2bfa59-4444-4444-b7ce-6116bab380b4",
}, {
    title: "Report Blocks",
    tooltip: "Data extracted from the `report_blocks` field",
    labels: ["Line.report_blocks"],
    isJSON: true,
    UUID: "1b2bfa59-4444-4444-b7ce-6116bab380b5",
},
]

