import {
    AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input,
    Output
} from '@angular/core';
import { MOSColorGradient } from '../../helpers/functions';

@Component({
  selector: 'app-flow-item',
  templateUrl: './flow-item.component.html',
  styleUrls: ['./flow-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowItemComponent implements AfterViewChecked {
  _item: any = {};
  @Input() set item(val: any) {
    this._item = val;
  }
  get item(): any {
    return this._item;
  }
  @Input() isSimplify = true;
  @Input() isGroupByAlias = false;
  @Input() idx = 0;
  @Input() isAbsolute: boolean = false;
  @Output() itemClick: EventEmitter<any> = new EventEmitter();

  constructor(private cdr: ChangeDetectorRef) { }

  onClickItem(idx: any, event: any) {
    this.itemClick.emit({ idx, event });
  }

  MOSColorGradientLocal(hue: any) {
    return MOSColorGradient(hue * 100, 80, 50);
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
}
