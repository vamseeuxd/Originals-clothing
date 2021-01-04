import {Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export interface BrandInterface {
  name: string,
  deleted: boolean;
  createdOn: {
    "seconds": number,
    "nanoseconds": number
  }
}

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {
  newBrandName = '';

  private brandCollection: AngularFirestoreCollection<BrandInterface>;
  brands$: Observable<BrandInterface[]>;

  constructor(private readonly afs: AngularFirestore) {
    this.brandCollection = afs.collection<BrandInterface>('brand');
    this.brands$ = this.brandCollection.stateChanges(['added']).pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as BrandInterface;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
  }

  ngOnInit(): void {
  }

  addNewBrandToList(name: string) {
    if (name.trim().length > 2) {
      this.brandCollection.add({name, createdOn: {seconds: 0, nanoseconds: 0}, deleted: false});
      this.newBrandName = '';
    }
  }
}
