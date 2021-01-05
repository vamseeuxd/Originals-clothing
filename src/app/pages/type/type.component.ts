import {Component, OnInit} from '@angular/core';
import {TypeService, IType} from './service/type.service';
import {ToastrService} from 'ngx-toastr';

export interface TypeInterface {
  name: string,
  deleted: boolean;
  createdOn: {
    "seconds": number,
    "nanoseconds": number
  }
}

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent {

  moduleName = 'Type';
  newName = '';
  itemToEdit: IType = null;

  constructor(
    public service: TypeService,
    private toastr: ToastrService,
  ) {
  }

  addType() {
    if (this.newName.trim().length >= 3) {
      this.service.addType({name: this.newName}).then(value => {
        this.newName = '';
        this.toastr.success(`New ${this.moduleName} Added Successfully`, 'Added Successfully');
      }, reason => {
        this.toastr.error(`Error while adding New ${this.moduleName}, Please try again`, `Error while adding Type ${this.moduleName}`);
      })
    }
  }

  deleteType(type: IType) {
    const isConfirmed = confirm('Are you sure do you want to delete Type?');
    if (isConfirmed) {
      this.service.deleteType(type).then(value => {
        this.newName = '';
        this.toastr.success('New Type deleted Successfully', 'Delete Successfully');
      }, reason => {
        this.toastr.error('Error while deleting New Type, Please try again', 'Error while deleting Type');
      })
    }
  }

  updateType(typeToUpdateInput: HTMLInputElement) {
    const isConfirmed = confirm('Are you sure do you want to save Changes?');
    if (isConfirmed) {
      this.service.updateType({name: typeToUpdateInput.value, id: this.itemToEdit.id}).then(value => {
        this.newName = '';
        this.toastr.success('New Type updated Successfully', 'Update Successfully');
        this.itemToEdit = null;
      }, reason => {
        this.toastr.error('Error while updating New Type, Please try again', 'Error while updating Type');
      })
    }
  }

}
