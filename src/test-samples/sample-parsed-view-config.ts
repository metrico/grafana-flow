import { ParsedLabel, dataScheme } from "components/FlowModal/ParsedView/DataScheme";

export const sampleParsedViewConfig = dataScheme;

export const sampleParsedViewConfig2: ParsedLabel[] = [{
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
    title: "Method and CSeq method",
    tooltip: "Data extracted from the `response` label",
    labels: ["labels.response", "labels.method"],
    separator: "|",
    UUID: "1b2bfa59-4444-4444-b7ce-6116bab380b0",
}, {
    title: "Payload Type",
    tooltip: "Data extracted from the `type` label",
    labels: ["labels.type"],
    parser: 'Uppercase',
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
}
]

export const sampleBrokenParsedViewConfig = []
export const sampleBrokenParsedViewConfig2 = [
    {
        title: 3,
        tooltip: "Data extracted from the `callid` label",
        labels: ["callid"],
        UUID: "1b2bfa59-4444-4444-b7ce-6116bab380ad",
    }
]
export const sampleBrokenParsedViewConfig3 = [
    {
        title: 'Callid',
        tooltip: "Data extracted from the `callid` label",
        labels: 'callid',
        UUID: "1b2bfa59-4444-4444-b7ce-6116bab380ad",
    }
]
export const sampleBrokenParsedViewConfig4 = [
    {
        title: 'Callid',
        tooltip: "Data extracted from the `callid` label",
        labels: [],
        UUID: "1b2bfa59-4444-4444-b7ce-6116bab380ad",
    }
]
