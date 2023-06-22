import {
    Component,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    Input,
    HostListener,
    ViewChild,
    ElementRef,
    AfterViewInit,
} from '@angular/core';
import { arrayUniques, cloneObject, getColorByString, JSON_parse } from '../helpers/functions';
import { CallIDColor } from '../models/CallIDColor.model';
import { ConstValue, UserConstValue } from '../models/const-value.model';
import { FlowItemType } from '../models/flow-item-type.model';
import { TransactionFilterService } from './transaction-filter.service';
// import { PreferenceAdvancedService } from '@it-app/services/preferences/advanced.service';
import { setStorage } from '../helpers/functions';
import { Subscription } from 'rxjs';
// import { AlertService } from '@it-app/services/alert.service';
// import { AlertMessage } from '../models/alert.model';

interface FilterItem {
    title: string;
    selected: boolean;
    color?: string;
}
export interface FlowFilter {
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
    selector: 'app-filter',
    templateUrl: './transaction-filter.component.html',
    styleUrls: ['./transaction-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionFilterComponent implements AfterViewInit {
    flowFilters: any;
    isShowOneWeyAudioEmptyPair = false;
    isShowRtpStopPosition = false;
    isSimplify = true;
    isSimplifyPort = true;
    isCombineByAlias = false;
    isCombineByAliasGroup = false;
    IdFromCallID: any | null = null;
    isFilterOpened = false;
    isAbsolute = true;
    isExperimental = false;
    checkboxListFilterPayloadType: any[] = [];
    checkboxListFilterPort: any[] = [];
    checkboxListFilterCallId: any[] = [];
    checkboxListFilterIP: any[] = [];
    checkboxListFilterAliases: any[] = [];
    hosts = [];
    _sipDataItem: any;
    _isSingleIP = false;
    filterSubscription: Subscription | null = null;
    combineType = '3port';
    listCombineTypes = {
        '1none': 'Ungrouped',
        '2alias': 'Group by Alias',
        '4port': 'Group by Alias-Group',
        '3port': 'Group by IP',
    };

    _type = 'Flow';
    _channel: string = '';
    @Input('channel') set channel(val: string) {
        this._channel = val;
    }
    get channel() {
        return this._channel;
    }
    bufferPayload: Array<string> = [];
    previousTab: string = '';
    @Input('type') set type(val: any) {
        this._type = val || this._type;
        if (this.isMediaReportsTab) {
            const otherTabBuffer = cloneObject(this.checkboxListFilterPayloadType);
            if (typeof this.bufferPayload !== 'undefined') {
                this.checkboxListFilterPayloadType = this.bufferPayload;
            } else {
                this.checkboxListFilterPayloadType.forEach((i) => {
                    i.selected = [FlowItemType.RTP, FlowItemType.RTCP].includes(i.title);
                });
            }
            this.bufferPayload = otherTabBuffer;
            this.doFilterMessages()
        } else {
            this.restoreFiltersFromLocalStorage();
            if (this.previousTab === 'Media Reports') {
                const mediaReportBuffer = cloneObject(this.checkboxListFilterPayloadType);
                this.checkboxListFilterPayloadType = this.bufferPayload;
                this.doFilterMessages()
                this.bufferPayload = mediaReportBuffer;
            }
        }
        this.previousTab = val;
        this.cdr.detectChanges();
    }

    @Input('dataItem')
    get dataItem() {
        return this._sipDataItem;
    }
    set dataItem(data) {
        if (!data) {
            return;
        }

        this._sipDataItem = data;
        this._sipDataItem.metadata = { dataType: data.type };

        const { filters, callid, hosts } = data.data;
        const [callidFirst] = callid || [];
        this.hosts = hosts;

        /**
         * IP filter
         */
        this.checkboxListFilterIP = hosts ? arrayUniques(
            hosts.map((i: any) => i.ip)
        ).map((i: any) => ({
            title: i,
            selected: true,
        })) : [];

        const ips: any[] = arrayUniques(this.checkboxListFilterIP?.map(i => i.title) || []);
        this._isSingleIP = ips.length < 2;

        /**
         * Alias filter
         */
        this.checkboxListFilterAliases = hosts ? arrayUniques(
            hosts.filter((a: any) => a.alias !== a.ip)
                .map((i: any) => i.alias)
        ).map((i: any) => ({
            title: i,
            selected: true,
        })) : [];

        /**
         * PayloadType
         */
        this.checkboxListFilterPayloadType = Object.entries(filters?.payload || {})
            .filter((i) => i[1])
            .map((record) => {
                const [typeName] = record;
                return {
                    title: typeName,
                    selected:
                        this.getPayloadFromLocalStorage(typeName) ||
                        (typeName !== FlowItemType.RTCP && typeName !== FlowItemType.RTP),
                };
            });

        /**
         * Call-ID
         */
        this.checkboxListFilterCallId = callid?.map((id: any) => {
            const color = this.callIDColorList?.find(
                (callID) => callID.callID === id
            );
            const compiledColor = `hsla(${color?.decompiledColor?.hue}, ${color?.decompiledColor?.saturation}%, ${color?.decompiledColor?.lightness}%, 1)`;
            return {
                title: id,
                selected: true,
                color: color ? compiledColor : getColorByString(id),
            };
        });
        this.IdFromCallID = callidFirst;
        this.flowFilters = {
            channel: this.channel,
            isSimplify: this.isSimplify,
            isSimplifyPort: !this._isSingleIP ? this.isSimplifyPort : false,
            isCombineByAlias: !this._isSingleIP ? this.isCombineByAlias : false,
            isCombineByAliasGroup: !this._isSingleIP ? this.isCombineByAliasGroup : false,
            PayloadType: this.checkboxListFilterPayloadType,
            filterIP: this.checkboxListFilterIP,
            filterAlias: this.checkboxListFilterAliases,
            CallId: this.checkboxListFilterCallId,
            isAbsolute: this.isAbsolute,
            isShowOneWeyAudioEmptyPair: this.isShowOneWeyAudioEmptyPair,
            isShowRtpStopPosition: this.isShowRtpStopPosition,
        };

        this.transactionFilterService.setFilter(this.flowFilters);

        this.restoreFiltersFromLocalStorage();

        try {
            this.cdr.detectChanges();
        } catch (err) { }
    }

    @Input() callIDColorList: Array<CallIDColor> = [];
    @ViewChild('filterContainer', { static: false }) filterContainer: any;
    constructor(
        private cdr: ChangeDetectorRef,
        private transactionFilterService: TransactionFilterService,
        // private _pas: PreferenceAdvancedService,
        // private alertService: AlertService
    ) { }

    doFilterMessages(type: string | null = null, item: any = null) {
        setTimeout(() => {
            if (this.combineType === '1none') {
                this.isCombineByAlias = false;
                this.isSimplifyPort = false;
                this.isCombineByAliasGroup = false;
            } else if (this.combineType === '2alias') {
                this.isCombineByAlias = true;
                this.isSimplifyPort = true;
                this.isCombineByAliasGroup = false;
            } else if (this.combineType === '3port') {
                this.isCombineByAlias = false;
                this.isSimplifyPort = true;
                this.isCombineByAliasGroup = false;
            } else if (this.combineType === '4port') {
                this.isCombineByAlias = true;
                this.isSimplifyPort = true;
                this.isCombineByAliasGroup = true;
            }

            if (type === 'alias') {
                this.checkboxListFilterAliases?.forEach((alias: any) => {
                    const getArrayIPByAlias: any = arrayUniques(
                        this.hosts.filter((i: any) => i.alias === alias.title).map((i: any) => i.ip)
                    );
                    getArrayIPByAlias?.forEach((ip: any) => {
                        (
                            (this.checkboxListFilterIP?.find(({ title }) => title === ip) || {}) as any
                        ).selected = alias.selected;
                    });
                });
                this.cdr.detectChanges();
            }
            if (type === 'payloadType') {
                item.indeterminate = false;
            }
            if (this.checkboxListFilterPayloadType.every(type => type.selected === false)) {
                if (this.isMediaReportsTab) {
                    this.checkboxListFilterPayloadType.find(type => type.title === FlowItemType.RTP || type.title === FlowItemType.RTCP).selected = true;
                } else {
                    if (!this.checkboxListFilterPayloadType) {
                        this.checkboxListFilterPayloadType = [{ selected: true }];
                    } else if (!this.checkboxListFilterPayloadType[0]) {
                        this.checkboxListFilterPayloadType[0] = { selected: true };
                    } else {

                        this.checkboxListFilterPayloadType[0].selected = true;
                    }
                }
                // const alert: AlertMessage = {
                //   message: 'notifications.notice.item_was_filtered',
                //   isTranslation: true,
                //   translationParams: { type: 'Payload' }
                // }
                // this.alertService.notice(alert)
            }

            if (this.checkboxListFilterCallId?.every((type: any) => type.selected === false)) {
                if (!this.checkboxListFilterCallId) {
                    this.checkboxListFilterCallId = [{ selected: true }]
                } else if (!this.checkboxListFilterCallId[0]) {
                    this.checkboxListFilterCallId[0] = { selected: true };
                } else {

                    this.checkboxListFilterCallId[0].selected = true;
                }
                // const alert: AlertMessage = {
                //   message: 'notifications.notice.item_was_filtered',
                //   isTranslation: true,
                //   translationParams: { type: 'Call ID' }
                // }
                // this.alertService.notice(alert)
            }

            if (this.checkboxListFilterIP?.every((type: any) => type.selected === false)) {
                if (!this.checkboxListFilterIP) {
                    this.checkboxListFilterIP = [{ selected: true }]
                } else if (!this.checkboxListFilterIP[0]) {
                    this.checkboxListFilterIP[0] = { selected: true };
                } else {

                    this.checkboxListFilterIP[0].selected = true;
                }
                // const alert: AlertMessage = {
                //   message: 'notifications.notice.item_was_filtered',
                //   isTranslation: true,
                //   translationParams: { type: 'IP' }
                // }
                //     this.alertService.notice(alert)
            }

            this.flowFilters = {
                channel: this.channel,
                isSimplify: this.isSimplify,
                isSimplifyPort: this.isSimplifyPort,
                isCombineByAlias: this.isCombineByAlias,
                isCombineByAliasGroup: this.isCombineByAliasGroup,
                PayloadType: this.checkboxListFilterPayloadType,
                filterIP: this.checkboxListFilterIP,
                CallId: this.checkboxListFilterCallId,
                isAbsolute: this.isAbsolute,
                isShowOneWeyAudioEmptyPair: this.isShowOneWeyAudioEmptyPair,
                isShowRtpStopPosition: this.isShowRtpStopPosition,
            };
            if (!this.isMediaReportsTab) {
                this.saveFiltersToLocalStorage();
            }
            this.transactionFilterService.setFilter(this.flowFilters);
            this.cdr.detectChanges();
        }, 0);
    }
    ngOnInit() {

    }
    async ngAfterViewInit() {
        // this.isExperimental = await this._pas.isExperimental('show-rtp-stop-position');
        // setTimeout(() => {
        //     if (!this.isMediaReportsTab) {
        //         this.saveFiltersToLocalStorage();
        //     }
        //     this.cdr.detectChanges();
        // });
    }
    saveFiltersToLocalStorage() {
        let lsFilter = null;

        setStorage(
            UserConstValue.LOCAL_FILTER_STATE,
            (lsFilter = {
                isSimplify: this.isSimplify,
                isSimplifyPort: this.isSimplifyPort,
                isCombineByAlias: this.isCombineByAlias,
                isCombineByAliasGroup: this.isCombineByAliasGroup,
                combineType: this.combineType,

                flowFilters: {
                    isSimplify: this.isSimplify,
                    isSimplifyPort: this.isSimplifyPort,
                    isCombineByAlias: this.isCombineByAlias,
                    isCombineByAliasGroup: this.isCombineByAliasGroup,
                    isShowOneWeyAudioEmptyPair: this.isShowOneWeyAudioEmptyPair,
                    isShowRtpStopPosition: this.isShowRtpStopPosition,
                    // filterIP: this.checkboxListFilterIP,
                    // filterAlias: this.checkboxListFilterAliases,
                },
            })
        );
    }
    getPayloadFromLocalStorage(type: string = 'RTP') {
        const defaultReturn =
            type === FlowItemType.SIP || type === FlowItemType.SDP;
        return defaultReturn

    }
    restoreFiltersFromLocalStorage() {
        /** restore from localStorage */
        let localFilterState: any =
            localStorage.getItem(UserConstValue.LOCAL_FILTER_STATE);
        if (localFilterState) {
            try {
                localFilterState = JSON_parse(localFilterState);
                this.combineType = !this._isSingleIP
                    ? localFilterState.combineType
                    : '1none';
                this.isSimplify = localFilterState.isSimplify;
                this.isSimplifyPort = !this._isSingleIP
                    ? localFilterState.isSimplifyPort
                    : false;
                this.isCombineByAlias = !this._isSingleIP
                    ? localFilterState.isCombineByAlias
                    : false;
                this.isCombineByAliasGroup = !this._isSingleIP
                    ? localFilterState.isCombineByAliasGroup
                    : false;

                this.flowFilters = this.flowFilters || {};
                this.flowFilters.isSimplify = localFilterState.flowFilters.isSimplify;
                this.flowFilters.isSimplifyPort = !this._isSingleIP
                    ? localFilterState.flowFilters.isSimplifyPort
                    : false;
                this.flowFilters.isCombineByAlias = !this._isSingleIP
                    ? localFilterState.flowFilters.isCombineByAlias
                    : false;
                this.flowFilters.isCombineByAliasGroup = !this._isSingleIP
                    ? localFilterState.flowFilters.isCombineByAliasGroup
                    : false;
                this.flowFilters.isShowOneWeyAudioEmptyPair =
                    !!localFilterState.isShowOneWeyAudioEmptyPair;
                this.flowFilters.isShowRtpStopPosition =
                    !!localFilterState.isShowRtpStopPosition;
                this.checkboxListFilterPayloadType = this.flowFilters.PayloadType;

                this.cdr.detectChanges();
            } catch (err: any) {
                console.error(new Error(err));
                localStorage.removeItem(UserConstValue.LOCAL_FILTER_STATE);
            }
        } else {
            this.saveFiltersToLocalStorage();
        }
    }
    doOpenFilter() {
        if (this.isFilterOpened) {
            return;
        }
        setTimeout(() => {
            this.isFilterOpened = true;
            this.cdr.detectChanges();
        });
        this.cdr.detectChanges();
    }

    @HostListener('document:click', ['$event.target'])
    public onClick(targetElement: any) {
        if (this.filterContainer && this.filterContainer.nativeElement) {
            const clickedInside =
                this.filterContainer.nativeElement.contains(targetElement);
            if (!clickedInside && this.isFilterOpened) {
                this.hideFilter();
            }
        }
    }
    hideFilter() {
        this.isFilterOpened = false;
        this.cdr.detectChanges();
    }
    get isMessageTab(): boolean {
        return this._type === 'Messages';
    }
    get isFlowTab(): boolean {
        return this._type === 'Flow';
    }
    get isGraphTab(): boolean {
        return this._type === 'Graph';
    }
    get isMediaReportsTab(): boolean {
        return this._type === 'Media Reports';
    }
}
