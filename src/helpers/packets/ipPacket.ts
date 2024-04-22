
import { Buffer } from 'buffer';
// function encode(packet, buf, offset) {
//     if (!buf) { buf = new Buffer(encodingLength(packet, packet.version === 4 ? 20 : 40)) }
//     if (!offset) { offset = 0 }
//     if (packet.version === 4) {

//         // IPv4 header
//         buf[offset] = packet.version << 4 | (packet.ihl || 5)
//         buf[offset + 1] = (packet.dscp || 0) << 2 | (packet.ecn || 0)
//         buf.writeUInt16BE(20 + packet.data.length, offset + 2)
//         buf.writeUInt16BE(packet.identification || 0, offset + 4)
//         buf.writeUInt16BE((packet.flags || 0) << 13 | (packet.fragmentOffset || 0), offset + 6)
//         buf[offset + 8] = packet.ttl || 0
//         buf[offset + 9] = packet.protocol || 0
//         buf.writeUInt16BE(0, offset + 10)
//         encodeIp(packet.sourceIp, buf, offset + 12)
//         encodeIp(packet.destinationIp, buf, offset + 16)
//         buf.writeUInt16BE(checksum(buf, offset, offset + 20), offset + 10)
//         packet.data.copy(buf, offset + 20)

//         encode.bytes = 20 + packet.data.length
//     } else {
//         // IPv6 header
//         buf.writeUInt32BE(packet.version << 28 | (packet.trafficClass << 20) | packet.flowLabel, offset);
//         buf.writeUInt16BE(packet.data.length, offset + 4);
//         buf[offset + 6] = packet.nextHeader;
//         buf[offset + 7] = packet.hopLimit || 64;
//         const sourceIpBuffer = Buffer.from(packet.sourceIp);
//         const destinationIpBuffer = Buffer.from(packet.destinationIp);

//         sourceIpBuffer.copy(buf, offset + 8, 0, 16);
//         destinationIpBuffer.copy(buf, offset + 24, 0, 16);

//         // Here you would continue encoding any additional IPv6 header fields

//         packet.data.copy(buf, offset + 40);

//         encode.bytes = 40 + packet.data.length;
//     }

//     return buf
// }
interface IpData {
    protocol: 6 | 17
    sourceIp: string
    destinationIp: string
    data: Buffer
}
export const encodeIPV4Packet = ({ protocol = 6, sourceIp, destinationIp, data }: IpData): Buffer => {
    const offset = 0
    const buffer = Buffer.alloc(encodingLength(data, 20))
    // Setting IP type to 4 and header length to 5
    buffer[offset] = 4 << 4 | 5
    // Setting DSCP and ECN to 0 as they are unused in our code
    buffer[offset + 1] = 0 << 2 | 0
    // Packet length (header + data)
    buffer.writeUInt16BE(20 + data.length, offset + 2)
    // Packet identification field, unused in our code, set to 0 
    buffer.writeUInt16BE(0, offset + 4)
    // Packet flags and fragment offset, unused in our code, both set to 0
    buffer.writeUInt16BE(0 << 13 | 0, offset + 6)
    // Setting TTL to 54
    buffer[offset + 8] = 54
    // Setting protocol, in our case only TCP or UDP
    buffer[offset + 9] = protocol
    // Writing checksum as 0 to overwrite it later with the correct value after setting IPs
    buffer.writeUInt16BE(0, offset + 10)
    // Writing source and destination IPs
    encodeIPV4Address(sourceIp, buffer, offset + 12)
    encodeIPV4Address(destinationIp, buffer, offset + 16)
    // Writing correct checksum
    buffer.writeUInt16BE(checksum(buffer, offset, offset + 20), offset + 10)
    data.copy(buffer, offset + 20)
    return buffer
}
const encodeIPV4Address = (ip: string, data: Buffer, offset: number) => {
    const octets = ip.split('.')
    for (let i = 0; i < 4; i++) {
        data[offset++] = parseInt(octets[i], 10)
    }
}
export const encodeIPV6Packet = ({ protocol = 6, sourceIp, destinationIp, data }: IpData): Buffer => {
    const offset = 0
    const buffer = Buffer.alloc(encodingLength(data, 40))
    // Setting IP type to 6
    buffer.writeUInt32BE(6 << 28, offset);
    // Packet length (data)
    buffer.writeUInt16BE(data.length, offset + 4);
    // Setting protocol, in our case only TCP or UDP
    buffer[offset + 6] = protocol;
    // Packet hop limit not provided in our code, set to 64 as default
    buffer[offset + 7] = 64;
    // Source and destination IPs    
    encodeIPV6Address(sourceIp, buffer, offset + 8)
    encodeIPV6Address(destinationIp, buffer, offset + 24)
    data.copy(buffer, offset + 40);
    return buffer
}
export const encodeIPV6Address = (ip: string, data: Buffer, offset: number) => {
    const groups = ip.split(':')
    if (groups.length < 8) {
        if (groups.includes('')) {
            const fillCount = 8 - (groups.length - 1) // -1 to account for the empty string
            const fillItems = Array(fillCount).fill('0000');
            const startIndex = groups.indexOf('');
            groups.splice(startIndex, 1, ...fillItems);
        }
    }
    let currentOffset = offset
    for (let i = 0; i < groups.length; i++) {
        const hex = parseInt(groups[i], 16)
        data.writeUInt16BE(hex, currentOffset)
        currentOffset += 2

    }
}
const checksum = (data: Buffer, offset: number, offsetEnd: number) => {
    let sum = 0
    for (; offset < offsetEnd; offset += 2) { sum += data.readUInt16BE(offset) }
    while (true) {
        let carry = sum >> 16
        if (!carry) { break }
        sum = (sum & 0xffff) + carry
    }
    return ~sum & 0xffff
}
const encodingLength = (data: Buffer, ipPacketSize: number) => {
    return ipPacketSize + data.length
}
