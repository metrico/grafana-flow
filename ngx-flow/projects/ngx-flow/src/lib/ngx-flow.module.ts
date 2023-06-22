import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabFlowModule } from '../tab-flow/tab-flow.module';
import { TransactionFilterModule } from '../transaction-filter/transaction-filter.module';
import { NgxFlowComponent } from './ngx-flow.component';



@NgModule({
    declarations: [
        NgxFlowComponent
    ],
    imports: [
        TabFlowModule,
        CommonModule,
        TransactionFilterModule
    ],
    exports: [
        NgxFlowComponent
    ]
})
export class NgxFlowModule { }
