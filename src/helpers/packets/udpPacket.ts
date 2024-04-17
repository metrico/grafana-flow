import { Buffer } from 'buffer';

interface UdpData {
    sourcePort: string
    destinationPort: string
    data: Buffer
}
export const encodeUDPFrame = ({
    sourcePort,
    destinationPort,
    data
}: UdpData) => {
    const len = data.length
    let buf = Buffer.alloc(len + 8)
    buf.writeUInt16BE(parseInt(sourcePort, 10), 0)
    buf.writeUInt16BE(parseInt(destinationPort, 10), 2)
    buf.writeUInt16BE(buf.length, 4)
    data.copy(buf, 8)
    buf.writeUInt16BE(transportChecksum(buf), 6)
    return buf
}
export const transportChecksum = (buffer: Buffer) => {
    // pseudo header: srcip (16), dstip (16), 0 (8), proto (8), udp len (16)
    let len = buffer.length
    let srcip = Buffer.from("127.0.0.1")
    let dstip = Buffer.from("127.0.0.2")
    let protocol = 0x11
    let sum = 0xffff
    // pseudo header: srcip (16), dstip (16), 0 (8), proto (8), udp len (16)
    if (srcip && dstip) {
        sum = 0
        let pad = len % 2
        for (let i = 0; i < len + pad; i += 2) {
            if (i === 6) { continue } // ignore the currently written checksum
            sum += ((buffer[i] << 8) & 0xff00) + ((buffer[i + 1]) & 0xff)
        }
        for (let i = 0; i < 4; i += 2) {
            sum += ((srcip[i] << 8) & 0xff00) + (srcip[i + 1] & 0xff)
        }
        for (let i = 0; i < 4; i += 2) {
            sum += ((dstip[i] << 8) & 0xff00) + (dstip[i + 1] & 0xff)
        }
        sum += protocol + len
        while (sum >> 16) {
            sum = (sum & 0xffff) + (sum >> 16)
        }
        sum = 0xffff ^ sum
    }
    return sum
}
