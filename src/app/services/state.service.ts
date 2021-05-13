import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  public user: Object;
  public player: Object;

  public gameSettings = new BehaviorSubject<any>([]);
}
