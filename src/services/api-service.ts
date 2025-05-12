
import { hash } from 'helpers/hash';

const API_URL = "http://de5.sipcapture.io:7972/query";

const sql_SHOW_TABLES = 'SHOW TABLES';
const sql_DESCRIBE_SELECT = (table_name: string) => `DESCRIBE SELECT * FROM ${table_name} LIMIT 1`;
function addFilterToSQL (obj: any, table_name: string) {
    const [[columnName, filterString]] = Object.entries(obj)
    return `AND instr("${columnName}", '${filterString}') > 0 `
}
export const getSQLRequest = async ({ table_name, from, to, filters = [] }: any) => {
    // SHOW TABLES
    // DESCRIBE SELECT * FROM hep_100 LIMIT 1
    // SELECT time, location, temperature FROM weather WHERE time >= '2025-04-01T00:00:00'
    // SELECT count(*) as count FROM hep_1 WHERE time <= epoch_ns(TIMESTAMP '2025-04-18T00:00:00')
    if (!table_name) {
        return [];
    }
    let sql = `SELECT * FROM ${table_name}
    WHERE time >= epoch_ns(TIMESTAMP '${from.toISOString()}') 
    AND time <= epoch_ns(TIMESTAMP '${to.toISOString()}') 
    ${filters.map((i: any) => addFilterToSQL(i, table_name)).join("\n")}
    LIMIT 500
    `
        .replace(/\n/g, '')
        .replace(/\s+/g, ' ');
    return await getOutSideData(sql);
};

export const formattedDataFromCustomApi = (data: any[]) => {
    const [labels = [], Time = [], Line = [], tsNs = [], id = []]: any = [];

    data.forEach((item) => {
        const itemHash = hash(JSON.stringify(item));
        labels.push(item);
        Time.push(+item.time / 1000000);
        Line.push(item.payload);
        tsNs.push(item.__timestamp);
        id.push(item.__timestamp + itemHash);
    });

    return {
        series: [{
            fields: [
                { name: 'labels', values: labels },
                { name: 'Time', values: Time },
                { name: 'Line', values: Line },
                { name: 'tsNs', values: tsNs },
                { name: 'id', values: id }
            ]
        }]
    };
};

export const getOutSideData = async (SQL: string, DB = 'hep') => {
    return new Promise((resolve, reject) => {
        const url = API_URL + '?db=' + DB;
        const headers = {
            'Content-Type': 'application/json',

        };
        /** PROXY */
        // const url = 'http://localhost:8080/query?db=' + DB;
        // const headers = {
        //     'Content-Type': 'application/json',
        //     'Target-URL': 'http://de5.sipcapture.io:7972',
        // };
        const data = JSON.stringify({
            query: SQL,
        });
        console.log('url', url);
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: data,
        })
            .then((response) => response.json())
            .then((result) => {
                console.log('Response:', result);
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export function parseJSONValues(data: any[]) {
    const outData: any[] = []
    data.forEach(item => {
        const _item: any = {};
        Object.entries(item).forEach(([key, val]): any => {
            try {
                _item[key] = JSON.parse(val + '');
                if (key === "call_id") {
                    _item['CallID'] = _item[key]['raw'];
                }
            } catch (e) {
                if (key === "payload" && typeof val === 'string') {
                    _item[key] = val.split('\\r\\n').join("\n");
                } else {
                    _item[key] = val
                }
            }
        })
        outData.push(_item);
    })
    return outData;
};
export async function getTableList() {
    return (await getOutSideData(sql_SHOW_TABLES) as any).results;
}
export async function getDescribeTable(table_name: string) {
    const { results }: any = await getOutSideData(sql_DESCRIBE_SELECT(table_name))
    return results;
}

export async function getData(table_name: string, { from, to }: any, filters: any[] = []) {
    if (!table_name) {
        return [];
    }
    const des_res = await getDescribeTable(table_name);
    console.log('des_res', { des_res });
    const res: any = await getSQLRequest({ table_name, from, to, filters });
    // if (!(res?.results?.length > 0)) {
    //     return [];
    // };
    const parsedJSONvalues = parseJSONValues(res.results)
    const outData = formattedDataFromCustomApi(parsedJSONvalues);
    console.log('outData', outData)
    return outData;
}
