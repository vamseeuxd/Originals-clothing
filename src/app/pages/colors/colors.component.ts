import {Component, OnInit} from '@angular/core';
import {ColorsService, IColors} from './service/colors.service';
import {ToastrService} from 'ngx-toastr';

export interface ColorsInterface {
  name: string,
  deleted: boolean;
  createdOn: {
    "seconds": number,
    "nanoseconds": number
  }
}

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})
export class ColorsComponent  {

  moduleName = 'Colors';
  newName = '';
  itemToEdit: IColors = null;

  constructor(
    public service: ColorsService,
    private toastr: ToastrService,
  ) {
  }

  addColors() {
    if (this.newName.trim().length >= 3) {
      this.service.addColors({name: this.newName}).then(value => {
        this.newName = '';
        this.toastr.success(`New ${this.moduleName} Added Successfully`, 'Added Successfully');
      }, reason => {
        this.toastr.error(`Error while adding New ${this.moduleName}, Please try again`, `Error while adding Colors ${this.moduleName}`);
      })
    }
  }

  deleteColors(colors: IColors) {
    const isConfirmed = confirm('Are you sure do you want to delete Colors?');
    if (isConfirmed) {
      this.service.deleteColors(colors).then(value => {
        this.newName = '';
        this.toastr.success('New Colors deleted Successfully', 'Delete Successfully');
      }, reason => {
        this.toastr.error('Error while deleting New Colors, Please try again', 'Error while deleting Colors');
      })
    }
  }

  updateColors(colorsToUpdateInput: HTMLInputElement) {
    const isConfirmed = confirm('Are you sure do you want to save Changes?');
    if (isConfirmed) {
      this.service.updateColors({name: colorsToUpdateInput.value, id: this.itemToEdit.id}).then(value => {
        this.newName = '';
        this.toastr.success('New Colors updated Successfully', 'Update Successfully');
        this.itemToEdit = null;
      }, reason => {
        this.toastr.error('Error while updating New Colors, Please try again', 'Error while updating Colors');
      })
    }
  }

}
