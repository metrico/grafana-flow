import { createCustomElement } from '@angular/elements';
import { NgModule, Injector, DoBootstrap } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxFlowModule } from 'projects/ngx-flow/src/public-api';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgxFlowModule
    ],
    providers: []
})
export class AppModule implements DoBootstrap {
    constructor(private injector: Injector) {
        const WebComp = createCustomElement(AppComponent, { injector: this.injector });
        customElements.define("ngx-flow-out", WebComp);
    }
    ngDoBootstrap() { }
 }
