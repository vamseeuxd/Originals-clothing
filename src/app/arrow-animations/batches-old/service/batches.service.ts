import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore'
import {BusyIndicatorService} from '../../../components/busy-indicator/busy-indicator.service';
import firebase from 'firebase';
import {UsersService} from '../../../pages/users/service/users.service';

export interface IBatch {
  name: string
  id?: string
  demoDate: string
  startDate: string
  endDate: string
  durationInHours: number
  timings: string
  deleted?: boolean
  createdOn?: string
  updatedOn?: string
  createdBy?: string
  updatedBy?: string
}

@Injectable({
  providedIn: 'root',
})
export class BatchesService {
  private batchesAction: AngularFirestoreCollection<IBatch>
  readonly batches$: Observable<IBatch[]>
  private activeUser: string

  constructor(
    firestore: AngularFirestore,
    private usersService: UsersService,
    public busyIndicator: BusyIndicatorService
  ) {
    this.batchesAction = firestore.collection<IBatch>('batches')
    this.batches$ = firestore
      .collection<IBatch>('batches', (ref) => {
        return ref.where('deleted', '==', false).orderBy('createdOn')
      })
      .valueChanges()
    this.usersService.activeUser$.subscribe((activeUser) => {
      this.activeUser = activeUser
    })
  }

  addBatch(batch: IBatch): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (batch.name.trim().length > 0) {
        const busyIndicatorId = this.busyIndicator.show()
        const docRef = this.batchesAction.ref.doc();
        const name = batch.name.trim();
        const demoDate = batch.demoDate.trim();
        const startDate = batch.startDate.trim();
        const endDate = batch.endDate.trim();
        const durationInHours = batch.durationInHours;
        const timings = batch.timings.trim();
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
            demoDate,
            startDate,
            endDate,
            durationInHours,
            timings,
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

  updateBatch(batch: IBatch): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (batch.name.trim().length > 0) {
        const busyIndicatorId = this.busyIndicator.show()
        const docRef = this.batchesAction.doc(batch.id).ref
        const name = batch.name.trim()
        const demoDate = batch.demoDate.trim();
        const startDate = batch.startDate.trim();
        const endDate = batch.endDate.trim();
        const durationInHours = batch.durationInHours;
        const timings = batch.timings.trim();
        const updatedOn = this.getServerTime()
        const updatedBy = this.activeUser
        try {
          await docRef.update({
            name,
            demoDate,
            startDate,
            endDate,
            durationInHours,
            timings,
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

  deleteBatch(batch: IBatch): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const busyIndicatorId = this.busyIndicator.show()
      try {
        const docRef = await this.batchesAction.doc(batch.id)
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

  getBatches(): Observable<IBatch[]> {
    return this.batches$
  }

  getServerTime(): any {
    return firebase.firestore.Timestamp.now().seconds * 1000
  }
}
