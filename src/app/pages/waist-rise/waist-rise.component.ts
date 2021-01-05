import {Component, OnInit} from '@angular/core';
import {WaistriseService, IWaistrise} from './service/waist-rise.service';
import {ToastrService} from 'ngx-toastr';

export interface WaistriseInterface {
  name: string,
  deleted: boolean;
  createdOn: {
    "seconds": number,
    "nanoseconds": number
  }
}

@Component({
  selector: 'app-waist-rise',
  templateUrl: './waist-rise.component.html',
  styleUrls: ['./waist-rise.component.scss']
})
export class WaistRiseComponent  {
  moduleName = 'Waistrise';
  newName = '';
  itemToEdit: IWaistrise = null;

  constructor(
    public service: WaistriseService,
    private toastr: ToastrService,
  ) {
  }

  addWaistrise() {
    if (this.newName.trim().length >= 3) {
      this.service.addWaistrise({name: this.newName}).then(value => {
        this.newName = '';
        this.toastr.success(`New ${this.moduleName} Added Successfully`, 'Added Successfully');
      }, reason => {
        this.toastr.error(`Error while adding New ${this.moduleName}, Please try again`, `Error while adding Waistrise ${this.moduleName}`);
      })
    }
  }

  deleteWaistrise(waistrise: IWaistrise) {
    const isConfirmed = confirm('Are you sure do you want to delete Waistrise?');
    if (isConfirmed) {
      this.service.deleteWaistrise(waistrise).then(value => {
        this.newName = '';
        this.toastr.success('New Waistrise deleted Successfully', 'Delete Successfully');
      }, reason => {
        this.toastr.error('Error while deleting New Waistrise, Please try again', 'Error while deleting Waistrise');
      })
    }
  }

  updateWaistrise(waistriseToUpdateInput: HTMLInputElement) {
    const isConfirmed = confirm('Are you sure do you want to save Changes?');
    if (isConfirmed) {
      this.service.updateWaistrise({name: waistriseToUpdateInput.value, id: this.itemToEdit.id}).then(value => {
        this.newName = '';
        this.toastr.success('New Waistrise updated Successfully', 'Update Successfully');
        this.itemToEdit = null;
      }, reason => {
        this.toastr.error('Error while updating New Waistrise, Please try again', 'Error while updating Waistrise');
      })
    }
  }

}
