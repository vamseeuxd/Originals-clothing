import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore'
import {UsersService} from '../../users/service/users.service'
import {BusyIndicatorService} from '../../../components/busy-indicator/busy-indicator.service';
import firebase from 'firebase';

export interface IFit {
  name: string
  id?: string
  deleted?: boolean
  createdOn?: string
  updatedOn?: string
  createdBy?: string
  updatedBy?: string
}

@Injectable({
  providedIn: 'root',
})
export class FitService {
  private fitsAction: AngularFirestoreCollection<IFit>
  readonly fits$: Observable<IFit[]>
  private activeUser: string

  constructor(
    firestore: AngularFirestore,
    private usersService: UsersService,
    public busyIndicator: BusyIndicatorService
  ) {
    this.fitsAction = firestore.collection<IFit>('fits')
    this.fits$ = firestore
      .collection<IFit>('fits', (ref) => {
        return ref.where('deleted', '==', false).orderBy('createdOn')
      })
      .valueChanges()
    this.usersService.activeUser$.subscribe((activeUser) => {
      this.activeUser = activeUser
    })
  }

  addFit(fit: IFit): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (fit.name.trim().length > 0) {
        const busyIndicatorId = this.busyIndicator.show()
        const docRef = this.fitsAction.ref.doc()
        const name = fit.name.trim()
        const id = docRef.id
        const deleted = false
        const createdOn = this.getServerTime()
        const updatedOn = this.getServerTime()
        const createdBy = this.activeUser
        const updatedBy = this.activeUser
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

  updateFit(fit: IFit): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (fit.name.trim().length > 0) {
        const busyIndicatorId = this.busyIndicator.show()
        const docRef = this.fitsAction.doc(fit.id).ref
        const name = fit.name.trim()
        const updatedOn = this.getServerTime()
        const updatedBy = this.activeUser
        try {
          await docRef.update({name, updatedOn, updatedBy})
          resolve(docRef.id)
          this.busyIndicator.hide(busyIndicatorId)
        } catch (e) {
          this.busyIndicator.hide(busyIndicatorId)
          reject(e)
        }
      }
    })
  }

  deleteFit(fit: IFit): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const busyIndicatorId = this.busyIndicator.show()
      try {
        const docRef = await this.fitsAction.doc(fit.id)
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

  getFits(): Observable<IFit[]> {
    return this.fits$
  }

  getServerTime(): any {
    return firebase.firestore.Timestamp.now().seconds * 1000
  }
}
