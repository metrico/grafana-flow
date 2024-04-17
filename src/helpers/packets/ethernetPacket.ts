
import { Buffer } from 'buffer';

interface EthernetData {
    destinationMac?: string;
    sourceMac?: string;
    type: '0800' | '86dd';
    data: Buffer;
}

export const encodeEthernetFrame = ({ destinationMac = '11:22:33:44:55:66', sourceMac = 'aa:bb:cc:dd:ee:ff', type, data }: EthernetData): Buffer => {
    const ethernetFrameLength = 14; // Length of Ethernet frame header
    const totalLength = ethernetFrameLength + data.length;
    const frame = Buffer.alloc(totalLength);

    destinationMac.split(':').forEach((byte, index) => frame.writeUInt8(parseInt(byte, 16), index));
    sourceMac.split(':').forEach((byte, index) => frame.writeUInt8(parseInt(byte, 16), index + 6));
    frame.writeUInt16BE(parseInt(type, 16), 12); // EtherType
    data.copy(frame, ethernetFrameLength); // Copy payload to frame

    return frame;
}
