import {Injectable} from '@angular/core'
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs'
import {AngularFirestore, AngularFirestoreCollection,} from '@angular/fire/firestore'
import {BusyIndicatorService} from '../../../components/busy-indicator/busy-indicator.service';
import firebase from 'firebase';
import {UsersService} from '../../../pages/users/service/users.service';
import {ITechnology, ModuleConfig} from '../ModuleConfig';
import {map, mergeMap, shareReplay, switchMap, tap} from 'rxjs/operators';
import {IBatch, IBatchTechnology} from '../../batches/ModuleConfig';

@Injectable({
  providedIn: 'root',
})
export class Service {
  private action: AngularFirestoreCollection<ITechnology>
  private data$: Observable<ITechnology[]>
  private activeUser: string;


  private selectedItemId = '1BTyLyzxuGgGF58CejlN';
  private selectedItemId$ = new BehaviorSubject<string>(this.selectedItemId);
  private selectedTechnologiesBusyIndicatorId: number;

  private batchesAction: AngularFirestoreCollection<IBatchTechnology>;
  private selectedBatches$: Observable<IBatch[]>;


  constructor(
    private firestore: AngularFirestore,
    private usersService: UsersService,
    public busyIndicator: BusyIndicatorService
  ) {
    this.technologyDataInit();
    this.batchDataInit();
  }

  technologyDataInit() {
    this.action = this.firestore.collection<ITechnology>(ModuleConfig.name_lowercase_plural);
    this.data$ = this.firestore
      .collection<ITechnology>(ModuleConfig.name_lowercase_plural, (ref) => {
        return ref.where('deleted', '==', false).orderBy('createdOn')
      })
      .valueChanges();
    this.usersService.activeUser$.subscribe((activeUser) => {
      this.activeUser = activeUser
    });
  }

  batchDataInit() {
    this.batchesAction = this.firestore.collection<IBatchTechnology>('batches-technologies');
    this.selectedBatches$ = this.selectedItemId$.pipe(
      switchMap(selectedTechnology => {
          return this.firestore.collection<IBatchTechnology>(
            'batches-technologies',
            ref =>
              ref
                .where('deleted', '==', false)
                .where('technologyId', '==', selectedTechnology)
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
        if (this.selectedTechnologiesBusyIndicatorId) {
          this.busyIndicator.hide(this.selectedTechnologiesBusyIndicatorId);
        }
      })
    ).pipe(shareReplay())
  }

  getSelectedBatches(): Observable<IBatch[]> {
    return this.selectedBatches$.pipe(
      map(x => x ? x : [])
    )
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


  getSelectedItemId(): Observable<string> {
    return this.selectedItemId$.pipe(
      map(x => x ? x : 'none')
    )
  }

  setSelectedItem(technologyId) {
    if (this.selectedItemId !== technologyId) {
      if (technologyId) {
        this.selectedTechnologiesBusyIndicatorId = this.busyIndicator.show();
        this.selectedItemId = technologyId;
        this.selectedItemId$.next(this.selectedItemId);
      } else {
        this.selectedItemId = technologyId;
        this.selectedItemId$.next(this.selectedItemId);
      }
    }
  }
}
