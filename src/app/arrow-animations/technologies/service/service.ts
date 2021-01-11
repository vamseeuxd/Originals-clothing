import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {AngularFirestore, AngularFirestoreCollection,} from '@angular/fire/firestore'
import {BusyIndicatorService} from '../../../components/busy-indicator/busy-indicator.service';
import firebase from 'firebase';
import {UsersService} from '../../../pages/users/service/users.service';
import {ITechnology, ModuleConfig} from '../ModuleConfig';
import {map, shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Service {
  private action: AngularFirestoreCollection<ITechnology>
  readonly data$: Observable<ITechnology[]>
  private activeUser: string;
  constructor(
    firestore: AngularFirestore,
    private usersService: UsersService,
    public busyIndicator: BusyIndicatorService
  ) {
    this.action = firestore.collection<ITechnology>(ModuleConfig.name_lowercase_plural)
    this.data$ = firestore
      .collection<ITechnology>(ModuleConfig.name_lowercase_plural, (ref) => {
        return ref.where('deleted', '==', false).orderBy('createdOn')
      })
      .valueChanges()
    this.usersService.activeUser$.subscribe((activeUser) => {
      this.activeUser = activeUser
    })
  }

  addData(data: ITechnology): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (data.name.trim().length > 0) {
        const busyIndicatorId = this.busyIndicator.show()
        const docRef = this.action.ref.doc();
        const name = data.name.trim();
        const id = docRef.id;
        const deleted = false;
        const createdOn = this.getServerTime();
        const updatedOn = this.getServerTime();
        const createdBy = this.activeUser;
        const updatedBy = this.activeUser;
        try {
          await docRef.set({
            name,
            id,
            createdOn,
            updatedOn,
            createdBy,
            updatedBy,
            deleted,
          })
          this.busyIndicator.hide(busyIndicatorId)
          resolve(id)
        } catch (e) {
          this.busyIndicator.hide(busyIndicatorId)
          reject(e)
        }
      }
    })
  }

  updateData(data: ITechnology): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (data.name.trim().length > 0) {
        const busyIndicatorId = this.busyIndicator.show()
        const docRef = this.action.doc(data.id).ref
        const name = data.name.trim()
        const updatedOn = this.getServerTime()
        const updatedBy = this.activeUser
        try {
          await docRef.update({
            name,
            updatedOn,
            updatedBy
          })
          resolve(docRef.id)
          this.busyIndicator.hide(busyIndicatorId)
        } catch (e) {
          this.busyIndicator.hide(busyIndicatorId)
          reject(e)
        }
      }
    })
  }

  deleteData(data: ITechnology): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const busyIndicatorId = this.busyIndicator.show()
      try {
        const docRef = await this.action.doc(data.id)
        const doc = await docRef.get().toPromise()
        const updatedOn = this.getServerTime()
        const updatedBy = this.activeUser
        await docRef.set({
          ...doc.data(),
          deleted: true,
          updatedOn,
          updatedBy,
        })
        resolve(doc.id)
        this.busyIndicator.hide(busyIndicatorId)
      } catch (e) {
        this.busyIndicator.hide(busyIndicatorId)
        reject(e)
      }
    })
  }

  getData(): Observable<ITechnology[]> {
    return this.data$;
  }

  getServerTime(): any {
    return firebase.firestore.Timestamp.now().seconds * 1000
  }
}
