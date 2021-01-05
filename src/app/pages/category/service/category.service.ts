import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {UsersService} from '../../users/service/users.service';
import {BusyIndicatorService} from '../../../components/busy-indicator/busy-indicator.service';
import firebase from 'firebase';

export interface ICategory {
  name: string;
  id?: string;
  deleted?: boolean;
  createdOn?: string;
  updatedOn?: string;
  createdBy?: string;
  updatedBy?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private CategorysAction: AngularFirestoreCollection<ICategory>;
  readonly Categorys$: Observable<ICategory[]>;
  private activeUser: string;
  private CategorysAction: any;

  constructor(
    firestore: AngularFirestore,
    private usersService: UsersService,
    public busyIndicator: BusyIndicatorService
  ) {
    this.CategorysAction = firestore.collection<ICategory>('Categorys');
    this.Categorys$ = firestore
      .collection<ICategory>('Categorys', (ref) => {
        return ref.where('deleted', '==', false).orderBy('createdOn');
      })
      .valueChanges();
    this.usersService.activeUser$.subscribe((activeUser) => {
      this.activeUser = activeUser;
    });
  }

  addCategory(Category: ICategory): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (Category.name.trim().length > 0) {
        const busyIndicatorId = this.busyIndicator.show();
        const docRef = this.CategorysAction.ref.doc();
        const name = Category.name.trim();
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
          });
          this.busyIndicator.hide(busyIndicatorId);
          resolve(id);
        } catch (e) {
          this.busyIndicator.hide(busyIndicatorId);
          reject(e);
        }
      }
    });
  }

  updateCategory(Category: ICategory): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (Category.name.trim().length > 0) {
        const busyIndicatorId = this.busyIndicator.show();
        const docRef = this.CategorysAction.doc(Category.id).ref;
        const name = Category.name.trim();
        const updatedOn = this.getServerTime();
        const updatedBy = this.activeUser;
        try {
          await docRef.update({name, updatedOn, updatedBy});
          resolve(docRef.id);
          this.busyIndicator.hide(busyIndicatorId);
        } catch (e) {
          this.busyIndicator.hide(busyIndicatorId);
          reject(e);
        }
      }
    });
  }

  deleteCategory(Category: ICategory): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const busyIndicatorId = this.busyIndicator.show();
      try {
        const docRef = await this.CategorysAction.doc(Category.id);
        const doc = await docRef.get().toPromise();
        const updatedOn = this.getServerTime();
        const updatedBy = this.activeUser;
        await docRef.set({
          ...doc.data(),
          deleted: true,
          updatedOn,
          updatedBy,
        });
        resolve(doc.id);
        this.busyIndicator.hide(busyIndicatorId);
      } catch (e) {
        this.busyIndicator.hide(busyIndicatorId);
        reject(e);
      }
    });
  }

  getCategorys(): Observable<ICategory[]> {
    return this.Categorys$;
  }

  getServerTime(): any {
    return firebase.firestore.Timestamp.now().seconds * 1000;
  }
}
