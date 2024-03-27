import { TransactionFilterService } from './transaction-filter.service';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionFilterComponent } from './transaction-filter.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';

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
