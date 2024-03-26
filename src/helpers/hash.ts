export function hash(str: string, lenHash = 32) {
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
