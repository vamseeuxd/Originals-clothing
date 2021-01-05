import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  activeUserAction: BehaviorSubject<string> = new BehaviorSubject<string>(
    'Vamsee Kalyan'
  )
  activeUser$: Observable<string> = this.activeUserAction.asObservable()

  constructor() {}
}
