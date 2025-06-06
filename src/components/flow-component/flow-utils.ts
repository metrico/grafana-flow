// import { Md5 } from "ts-md5";

export enum FlowItemType {
  SIP = "SIP",
  SDP = "SDP",
  RTP = "RTP",
  RTCP = "RTCP",
  DTMF = "DTMF",
  LOG = "LOG",
}

export function getMethodColor(str: any): string {
  let color = "hsl(0,0%,0%)";
  const regex = /\s*\(.*/g;
  str = (str + "").replace(regex, "");
  
  if (str === "INVITE" || str === "re-INVITE") {
    color = "hsla(227.5, 82.4%, 51%, 1)";
  } else if (str === "BYE" || str === "CANCEL") {
    color = "hsla(120, 100%, 25%, 1)";
  } else if (str >= 100 && str < 200) {
    color = "hsla(0, 0%, 0%, 1)";
  } else if (str >= 200 && str < 300) {
    color = "hsla(120, 70%, 50%, 1)";
  } else if (str >= 300 && str < 400) {
    color = "hsla(280, 100%, 50%, 1)";
  } else if (str >= 400 && str < 500) {
    color = "hsla(15, 100%, 45%, 1)";
  } else if (str >= 500 && str < 700) {
    color = "hsla(0, 100%, 45%, 1)";
  }
  
  return color;
}

// export function md5(str: string): string {
//   return Md5.hashAsciiStr(str || "") + "";
// }

export function getColorByStringHEX(str: string): string {
  if (str === "LOG") {
    return "FFA562";
  }
  
  let hash = 0;
  // str = md5(str);
  
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let col =
    ((hash >> 24) & 0xaf).toString(16) +
    ((hash >> 16) & 0xaf).toString(16) +
    ((hash >> 8) & 0xaf).toString(16) +
    (hash & 0xaf).toString(16);
    
  if (col.length < 6) {
    col = col.substring(0, 3) + col.substring(0, 3);
  }
  if (col.length > 6) {
    col = col.substring(0, 6);
  }
  
  return col;
}

export function getColorByString(
  str: string,
  saturation = 60,
  lightness = 60,
  alpha = 1,
  offset = 0
): string {
  const col = getColorByStringHEX(str);
  const result: any = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(col);

  if (!result) {
    return `hsl(0, ${saturation + ''}%, ${lightness + ''}%, ${alpha + ''})`;
  }

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  // let s: any = null;
  // let l = (max + min) / 2;
  
  if (max === min) {
    h = 0; // achromatic
  } else {
    const d = max - min;
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  
  h = Math.round(h * 360);
  
  return `hsl(${h - offset}, ${saturation}%, ${lightness}%, ${alpha})`;
}

export const mosColorBlink = (mosNum: number): string => {
  return (
    (mosNum >= 1 && mosNum <= 2 && "red") ||
    (mosNum === 3 && "gray") ||
    (mosNum <= 3 && "orange") ||
    (mosNum > 3 && "green") ||
    "gray"
  );
}
