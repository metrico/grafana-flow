import { TransactionFilterService } from './transaction-filter.service';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionFilterComponent } from './transaction-filter.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
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
