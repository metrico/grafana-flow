import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    isReady = true;
    _dataFlow: any = {};
    isDarkTheme = false;
    @Input() set dataFlow(value: any) {
        this._dataFlow = JSON.parse(value);
        this.isReady = false;
        this.cdr.detectChanges();
        requestAnimationFrame(() => {
            this.isReady = true;
            this.cdr.detectChanges();
        });
    }

    @Input() set theme(val: any) {
        this.isDarkTheme = val === "Dark";
        requestAnimationFrame(() => {
            this.cdr.detectChanges();
        });

    }
    constructor(private cdr: ChangeDetectorRef) {
        // console.log('DATA FLOW', this._dataFlow)
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
