import { FlowItemComponent } from './flow-item/flow-item.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabFlowComponent } from './tab-flow.component';
// import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { ScrollingModule } from '@angular/cdk/scrolling';
// import { TranslateModule } from '@ngx-translate/core'
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

@NgModule({
    imports: [
        CommonModule,
        // VirtualScrollerModule,
        ScrollingModule,
        // TranslateModule,
        MatIconModule,
        MatTooltipModule,

    ],
    declarations: [
        TabFlowComponent,
        FlowItemComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [TabFlowComponent]
})
export class TabFlowModule { }
