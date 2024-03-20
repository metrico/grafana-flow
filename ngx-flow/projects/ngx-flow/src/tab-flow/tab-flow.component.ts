import {
    FixedSizeVirtualScrollStrategy,
    VIRTUAL_SCROLL_STRATEGY
} from '@angular/cdk/scrolling';
import {
    AfterViewChecked, AfterViewInit, ChangeDetectionStrategy,
    ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation
} from '@angular/core';
import { TransactionFilterService } from '../transaction-filter/transaction-filter.service';
import { cloneObject, getColorByString, getMethodColor, isIpInSubnet, JSON_parse, md5 } from '../helpers/functions';
import { getStorage, setStorage } from '../helpers/functions';
import { UserConstValue } from '../models/const-value.model';
import { FlowItemType } from '../models/flow-item-type.model';
import {
    ArrowEventState, MessageDetailsService
} from '../services/message-details.service';
import { Subscription } from 'rxjs';
import { isExternalUrl } from '../helpers/functions';
import * as html2canvas from 'html2canvas';

export class CustomVirtualScrollStrategy extends FixedSizeVirtualScrollStrategy {
    constructor() {
        super(50, 250, 500);
    }
}
interface FilterItem {
    title: string;
    selected: boolean;
    color?: string;
}
interface FlowFilter {
    isSimplify: boolean;
    isSimplifyPort: boolean;
    isCombineByAlias: boolean;
    isCombineByAliasGroup?: boolean;
    PayloadType: Array<FilterItem>;
    filterIP: Array<FilterItem>;
    filterAlias: Array<FilterItem>;
    CallId: Array<FilterItem>;
    isAbsolute: boolean
}

