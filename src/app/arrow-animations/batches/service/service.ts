import {Injectable} from '@angular/core'
import {BehaviorSubject, combineLatest, Observable, of, Subject} from 'rxjs'
import {AngularFirestore, AngularFirestoreCollection,} from '@angular/fire/firestore'
import {BusyIndicatorService} from '../../../components/busy-indicator/busy-indicator.service';
import firebase from 'firebase';
import {UsersService} from '../../../pages/users/service/users.service';
import {IBatch, IBatchStudent, IBatchTechnology, ModuleConfig} from '../ModuleConfig';
import {leftJoin, mapRelationalData} from '../../../components/utilities/collectionJoin';
import {map, mergeMap, shareReplay, switchMap, tap} from 'rxjs/operators';
import {ITechnology} from '../../technologies/ModuleConfig';
import {IStudent} from '../../students/ModuleConfig';

@Injectable({
  providedIn: 'root',
})
export class Service {
  private action: AngularFirestoreCollection<IBatch>;
  private data$: Observable<IBatch[]>;
  private selectedItemId = '';
  private selectedItemId$ = new BehaviorSubject<string>(this.selectedItemId);

  private technologiesAction: AngularFirestoreCollection<IBatchTechnology>;
  private selectedTechnologies$: Observable<ITechnology[]>;
  private selectedBatchBusyIndicatorId: number;

  private studentsAction: AngularFirestoreCollection<IBatchStudent>;
  private selectedStudents$: Observable<IStudent[]>;

  private activeUser: string;

  constructor(
    private firestore: AngularFirestore,
    private usersService: UsersService,
    public busyIndicator: BusyIndicatorService
  ) {

    this.userDataInit();
    this.batchDataInit();
    this.technologyDataInit();
    this.studentsDataInit();
  }

  userDataInit() {
    this.usersService.activeUser$.subscribe((activeUser) => {
      this.activeUser = activeUser
    });
  }

  batchDataInit() {
    this.action = this.firestore.collection<IBatch>(ModuleConfig.name_lowercase_plural);
    this.data$ = this.firestore.collection<IBatch>(ModuleConfig.name_lowercase_plural, (ref) => {
      return ref.where('deleted', '==', false).orderBy('createdOn')
    }).valueChanges().pipe(shareReplay())
  }

