import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private layoutVisibility = new BehaviorSubject<boolean>(true);
  showLayout$ = this.layoutVisibility.asObservable();

  constructor() { }

  setLayout(show: boolean) {
    this.layoutVisibility.next(show);
  }
}
