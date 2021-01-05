import {Component, OnInit} from '@angular/core';
import {SizeService, ISize} from './service/size.service';
import {ToastrService} from 'ngx-toastr';

export interface SizeInterface {
  name: string,
  deleted: boolean;
  createdOn: {
    "seconds": number,
    "nanoseconds": number
  }
}

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.scss']
})
export class SizeComponent  {

  moduleName = 'Size';
  newName = '';
  itemToEdit: ISize = null;

  constructor(
    public service: SizeService,
    private toastr: ToastrService,
  ) {
  }

  addSize() {
    if (this.newName.trim().length >= 3) {
      this.service.addSize({name: this.newName}).then(value => {
        this.newName = '';
        this.toastr.success(`New ${this.moduleName} Added Successfully`, 'Added Successfully');
      }, reason => {
        this.toastr.error(`Error while adding New ${this.moduleName}, Please try again`, `Error while adding Size ${this.moduleName}`);
      })
    }
  }

  deleteSize(size: ISize) {
    const isConfirmed = confirm('Are you sure do you want to delete Size?');
    if (isConfirmed) {
      this.service.deleteSize(size).then(value => {
        this.newName = '';
        this.toastr.success('New Size deleted Successfully', 'Delete Successfully');
      }, reason => {
        this.toastr.error('Error while deleting New Size, Please try again', 'Error while deleting Size');
      })
    }
  }

  updateSize(sizeToUpdateInput: HTMLInputElement) {
    const isConfirmed = confirm('Are you sure do you want to save Changes?');
    if (isConfirmed) {
      this.service.updateSize({name: sizeToUpdateInput.value, id: this.itemToEdit.id}).then(value => {
        this.newName = '';
        this.toastr.success('New Size updated Successfully', 'Update Successfully');
        this.itemToEdit = null;
      }, reason => {
        this.toastr.error('Error while updating New Size, Please try again', 'Error while updating Size');
      })
    }
  }
}
