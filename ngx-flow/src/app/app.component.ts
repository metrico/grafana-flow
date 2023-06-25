import { Component, Input, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    isReady = true;
    _dataFlow: any = {};
    @Input() set dataFlow(value: any) {
        this._dataFlow = JSON.parse(value);
        console.log('DATA FLOW', this._dataFlow)
        this.isReady = false;
        this.cdr.detectChanges();
        requestAnimationFrame(() => {
            this.isReady = true;
            this.cdr.detectChanges();
        });
    }
    constructor(private cdr: ChangeDetectorRef) {

        console.log('DATA FLOW', this._dataFlow)

    }
    /*{
        actors: [
            {
                id: 'A',
                displayedTitle: 'some A-letter'
            }
        ],
        data: [{
            messageID: 1,
            source: 'A',
            destination: 'B',
        },
        {
            messageID: 'some unique Id as string 1',
            title: 'Title',
            subTitle: 'subTitle',
            aboveArrow: 'aboveArrow',
            belowArrow: 'belowArrow',
            source: 'B',
            destination: 'C',
        },
        {
            messageID: 'some unique Id as string 2',
            source: 'C',
            destination: 'B',
            sourceLabel: 'S L',
            destinationLabel: 'D L'
        },
        {
            messageID: 'some unique Id as string 3',
            source: 'B',
            destination: 'B',
        },
        {
            messageID: 'some unique Id as string 4',
            source: 'C',
            destination: 'C',
        },
        {
            messageID: 'some unique Id as string 5',
            source: 'B',
            destination: 'C',
        },
        {
            messageID: 'YYYYYTY',
            source: 'B',
            destination: 'YYYYYTY',
        },
        {
            messageID: 'some unique Id as string 6',
            source: 'C',
            destination: 'A',
        },
        ]
    } */;

    title = 'test-lib-flow';
}
