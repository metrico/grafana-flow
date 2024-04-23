import { Labels, PanelData } from "@grafana/data";
import { convertDateToFileName } from "helpers/convertDateToFileName";
import { encodeEthernetFrame } from "helpers/packets/ethernetPacket";
import { encodeIPV4Packet, encodeIPV6Packet } from "helpers/packets/ipPacket";
import { encodeTCPFrame } from "helpers/packets/tcpPacket";
import { encodeUDPFrame } from "helpers/packets/udpPacket";
import { Buffer } from 'buffer';
// @ts-ignore
import { configure } from 'pcap-generator';

export const pcapExporter = (data: PanelData) => {
    const [serie]: any = (data as any)?.series || [];
    const fields = serie?.fields || [];
    const lineField = fields.find((i: any) => i.name === 'Line') ?? [];
    // Adds SIP message body to each packet and then filters out non-sip packets
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
            proto: proto === 'UDP' ? 17 : 6 as 6 | 17,
            type: fields[0]?.values[index]?.type
        }
        const hash = `${fieldObj.srcIp}:${fieldObj.srcPort}->${fieldObj.dstIp}:${fieldObj.dstPort}`
        const sequence = sequenceMap.get(hash) ?? 1
        const packet_data = proto === 'UDP' ? encodeUDPFrame({
            sourcePort: fieldObj.srcPort,
            destinationPort: fieldObj.dstPort,
            data: Buffer.from(line)
        }) : encodeTCPFrame({
            sourcePort: fieldObj.srcPort,
            destinationPort: fieldObj.dstPort,
            sequenceNumber: sequence,
            data: Buffer.from(line)
        })
        let ip_packet = ipv4_regex.test(fieldObj.dstIp) ? encodeIPV4Packet({
            protocol: fieldObj.proto,
            sourceIp: fieldObj.srcIp,
            destinationIp: fieldObj.dstIp,
            data: packet_data,
        }) : encodeIPV6Packet({
            protocol: fieldObj.proto,
            sourceIp: fieldObj.srcIp,
            destinationIp: fieldObj.dstIp,
            data: packet_data,
        })
        let ethernetPacket = encodeEthernetFrame({
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
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const date = new Date();
    link.download = `${convertDateToFileName(date)}.pcap`;
    link.click();
    return data;
}
