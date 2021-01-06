import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore'
import {UsersService} from '../../users/service/users.service'
import {BusyIndicatorService} from '../../../components/busy-indicator/busy-indicator.service';
import firebase from 'firebase';

export interface IType {
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
export class TypeService {
  private typesAction: AngularFirestoreCollection<IType>
  readonly types$: Observable<IType[]>
  private activeUser: string

  constructor(
    firestore: AngularFirestore,
    private usersService: UsersService,
    public busyIndicator: BusyIndicatorService
  ) {
    this.typesAction = firestore.collection<IType>('types')
    this.types$ = firestore
      .collection<IType>('types', (ref) => {
        return ref.where('deleted', '==', false).orderBy('createdOn')
      })
      .valueChanges()
    this.usersService.activeUser$.subscribe((activeUser) => {
      this.activeUser = activeUser
    })
  }

  addType(type: IType): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (type.name.trim().length > 0) {
        const busyIndicatorId = this.busyIndicator.show()
        const docRef = this.typesAction.ref.doc()
        const name = type.name.trim()
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

  updateType(type: IType): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (type.name.trim().length > 0) {
        const busyIndicatorId = this.busyIndicator.show()
        const docRef = this.typesAction.doc(type.id).ref
        const name = type.name.trim()
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

  deleteType(type: IType): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const busyIndicatorId = this.busyIndicator.show()
      try {
        const docRef = await this.typesAction.doc(type.id)
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

  getTypes(): Observable<IType[]> {
    return this.types$
  }

  getServerTime(): any {
    return firebase.firestore.Timestamp.now().seconds * 1000
  }
}
