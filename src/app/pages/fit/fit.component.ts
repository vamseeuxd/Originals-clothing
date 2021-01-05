import {Component, OnInit} from '@angular/core';
import {FitService, IFit} from './service/fit.service';
import {ToastrService} from 'ngx-toastr';

export interface FitInterface {
  name: string,
  deleted: boolean;
  createdOn: {
    "seconds": number,
    "nanoseconds": number
  }
}

@Component({
  selector: 'app-fit',
  templateUrl: './fit.component.html',
  styleUrls: ['./fit.component.scss']
})
export class FitComponent  {

  moduleName = 'Fit';
  newName = '';
  itemToEdit: IFit = null;

  constructor(
    public service: FitService,
    private toastr: ToastrService,
  ) {
  }

  addFit() {
    if (this.newName.trim().length >= 3) {
      this.service.addFit({name: this.newName}).then(value => {
        this.newName = '';
        this.toastr.success(`New ${this.moduleName} Added Successfully`, 'Added Successfully');
      }, reason => {
        this.toastr.error(`Error while adding New ${this.moduleName}, Please try again`, `Error while adding Fit ${this.moduleName}`);
      })
    }
  }

  deleteFit(fit: IFit) {
    const isConfirmed = confirm('Are you sure do you want to delete Fit?');
    if (isConfirmed) {
      this.service.deleteFit(fit).then(value => {
        this.newName = '';
        this.toastr.success('New Fit deleted Successfully', 'Delete Successfully');
      }, reason => {
        this.toastr.error('Error while deleting New Fit, Please try again', 'Error while deleting Fit');
      })
    }
  }

  updateFit(fitToUpdateInput: HTMLInputElement) {
    const isConfirmed = confirm('Are you sure do you want to save Changes?');
    if (isConfirmed) {
      this.service.updateFit({name: fitToUpdateInput.value, id: this.itemToEdit.id}).then(value => {
        this.newName = '';
        this.toastr.success('New Fit updated Successfully', 'Update Successfully');
        this.itemToEdit = null;
      }, reason => {
        this.toastr.error('Error while updating New Fit, Please try again', 'Error while updating Fit');
      })
    }
  }

}
