import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionFilterService {
  subject = new BehaviorSubject<any>({});
  backEventSubject = new BehaviorSubject<any>({});

  get listen(): Observable<any> {
    return this.subject.asObservable();
  }
  get event(): Observable<any> {
    return this.subject.asObservable();
  }
  emit(event: any): void {
    this.backEventSubject.next(event);
  }
  setFilter(filterData: any) {
    this.subject.next(filterData);
  }
}
