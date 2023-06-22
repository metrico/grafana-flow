import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {NgxFlowElementModule} from './ngx-flow/flow/ngx-flow.module';

enableProdMode();

platformBrowserDynamic()
    .bootstrapModule(NgxFlowElementModule)
    .catch(err => console.error(err));