  technologyDataInit() {
    this.technologiesAction = this.firestore.collection<IBatchTechnology>('batches-technologies');
    this.selectedTechnologies$ = this.selectedItemId$.pipe(
      switchMap(selectedBatch => {
          return this.firestore.collection<IBatchTechnology>(
            'batches-technologies',
            ref =>
              ref
                .where('deleted', '==', false)
                .where('batchId', '==', selectedBatch)
                .orderBy('createdOn')
          ).valueChanges().pipe(mergeMap(value => {
              if (value.length === 0) {
                return of([])
              }
              return combineLatest(value.map(
                value1 => {
                  return this.firestore.doc<ITechnology>(`technologies/${value1.technologyId}`).valueChanges().pipe(
                    switchMap(
                      value2 => {
                        value2['batches-technologies'] = value1.id;
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
        if (this.selectedBatchBusyIndicatorId) {
          this.busyIndicator.hide(this.selectedBatchBusyIndicatorId);
        }
      })
    ).pipe(shareReplay())
  }

  studentsDataInit() {
    this.studentsAction = this.firestore.collection<IBatchStudent>('batches-students');
    this.selectedStudents$ = this.selectedItemId$.pipe(
      switchMap(selectedBatch => {
          return this.firestore.collection<IBatchStudent>(
            'batches-students',
            ref =>
              ref
                .where('deleted', '==', false)
                .where('batchId', '==', selectedBatch)
                .orderBy('createdOn')
          ).valueChanges().pipe(mergeMap(value => {
              if (value.length === 0) {
                return of([])
              }
              return combineLatest(value.map(
                value1 => {
                  return this.firestore.doc<IStudent>(`students/${value1.studentId}`).valueChanges().pipe(
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
        if (this.selectedBatchBusyIndicatorId) {
          this.busyIndicator.hide(this.selectedBatchBusyIndicatorId);
        }
      })
    ).pipe(shareReplay())
  }

  setSelectedItem(batchId) {
    if (this.selectedItemId !== batchId) {
      if (batchId) {
        this.selectedBatchBusyIndicatorId = this.busyIndicator.show();
        this.selectedItemId = batchId;
        this.selectedItemId$.next(this.selectedItemId);
      } else {
        this.selectedItemId = batchId;
        this.selectedItemId$.next(this.selectedItemId);
      }
    }
  }

  addData(data: IBatch): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (data.name.trim().length > 0) {
        const busyIndicatorId = this.busyIndicator.show()
        const docRef = this.action.ref.doc();
        const name = data.name.trim();
        const startDate = data.startDate.trim();
        const time = data.time.trim();
        const sunDay = data.sunDay;
        const monDay = data.monDay;
        const tuesDay = data.tuesDay;
        const wenDay = data.wenDay;
        const thuDay = data.thuDay;
        const friDay = data.friDay;
        const satDay = data.satDay;
        const fees = data.fees;
        const id = docRef.id;
        const deleted = false;
        const createdOn = this.getServerTime();
        const updatedOn = this.getServerTime();
        const createdBy = this.activeUser;
        const updatedBy = this.activeUser;
        try {
          await docRef.set({
            name,
            startDate,
            time,
            sunDay,
            monDay,
            tuesDay,
            wenDay,
            thuDay,
            friDay,
            satDay,
            fees,
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

  updateData(data: IBatch): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (data.name.trim().length > 0) {
        const busyIndicatorId = this.busyIndicator.show();
        const docRef = this.action.doc(data.id).ref;
        const name = data.name.trim();
        const startDate = data.startDate.trim();
        const time = data.time.trim();
        const sunDay = data.sunDay;
        const monDay = data.monDay;
        const tuesDay = data.tuesDay;
        const wenDay = data.wenDay;
        const thuDay = data.thuDay;
        const friDay = data.friDay;
        const satDay = data.satDay;
        const fees = data.fees;
        const updatedOn = this.getServerTime()
        const updatedBy = this.activeUser
        try {
          await docRef.update({
            name,
            time,
            sunDay,
            monDay,
            tuesDay,
            wenDay,
            thuDay,
            friDay,
            satDay,
            fees,
            startDate,
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

  deleteData(data: IBatch): Promise<any> {
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

  getData(): Observable<IBatch[]> {
    return this.data$
  }

  getSelectedItemId(): Observable<string> {
    return this.selectedItemId$.pipe(
      map(x => x ? x : 'none')
    )
  }

  getSelectedTechnologies(): Observable<ITechnology[]> {
    return this.selectedTechnologies$.pipe(
      map(x => x ? x : [])
    )
  }

  getSelectedStudent(): Observable<IStudent[]> {
    return this.selectedStudents$.pipe(
      map(x => x ? x : [])
    )
  }

  async addTechnologyToBatch(batchId: string, technologyId: string) {
    return new Promise(async (resolve, reject) => {
      const busyIndicatorId = this.busyIndicator.show();
      const docRef = this.technologiesAction.ref.doc();
      const id = docRef.id;
      const deleted = false;
      const createdOn = this.getServerTime();
      const updatedOn = this.getServerTime();
      const createdBy = this.activeUser;
      const updatedBy = this.activeUser;
      try {
        await docRef.set({
          batchId,
          technologyId,
          id,
          createdOn,
          updatedOn,
          createdBy,
          updatedBy,
          deleted,
        })
        this.busyIndicator.hide(busyIndicatorId);
        resolve(id);
      } catch (e) {
        this.busyIndicator.hide(busyIndicatorId);
        reject(e);
      }
    })
  }

  deleteTechnologyFromBatch(data: ITechnology): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (data.name.trim().length > 0) {
        const busyIndicatorId = this.busyIndicator.show()
        const docRef = this.technologiesAction.doc(data['batches-technologies']).ref
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
          debugger;
          reject(e)
        }
      }
    });
  }

  deleteStudentFromBatch(data: IStudent): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (data.name.trim().length > 0) {
        const busyIndicatorId = this.busyIndicator.show()
        const docRef = this.studentsAction.doc(data['batches-students']).ref
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
          debugger;
          reject(e)
        }
      }
    });
  }

  async addStudentToBatch(batchId: string, studentId: string) {
    return new Promise(async (resolve, reject) => {
      const busyIndicatorId = this.busyIndicator.show();
      const docRef = this.studentsAction.ref.doc();
      const id = docRef.id;
      const deleted = false;
      const createdOn = this.getServerTime();
      const updatedOn = this.getServerTime();
      const createdBy = this.activeUser;
      const updatedBy = this.activeUser;
      try {
        await docRef.set({
          batchId,
          studentId,
          id,
          createdOn,
          updatedOn,
          createdBy,
          updatedBy,
          deleted,
        })
        this.busyIndicator.hide(busyIndicatorId);
        resolve(id);
      } catch (e) {
        this.busyIndicator.hide(busyIndicatorId);
        reject(e);
      }
    })
  }

  getServerTime(): any {
    return firebase.firestore.Timestamp.now().seconds * 1000;
  }
}
