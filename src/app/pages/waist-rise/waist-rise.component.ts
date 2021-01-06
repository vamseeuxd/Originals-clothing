import {Component, OnInit} from '@angular/core';
import {WaistRiseService, IWaistRise} from './service/waist-rise.service';
import {ToastrService} from 'ngx-toastr';
@Component({
  selector: 'app-waist-rise',
  templateUrl: './waist-rise.component.html',
  styleUrls: ['./waist-rise.component.scss']
})
export class WaistRiseComponent  {
  moduleName = 'WaistRise';
  newName = '';
  itemToEdit: IWaistRise = null;

  constructor(
    public service: WaistRiseService,
    private toastr: ToastrService,
  ) {
  }

  addWaistRise() {
    if (this.newName.trim().length >= 3) {
      this.service.addWaistRise({name: this.newName}).then(value => {
        this.newName = '';
        this.toastr.success(`New ${this.moduleName} Added Successfully`, 'Added Successfully');
      }, reason => {
        this.toastr.error(`Error while adding New ${this.moduleName}, Please try again`, `Error while adding WaistRise ${this.moduleName}`);
      })
    }
  }

  deleteWaistRise(waistRise: IWaistRise) {
    const isConfirmed = confirm('Are you sure do you want to delete WaistRise?');
    if (isConfirmed) {
      this.service.deleteWaistRise(waistRise).then(value => {
        this.newName = '';
        this.toastr.success('New WaistRise deleted Successfully', 'Delete Successfully');
      }, reason => {
        this.toastr.error('Error while deleting New WaistRise, Please try again', 'Error while deleting WaistRise');
      })
    }
  }

  updateWaistRise(waistRiseToUpdateInput: HTMLInputElement) {
    const isConfirmed = confirm('Are you sure do you want to save Changes?');
    if (isConfirmed) {
      this.service.updateWaistRise({name: waistRiseToUpdateInput.value, id: this.itemToEdit.id}).then(value => {
        this.newName = '';
        this.toastr.success('New WaistRise updated Successfully', 'Update Successfully');
        this.itemToEdit = null;
      }, (reason: any) => {
        this.toastr.error('Error while updating New WaistRise, Please try again', 'Error while updating WaistRise');
      })
    }
  }

}
