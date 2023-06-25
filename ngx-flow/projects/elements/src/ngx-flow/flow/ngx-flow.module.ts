import {Injector, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {ElementModule} from '../../abstract/element.module';
import {NgxFlowModule, NgxFlowComponent} from '../../../../ngx-flow/src/public-api';

@NgModule({
    imports: [BrowserModule, NgxFlowModule],
    entryComponents: [NgxFlowComponent],
})
export class NgxFlowElementModule extends ElementModule {
    constructor(injector: Injector) {
        super(injector, NgxFlowComponent, 'ngx-flow');
    }
}
