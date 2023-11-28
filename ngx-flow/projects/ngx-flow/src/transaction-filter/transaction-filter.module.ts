import { TransactionFilterService } from './transaction-filter.service';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionFilterComponent } from './transaction-filter.component';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
    imports: [
        CommonModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        FormsModule
    ],
    declarations: [TransactionFilterComponent],
    exports: [TransactionFilterComponent],
    providers: [TransactionFilterService],

    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TransactionFilterModule {
}
