import { Buffer } from 'buffer';
import { transportChecksum } from './udpPacket';

interface TcpData {
    data: Buffer;
    sourcePort: string;
    destinationPort: string;
    sequenceNumber?: number;
    acknowledgmentNumber?: number;
}
export const encodeTCPFrame = ({ data, sourcePort, destinationPort, sequenceNumber = 0, acknowledgmentNumber = 0 }: TcpData) => {
    const dataLength = data ? data.length : 0
    const packet = Buffer.alloc(dataLength + 20)
    packet.writeUInt16BE(parseInt(sourcePort, 10), 0)
    packet.writeUInt16BE(parseInt(destinationPort, 10), 2)
    packet.writeUInt32BE(sequenceNumber, 4)
    packet.writeUInt32BE(acknowledgmentNumber, 8)
    packet.writeUInt16BE(((20 / 4) << 12), 12);
    const setAck = (1 << 4)
    const setPsh = (1 << 3)
    const flags = setPsh | setAck
    packet.writeUInt8(flags, 13);
    packet.writeUInt16BE(8235, 14);
    packet.writeUInt16BE(0, 16);
    if (data) { data.copy(packet, 20) }
    const checksum = transportChecksum(data);
    packet.writeUInt16BE(checksum, 16)
    return packet
}
