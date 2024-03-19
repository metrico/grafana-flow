import { Component, Input, OnInit } from '@angular/core';
import { hash } from '../helpers/functions';
import { FlowData } from '../models/flow.model';
@Component({
    selector: 'ngx-flow',
    template: `<div class="wrapper-container">

        <app-filter [hidden]="!isFilter" [dataItem]="{data}"></app-filter>

        <app-tab-flow
            [dataItem]="{data: _formattedData}"
            [callIDColorList]="callIDColorList"
            [callid]="callid"
            [isSimplify]="isSimplify"
        ></app-tab-flow>
    </div>`,
    styles: [`
    .wrapper-container {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    `]
})
export class NgxFlowComponent implements OnInit {
    _formattedData: any = {};
    @Input() data: any;
    @Input() callIDColorList: any;
    @Input() callid: any;
    @Input() isSimplify: boolean = false;
    @Input() isFilter: boolean = false;

    constructor() { }

    ngOnInit(): void {
        console.log(this.data)
        this.formatter(this.data);
    }
    formatter(data: FlowData | null = null) {
        let actors = data?.actors || null;
        let dataSimple: any[] = data?.data as any[];
        const sourceArray = dataSimple.map(i => i.source);
        const destinationArray = dataSimple.map(i => i.destination);
        const uniqHostName = ([...sourceArray, ...destinationArray]).sort().filter((i, k, arr) => i != arr[k + 1]);

        const hosts = uniqHostName.map((i, k) => this.makeHost(i, k, actors))
        const messages = dataSimple.map(i => this.formatItem(i, i.source, i.destination, hosts))
        this._formattedData = { hosts, messages };
        console.log('hosts -> ', { hosts, messages }, this._formattedData);
    }

    makeHost(name: string, i: number = 0, actors: any[] | null = null) {
        // console.log({ actors });
        const actor = actors?.find((j: any) => j.id === name)?.displayedTitle;
        console.log({ actor, name, i });
        return {
            name: name,
            alias: actor || name,
            host: `1.0.0.${i}:${i}`,
            ip: `1.0.0.${i}`,
            port: i,
            isIPv4: true,
            position: i
        };
    }
    formatItem(i: any, SRC: any, DIST: any, hosts: any) {
        const src = hosts.find((i: any) => i.name === SRC);
        const dist = hosts.find((i: any) => i.name === DIST);

        return {
            callid: hash((i.messageID || i.title)+''),
            codecData: ' ',
            description: i.aboveArrow || '',
            destination_ip: dist.ip,
            destination_port: dist.port,
            diff: ' ',
            diff_absolute: i.subTitle || '',
            diff_num:  ' ',
            dstAlias: DIST,
            id: 0,
            info_date: i.belowArrow || '... ',
            info_date_absolute: i.subTitle || '... ',
            ipDirection: SRC + ' > ' + DIST,
            messageData: null,
            method: ' ',
            method_text: i.title || i.messageID,
            // micro_ts: 0,
            // milli_ts: 0,

            pid: 0,
            sourceLabel: i.sourceLabel,
            destinationLabel: i.destinationLabel,
            source_data: null,
            source_ip: src.ip,
            source_port: src.port,
            srcAlias: SRC,

            typeItem: "SIP",
        }
    }


}
