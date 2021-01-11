import {Injectable} from '@angular/core'
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs'
import {AngularFirestore, AngularFirestoreCollection,} from '@angular/fire/firestore'
import {BusyIndicatorService} from '../../../components/busy-indicator/busy-indicator.service';
import firebase from 'firebase';
import {UsersService} from '../../../pages/users/service/users.service';
import {IStudent, ModuleConfig} from '../ModuleConfig';
import {map, mergeMap, shareReplay, switchMap, tap} from 'rxjs/operators';
import {IBatch, IBatchStudent} from '../../batches/ModuleConfig';

@Injectable({
  providedIn: 'root',
})
export class Service {
  private action: AngularFirestoreCollection<IStudent>
  private data$: Observable<IStudent[]>
  private activeUser: string;

  private selectedItemId = '1BTyLyzxuGgGF58CejlN';
  private selectedItemId$ = new BehaviorSubject<string>(this.selectedItemId);
  private selectedStudentBusyIndicatorId: number;

  private batchesAction: AngularFirestoreCollection<IBatchStudent>;
  private selectedBatches$: Observable<IBatch[]>;

  constructor(
    private firestore: AngularFirestore,
    private usersService: UsersService,
    public busyIndicator: BusyIndicatorService
  ) {

    this.studentDataInit();
    this.batchDataInit();
  }



  studentDataInit() {
    this.action = this.firestore.collection<IStudent>(ModuleConfig.name_lowercase_plural)
    this.data$ = this.firestore.collection<IStudent>(ModuleConfig.name_lowercase_plural, (ref) => {
        return ref.where('deleted', '==', false).orderBy('createdOn')
      }).valueChanges()
    this.usersService.activeUser$.subscribe((activeUser) => {
      this.activeUser = activeUser
    })
  }

  batchDataInit() {
    this.batchesAction = this.firestore.collection<IBatchStudent>('batches-students');
    this.selectedBatches$ = this.selectedItemId$.pipe(
      switchMap(selectedStudent => {
          return this.firestore.collection<IBatchStudent>(
            'batches-students',
            ref =>
              ref
                .where('deleted', '==', false)
                .where('studentId', '==', selectedStudent)
                .orderBy('createdOn')
          ).valueChanges().pipe(mergeMap(value => {
              if (value.length === 0) {
                return of([])
              }
              return combineLatest(value.map(
                value1 => {
                  return this.firestore.doc<IBatch>(`batches/${value1.batchId}`).valueChanges().pipe(
                    switchMap(
                      value2 => {
                        value2['batches-students'] = value1.id;
                        return of(value2);
                      }
                    )
                  )
                }
              ));
            })
          )
        }
      ),
      tap(x => {
        if (this.selectedStudentBusyIndicatorId) {
          this.busyIndicator.hide(this.selectedStudentBusyIndicatorId);
        }
      })
    ).pipe(shareReplay())
  }

  addData(data: IStudent): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (data.name.trim().length > 0) {
        const busyIndicatorId = this.busyIndicator.show()
        const docRef = this.action.ref.doc();
        const name = data.name.trim();
        const mobile = data.mobile.trim();
        const email = data.email.trim();
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
            mobile,
            email,
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

  updateData(data: IStudent): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (data.name.trim().length > 0) {
        const busyIndicatorId = this.busyIndicator.show()
        const docRef = this.action.doc(data.id).ref
        const name = data.name.trim()
        const email = data.email.trim()
        const mobile = data.mobile.trim()
        const updatedOn = this.getServerTime()
        const updatedBy = this.activeUser
        try {
          await docRef.update({
            name,
            email,
            mobile,
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

  deleteData(data: IStudent): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (data.name.trim().length > 0) {
        const busyIndicatorId = this.busyIndicator.show()
        const docRef = this.action.doc(data.id).ref
        const updatedOn = this.getServerTime()
        const updatedBy = this.activeUser
        try {
          await docRef.update({
            deleted: true,
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

  getData(): Observable<IStudent[]> {
    return this.data$
  }

  getServerTime(): any {
    return firebase.firestore.Timestamp.now().seconds * 1000
  }


  getSelectedItemId(): Observable<string> {
    return this.selectedItemId$.pipe(
      map(x => x ? x : 'none')
    )
  }

  setSelectedItem(studentId) {
    if (this.selectedItemId !== studentId) {
      if (studentId) {
        this.selectedStudentBusyIndicatorId = this.busyIndicator.show();
        this.selectedItemId = studentId;
        this.selectedItemId$.next(this.selectedItemId);
      } else {
        this.selectedItemId = studentId;
        this.selectedItemId$.next(this.selectedItemId);
      }
    }
  }

  getSelectedBatches(): Observable<IBatch[]> {
    return this.selectedBatches$.pipe(
      map(x => x ? x : [])
    )
  }
}
