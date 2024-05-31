import { PanelData } from "@grafana/data";
import { convertDateToFileName } from "helpers/convertDateToFileName";
import { saveAs } from "helpers/saveAs";
import { DateTime } from "luxon";

export const textExporter = (data: PanelData) => {
    const [serie]: any = (data as any)?.series || [];
    const fields = serie?.fields || [];
    const lineField = fields.find((i: any) => i.name === 'Line') ?? [];
    const exportText = lineField?.values.map((i: string, index: number) => {
        let dt = DateTime.fromMillis(fields[0]?.values[index]?.timestamp).toISO()
        dt = dt?.replace('+', '000+') ?? '';
        if (fields[0]?.values[index]?.type !== 'sip') {
            i = '';
        }
        let proto = 'proto:'
        if (i.includes('UDP')) {
            proto += "UDP"
        } else if (i.includes('TCP')) {
            proto += "TCP"
        }
        return `${proto} ${dt} ${fields[0]?.values[index]?.src_ip} ---> ${fields[0]?.values[index]?.dst_ip} \n\n${i}`
    }).join('\n');
    // Create element with <a> tag

    // Create a blog object with the file content which you want to add to the file
    const file = new Blob([exportText], { type: 'text/plain' });
    saveAs(file, `${convertDateToFileName(new Date())}.txt`);
}