@Component({
    selector: 'app-tab-flow',
    templateUrl: './tab-flow.component.html',
    styleUrls: ['./tab-flow.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: VIRTUAL_SCROLL_STRATEGY, useClass: CustomVirtualScrollStrategy },
    ],
})
export class TabFlowComponent
    implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
    @ViewChild('flowscreen', { static: true }) flowscreen: any;
    @ViewChild('canvas', { static: true }) canvas: any;
    @ViewChild('downloadLink', { static: true }) downloadLink: any;
    @ViewChild('virtualScroll') virtualScroll: any;
    @ViewChild('virtualScrollbar') virtualScrollbar: any;
    @ViewChild('VScrollWrapper') VScrollWrapper: any;
    @ViewChild('labelContainer') labelContainer: any;
    @Input() callIDColorList: any;

    public getVirtualScrollHeight: string = `translateY(1px)`;
    public isSimplifyPort = false;
    _isCombineByAlias = false;
    _isCombineByAliasGroup = false;
    private _dataItem: any;
    private filters: FlowFilter | null = null;
    private ScrollTarget: string = '';
    flowGridLines = [];
    isExport = false;
    hosts: Array<any> = [];
    hostsCA: Array<any> = [];
    hostsIPs: Array<any> = [];
    ipaliases: Array<any> = [];
    arrayItems: Array<any> = [];
    arrayItemsVisible: Array<any> = [];
    color_sid: string = '';
    labels: Array<any> = [];
    _flagAfterViewInit = false;
    channelIdMessageDetails: string = '';
    hashDataItem = '';
    hashArrayItems = '';
    hashFilters = '';
    filterSubscription: Subscription | null = null;
    virtualScrollerItemsArray: Array<any> = [];
    _isSimplify: boolean = false;
    visible: boolean = false;
    callidPullerPosition: number = 0;
    isAbsolute: boolean = true;
    copyTimer: number = 0;
    selected: boolean = false;
    timeout: any;
    _interval: any | null = null;
    pathPrefix = './assets/';
    isSafari = navigator.vendor === 'Apple Computer, Inc.'
    outEventDelayOff = 0;
    get outEventOff() {
        //
        return this.outEventDelayOff + 1000 < performance.now();
    }
    @Input() callid: any;
    routerParser_events_subscribe: any;

    @Input() set isSimplify(v: boolean) {
        this._isSimplify = v;
        try {
            this.virtualScroll._contentWrapper;
        } catch (e) { }
        requestAnimationFrame(() => this.cdr.detectChanges());
    }
    get isSimplify(): boolean {
        return this._isSimplify;
    }

    @Input() set dataItem(dataItemValueInput) {
        let dataItemValue: any = {}
        const _hash = 'test' //md5(dataItemValue);
        if (typeof dataItemValueInput === 'string') {
            try {
                dataItemValue = {
                    data: JSON.parse(dataItemValueInput)
                }
            } catch (e) {
                console.error("JSON PARSING ERROR", e, dataItemValueInput)
                dataItemValue = {
                    data: null
                }
            }
        } else {
            if (dataItemValueInput.data) {
                if (typeof dataItemValueInput.data === 'string') {

                    try {
                        dataItemValue.data = JSON.parse(dataItemValueInput.data)
                    } catch (e) {
                        console.error("JSON PARSING ERROR", e, dataItemValueInput.data)
                        dataItemValue = {
                            data: null
                        }
                    }
                } else {
                    dataItemValue.data = dataItemValueInput.data;
                }
            } else {
                dataItemValue = dataItemValueInput;
            }
        }
        if (this.hashDataItem === _hash) {
            return;
        } else {
            this.hashDataItem = _hash;
        }
        this._dataItem = dataItemValue;

        this.color_sid = getColorByString(this.callid);
        this.hosts = cloneObject(dataItemValue.data.hosts);
        this.ipaliases = cloneObject(dataItemValue?.data?.data?.ipaliases) || [];
        this.channelIdMessageDetails = 'TabFlow-' + dataItemValue.data?.callid?.join();

        const aliases = this.ipaliases.filter((alias) => alias.status === true);
        this.hosts?.forEach((host) => {
            let aliasCollection = aliases.filter(
                ({ ip, port, alias }) =>
                    (ip === host.ip && (port === host.port || port === 0)) ||
                    (alias === host.alias && ip !== alias)
            );
            if (!aliasCollection || aliasCollection?.length === 0) {
                return;
            }
            const aliasItem =
                aliasCollection.find(({ ip, mask, port }) =>
                    isIpInSubnet(host.ip, `${ip}/${mask}`) && (port === host.port || port === 0)) ||
                aliasCollection.find(({ port }) => port === host.port) ||
                aliasCollection.find(({ port }) => port === 0) ||
                aliasCollection.find(({ alias }) => alias === host.alias);
            if (aliasItem) {
                /** add here the filtered params for display in flow tooltip*/
                if (Object.keys(aliasItem).includes('custom_fields')) {
                    let cp = aliasItem['custom_fields'];
                    Object.keys(cp).forEach((f) => {
                        aliasItem[f] = cp[f];
                    });
                }
                const filtered = ['status', 'port', 'ip', 'custom_fields'];
                if (typeof aliasItem.mask === 'number' && aliasItem.mask !== 32) {
                    aliasItem['IP Net'] = `${aliasItem.ip}/${aliasItem.mask}`;
                }
                const selected: any = Object.keys(aliasItem)
                    .filter((key) => !filtered.includes(key))
                    .reduce((obj: any, key) => {
                        obj[key] = aliasItem[key];
                        return obj;
                    }, {});
                Object.assign(host, selected);
            }

            host.isLinkImg = isExternalUrl(host.image);
            if (!host.isLinkImg && host.image.includes('/assets')) {
                host.image = host.image.replace('/assets', '')
            }
        });
        //
        this.setFilters(this.filters);
    }
    get dataItem() {
        return this._dataItem;
    }

    @Input() set exportAsPNG(val: any) {
        if (val) {
            this.isExport = true;
            this.cdr.detectChanges();
            setTimeout(this.onSavePng.bind(this), 500);
        }
    }

    set pageWidth(v: any) {
        this.cdr.detectChanges();
    }
    get pageWidth() {
        return (this.isSimplify ? 150 : 200) * this.flowGridLines.length;
    }

    @Output() pngReady: EventEmitter<any> = new EventEmitter();
    @Output() ready: EventEmitter<any> = new EventEmitter();

    constructor(
        private messageDetailsService: MessageDetailsService,
        private transactionFilterService: TransactionFilterService,
        private cdr: ChangeDetectorRef,
    ) {

    }
    public isDataReady() {

    }

    ngOnInit() {
        this.getVirtualScrollHeight = `translateY(1px)`;
        this.filterSubscription = this.transactionFilterService.listen.subscribe(
            (filters: any) => {
                this.setFilters(filters);
            }
        );
        this.isDataReady();

        this.visible = getStorage(UserConstValue.FLOW_LEGEND_VISIBILITY);
        this.outEvent();
        this.cdr.detectChanges();
    }

    private setFilters(filters: FlowFilter | null) {
        if (!filters || !this.hosts) {
            return;
        }
        this.filters = filters;
        const {
            CallId,
            PayloadType,
            filterIP,
            isSimplify,
            isSimplifyPort,
            isCombineByAlias,
            isCombineByAliasGroup,
            isAbsolute,
        } = filters;
        this.isAbsolute = isAbsolute;
        this._isCombineByAlias = isCombineByAlias;
        this._isCombineByAliasGroup = !!isCombineByAliasGroup;
        this.isSimplify = !isSimplify;
        this.isSimplifyPort = isSimplifyPort;
        if (CallId) {
            this.labels = CallId.map(({ title, selected }) => {
                const color = this.callIDColorList?.find(
                    (callID: any) => callID.callID === title
                );
                return {
                    callid: title,
                    color:
                        typeof color !== 'undefined'
                            ? color.backgroundColor
                            : getColorByString(title),
                    selected: selected,
                    copySelected: false,
                    currentlySelected: false,
                };
            });
        }
        this.arrayItems = cloneObject(this.dataItem.data.messages).filter(
            (item: any) => {
                const source_ip = filterIP?.find((i) => i.title === item.source_ip) || {
                    selected: true,
                };
                const destination_ip = filterIP?.find(
                    (i) => i.title === item.destination_ip
                ) || { selected: true };
                const bool = source_ip.selected || destination_ip.selected;
                return bool;
            }
        );

        this.arrayItems.forEach((item) => {
            const itemFilter = CallId?.find((i) => i.title === item.callid) || {
                selected: true,
            };
            const payloadFilter = PayloadType?.find(
                (i) => i.title === item.typeItem
            ) || { selected: true };
            const bool = !(itemFilter.selected && payloadFilter.selected);
            if (bool !== item.invisible) {
                item.invisibleDisplayNone = false;
                item.invisible = bool;
            }
        });

        const _arrayItems: any = this.arrayItems.filter((i) => !i.invisible);
        const hostsBuffer = this.getHostsByMessage(
            _arrayItems,
            isCombineByAlias,
            isSimplifyPort,
            isCombineByAliasGroup
        );
        //
        if (JSON.stringify(hostsBuffer) !== JSON.stringify(this.hostsIPs)) {
            this.hostsIPs = hostsBuffer.filter((host) => !!host);
        }
        this.updateHosts();
        this.flowGridLines = Array.from({
            length: this.hostsIPs.length - 1,
        });

        const { min, max, abs } = Math;
        const shownHosts: any = isCombineByAlias ? this.hostsCA : this.hostsIPs;
        this.flowGridLines = Array.from({ length: shownHosts.length - 1 });

        const [lastHost] = shownHosts.slice(-1);

        _arrayItems.forEach((item: any) => {

            const { srcAlias, dstAlias } = item || {};
            const srcPosition = this.getHostPosition(
                item.source_ip,
                item.source_port,
                srcAlias || item.source_ip
            );
            const dstPosition = this.getHostPosition(
                item.destination_ip,
                item.destination_port,
                dstAlias || item.destination_ip
            );
            const isRadialArrow = srcPosition === dstPosition;
            const isLastHost =
                isRadialArrow &&
                shownHosts.length > 1 &&
                (lastHost.ip === item.source_ip
                    || lastHost.ip === item.destination_ip
                    || !!lastHost?.ip_array?.find(
                        (item: any) => item.ip === item.source_ip ||
                            item.ip === item.destination_ip
                    ));

            const a = srcPosition;
            const b = dstPosition;
            const mosColor = item.QOS
                ? 'blinkLamp ' + this.mosColorBlink(item.QOS.MOS)
                : '';

            const color = this.callIDColorList?.find(
                (callID: any) => callID.callID === item.callid
            );
            const compiledColor = `hsla(${color?.decompiledColor?.hue}, ${color?.decompiledColor?.saturation
                }%, ${color?.decompiledColor?.lightness - 10}%, 1)`;
            item.options = {
                mosColor,
                color:
                    typeof color !== 'undefined'
                        ? compiledColor
                        : getColorByString(item.callid, 60, 60),
                color_method: getMethodColor(item.method + ''),
                start: min(a, b),
                middle: abs(a - b) || 1,
                direction: isLastHost || a > b,
                rightEnd: shownHosts.length - 1 - max(a, b),
                shortdata: '',
                isRadialArrow,
                isLastHost,
                arrowStyleSolid: item.typeItem === FlowItemType.SIP,
            };
        });

        this.arrayItems = _arrayItems;
        this.arrayItems.forEach((item) => {
            item.invisibleDisplayNone = item.invisible;
        });
        this.arrayItemsVisible = this.arrayItems.filter(
            (i) => !i.invisibleDisplayNone
        );
        this.setVirtualScrollItemsArray();
        this.cdr.detectChanges();
    }
    getHostsByMessage(arrayItems: Array<any>, isCombineByAlias: boolean, isSimplifyPort: boolean, isCombineByAliasGroup = false) {
        const hosts = cloneObject(this.hosts);

        const collectH = arrayItems
            .filter((i) => i?.source_ip && i?.destination_ip)
            .map((i) => {
                const source_ipisIPv6 = i?.source_ip?.match(/\:/g)?.length > 1 || false;
                const destination_ipisIPv6 =
                    i?.destination_ip?.match(/\:/g)?.length > 1 || false;
                const sIP = source_ipisIPv6 ? `[${i.source_ip}]` : i.source_ip;
                const dIP = destination_ipisIPv6
                    ? `[${i.destination_ip}]`
                    : i.destination_ip;
                const sIP_PORT = `${sIP}:${i.source_port}`;
                const dIP_PORT = `${dIP}:${i.destination_port}`;

                const { srcAlias, dstAlias } = i.source_data || {};
                return isCombineByAlias
                    ? [srcAlias || sIP_PORT, dstAlias || dIP_PORT]
                    : isSimplifyPort
                        ? [i.source_ip, i.destination_ip]
                        : [sIP_PORT, dIP_PORT];
            });

        // sort hosts by Items timeline
        const sortHosts: any[] = [];
        for (let i = 0; i < collectH.length; i++) {
            const [src, dst] = collectH[i];
            // src
            if (!sortHosts.includes(src)) {
                sortHosts.push(src);
            }
            // dist
            if (!sortHosts.includes(dst)) {
                sortHosts.push(dst);
            }
        }
        let selected_hosts = sortHosts.map((i) =>
            hosts.find((j: any) => [j.ip, j.host, j.alias].includes(i))
        );
        if (isCombineByAliasGroup) {
            selected_hosts = selected_hosts.filter(host => {

                return true;
            })
        }
        return selected_hosts;
    }
    toggleLegend() {
        this.visible = !this.visible;
        this.callidPullerPosition = this.labelContainer.nativeElement.offsetHeight;
        setStorage(
            UserConstValue.FLOW_LEGEND_VISIBILITY,
            JSON.stringify(this.visible)
        );
    }
    updateHosts() {
        this.hostsIPs.forEach((host) => {
            if (!host) {
                return;
            }
            if (!host.alias) {
                host.alias = host.ip;
            }
        });
        let aggregatedHosts = cloneObject(this.hostsIPs).filter(
            (i: any) => !!i
        );
        aggregatedHosts.forEach((i: any) => {
            this.hosts
                .filter((h) => this._isCombineByAliasGroup ? (h?.group === i?.group) || h?.alias === i?.alias : h?.alias === i?.alias)
                .forEach((item: any) => {
                    i.ip_array = i.ip_array || [];
                    if (i.ip_array.find(({ ip }: any) => ip === item.ip)) {
                        return;
                    }
                    i.ip_array.push({
                        ip: item.ip,
                        host: item,
                    });
                });
        });
        //
        aggregatedHosts.forEach((h: any, index: number) => {
            aggregatedHosts
                .filter(
                    (host: any, i: number) =>
                        i > index && (this._isCombineByAliasGroup ? (h.group === host.group) : (h.alias || h.ip) === (host.alias || host.ip))
                )
                .forEach((item: any) => (item.invisible = true));
        });

        aggregatedHosts = aggregatedHosts.filter((h: any) => !h.invisible);
        if (JSON.stringify(aggregatedHosts) !== JSON.stringify(this.hostsCA)) {
            this.hostsCA = aggregatedHosts;
        }
    }
    getHostPosition(ip: any, port: any, alias: any) {
        if (this._isCombineByAlias && ip === alias) {
            alias = this.hostsIPs.find((i) => i.ip === ip)?.alias || alias;
        }
        ip = ip?.replace(/\[|\]/g, '');
        const hosts = this._isCombineByAlias ? this.hostsCA : this.hostsIPs;
        let hostIndex = hosts?.findIndex((host) =>
            this._isCombineByAlias
                ? host.alias && alias
                    ? host.alias === alias
                    : host.ip === ip
                : this.isSimplifyPort
                    ? host.ip === ip
                    : host.ip === ip && host.port * 1 === port * 1
        );
        if (hostIndex < 0) {
            hostIndex = hosts.findIndex(host => host.ip_array.find((host: any) => host.ip === ip))
        }
        return hostIndex;
    }
    updateDOMScroller() {
        /**
         * hack for scroll DOM update
         */
        const _vs = this.virtualScrollbar?.nativeElement;
        if (_vs) {
            _vs.style.bottom = '1px';
            setTimeout(() => {
                _vs.style.bottom = '0px';
                this.pageWidth = '';
                this.setVirtualScrollHeight();
                setTimeout(() => {
                    this.updateDOMScroller();
                    this.pageWidth = '';
                }, 2000);
            }, 300);
        }
    }
    ngAfterViewInit() {
        requestAnimationFrame(() => {
            this.ready.emit({});
            this.updateDOMScroller();
        });
    }
    ngAfterViewChecked() {
        this._flagAfterViewInit = true;
        setTimeout(() => {
            this.cdr.detectChanges();
        });
    }

    private mosColorBlink(mosNum: number) {
        return (
            (mosNum >= 1 && mosNum <= 2 && 'red') ||
            (mosNum === 3 && 'gray') ||
            (mosNum <= 3 && 'orange') ||
            (mosNum > 3 && 'green')
        );
    }

    showTooltip(hostItem: any) {
        // this.tooltipService.show(hostItem);
    }
    hideTooltip() {
        // this.tooltipService.hide();
    }
    shortcutIPv6String(str = '') {
        const regexp = /^\[?([\da-fA-F]+)\:.*\:([\da-fA-F]+)\]?$/g;
        const regfn = (fullstring: any, start: any, end: any) => `${start}:...:${end}`;
        return str.replace(regexp, regfn);
    }

    onClickMessage(id: any, event: any = null, sitem: any = null) {
        document.dispatchEvent(new CustomEvent('ngx-flow-click-item', { detail: id }));
        return;
    }

    identifyHosts(index: any, item: any) {
        return `${index}_${item.host}_${item.hidden}`;
    }
    identify(index: any, item: any) {
        return item.id;
    }
    pipeToString(itemhost: any) {
        const arr = itemhost.arrip || [itemhost.IP];
        return arr.join(', ');
    }
    onSavePng() {
        if (!this._flagAfterViewInit) {
            setTimeout(this.onSavePng.bind(this), 1000);
            return;
        }
        if (html2canvas && typeof html2canvas === 'function') {
            this.cdr.detectChanges();
            const f: Function = html2canvas as Function;
            f(this.flowscreen.nativeElement).then((canvas: any) => {
                this.canvas.nativeElement.src = canvas.toDataURL();
                this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
                const date = new Date();
                this.downloadLink.nativeElement.download = `${date.toUTCString()}.png`;
                this.downloadLink.nativeElement.click();
                setTimeout(() => {
                    this.pngReady.emit({});
                });
            });
        }
    }
    labelColor(callid: any, selected: any) {
        if (selected) {
            const color = this.callIDColorList?.find(
                (callID: any) => callID.callID === callid
            );
            const adjustedColor = `hsl(${color?.decompiledColor?.hue}, ${color?.decompiledColor?.saturation
                }%, ${color?.decompiledColor?.lightness / 1.5}%, 1`;
            return typeof color !== 'undefined'
                ? adjustedColor
                : getColorByString(callid, undefined, 50, 1);
        } else {
            return 'hsla(0, 0%, 30%, 0.5)';
        }
    }
    onClickLabel(callidInput?: any) {
        return;
        // const isEnable = this.filters?.CallId.every(
        //     (callid) => callidInput === callid.title || !callid.selected
        // );
        // this.filters?.CallId.forEach((callid: any) => {
        //     if (callid.title !== callidInput) {
        //         callid.selected = isEnable;
        //     } else {
        //         callid.selected = true;
        //     }
        // });
        // this.setFilters(this.filters);
    }
    startCopy() {
        this.copyTimer = Date.now();
    }
    copy(value: any) {
        //   const localTimer = Date.now();
        //   if (localTimer - this.copyTimer > 700) {
        //     this.copyService.copy(value.callid, {
        //       message: 'notifications.success.callidCopy',
        //       isTranslation: true,
        //       translationParams: {
        //         callid: value.callid,
        //       },
        //     });
        //     value.copySelected = true;
        //     this.timeout = setTimeout(() => {
        //       value.copySelected = false;
        //     }, 1800);
        //   }
    }
    setScrollTarget(targetString: string) {
        this.ScrollTarget = targetString;
    }
    onScrollVScrollWrapper(event?: any) {
        try {
            const { scrollLeft } = event?.target || {};
            this.flowscreen.nativeElement.style.marginLeft = `${-scrollLeft}px`;
        } catch (e) { }
    }
    setVirtualScrollItemsArray() {
        this.virtualScrollerItemsArray = [
            { _step: 'top' },
            ...this.arrayItemsVisible,
            { _step: 'bottom' },
        ];
    }

    cdkWheelScroll(event?: any) {
        if (!event.shiftKey && Math.abs(event.deltaX) < Math.abs(event.deltaY)) {
            event.preventDefault();
        }
    }

    @HostListener('mousemove', ['$event'])
    middleclickEvent(event: any) {
        if (event.which === 2) {
            event.preventDefault();
            this.setVirtualScrollHeight();
        }
    }

    @HostListener('wheel', ['$event'])
    onWheelScrollWrapper(event?: any) {
        if (event?.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
            return;
        }
        const scrollbar = this.virtualScrollbar?.nativeElement;
        let movingAverageArray: any[] = [];
        const ma = (p: any) => {
            const valMA = 3; // Adjust this to change virtual scroll speed. Lower = faster
            if (movingAverageArray.length < valMA) {
                movingAverageArray = Array.from({ length: valMA }, (x) => p);
            }
            movingAverageArray.push(p);
            movingAverageArray = movingAverageArray.slice(-valMA);
            return movingAverageArray.reduce((a, b) => a + b, 0) / valMA;
        };
        ma(scrollbar?.scrollTop);
        const positionTarget = scrollbar?.scrollTop - event.wheelDelta;
        const sUpdate = () => {
            const t =
                event?.animation === false ? positionTarget : ma(positionTarget);
            scrollbar?.scrollTo({
                top: t,
            });
            this.setVirtualScrollHeight();
            if (t !== positionTarget) {
                requestAnimationFrame(sUpdate);
            }
        };
        sUpdate();
    }
    @HostListener('document:keydown', ['$event'])
    onKeydownHandler(event: KeyboardEvent) {
        switch (event.code) {
            case 'PageDown':
                event.preventDefault();
                event.stopPropagation();
                this.onWheelScrollWrapper({ wheelDelta: -500 });
                break;
            case 'PageUp':
                event.preventDefault();
                event.stopPropagation();
                this.onWheelScrollWrapper({ wheelDelta: 500 });
                break;
            case 'ArrowDown':
                event.preventDefault();
                event.stopPropagation();
                this.onWheelScrollWrapper({ wheelDelta: -150 });
                break;
            case 'ArrowUp':
                event.preventDefault();
                event.stopPropagation();
                this.onWheelScrollWrapper({ wheelDelta: 150 });
                break;
            case 'Home':
                event.preventDefault();
                event.stopPropagation();
                this.setVirtualScrollHeight({ position: 'start' });
                break;
            case 'End':
                event.preventDefault();
                event.stopPropagation();
                this.setVirtualScrollHeight({ position: 'end' });
                break;
        }
    }
    outEvent() {
        if (this.outEventOff) {
            const container = this.virtualScroll?.elementRef.nativeElement;
            if (!container) {
                return;
            }
            const scrollbar = this.virtualScrollbar?.nativeElement;
            scrollbar?.scrollTo({ top: container.scrollTop });
        }
        this.cdr.detectChanges();
    }
    setVirtualScrollHeight(e?: any) {
        this.outEventDelayOff = performance.now();
        const container = this.virtualScroll?.elementRef.nativeElement;
        if (!container) {
            this.getVirtualScrollHeight = `translateY(1px)`;
            this.cdr.detectChanges();
            return;
        }
        const scrollbar = this.virtualScrollbar?.nativeElement;
        const { scrollHeight } = container;
        switch (e?.position) {
            case 'start':
                scrollbar.scrollTo({ top: 0 });
                break;

            case 'end':
                scrollbar.scrollTo({ top: scrollHeight + 500 });
                this.onWheelScrollWrapper({ wheelDelta: -500 });
                break;
        }
        this.virtualScroll.scrollTo({ top: scrollbar.scrollTop });
        const _h = Math.floor(scrollHeight);
        this.getVirtualScrollHeight = `translateY(${_h}px)`;
        this.cdr.detectChanges();
    }
    ngOnDestroy() {
        if (this._interval) {
            clearInterval(this._interval);
        }
        this.hideTooltip();
        if (this.filterSubscription) {
            this.filterSubscription.unsubscribe();
        }
    }
    __toucheStartY = 0;
    __toucheStartX = 0;
    public onEvent(event?: any, type?: any) {
        const { x: currentX, y: currentY } = Object.values(event?.touches || {})
            ?.map((i: any) => [i?.clientX, i?.clientY])
            .reduce(
                (a, [x, y], k, arr) => {
                    a.x += x / arr.length;
                    a.y += y / arr.length;
                    return a;
                },
                { x: 0, y: 0 }
            );

        if (type === 'touchmove') {
            event.preventDefault();
            event.stopPropagation();

            this.onWheelScrollWrapper({
                wheelDelta: currentY - this.__toucheStartY,
                animation: false,
            });
            const vsw = this.VScrollWrapper.nativeElement;
            vsw.scrollTo({ left: vsw.scrollLeft - (currentX - this.__toucheStartX) });

        }
        this.__toucheStartY = currentY;
        this.__toucheStartX = currentX;
    }
    checkImgSrc($event: any, item: any = null) {
        if (item && !item.isSecondTry) {
            $event.target.src = this.pathPrefix + item.value;
            item.isSecondTry = true;
        } else {
            const defaultImg =
                'data:image/png;base64,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';
            if ($event.target.src != defaultImg) {
                $event.target.src = defaultImg;
                $event.target.classList.add('defaultaliasimg');
            }
        }
    }
}
