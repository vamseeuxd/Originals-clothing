import {Component, OnInit} from '@angular/core';
import {SleeveService, ISleeve} from './service/sleeve.service';
import {ToastrService} from 'ngx-toastr';
@Component({
  selector: 'app-sleeve',
  templateUrl: './sleeve.component.html',
  styleUrls: ['./sleeve.component.scss']
})
export class SleeveComponent  {

  moduleName = 'Sleeve';
  newName = '';
  itemToEdit: ISleeve = null;

  constructor(
    public service: SleeveService,
    private toastr: ToastrService,
  ) {
  }

  addSleeve() {
    if (this.newName.trim().length >= 3) {
      this.service.addSleeve({name: this.newName}).then(value => {
        this.newName = '';
        this.toastr.success(`New ${this.moduleName} Added Successfully`, 'Added Successfully');
      }, reason => {
        this.toastr.error(`Error while adding New ${this.moduleName}, Please try again`, `Error while adding Sleeve ${this.moduleName}`);
      })
    }
  }

  deleteSleeve(sleeve: ISleeve) {
    const isConfirmed = confirm('Are you sure do you want to delete Sleeve?');
    if (isConfirmed) {
      this.service.deleteSleeve(sleeve).then(value => {
        this.newName = '';
        this.toastr.success('New Sleeve deleted Successfully', 'Delete Successfully');
      }, reason => {
        this.toastr.error('Error while deleting New Sleeve, Please try again', 'Error while deleting Sleeve');
      })
    }
  }

  updateSleeve(sleeveToUpdateInput: HTMLInputElement) {
    const isConfirmed = confirm('Are you sure do you want to save Changes?');
    if (isConfirmed) {
      this.service.updateSleeve({name: sleeveToUpdateInput.value, id: this.itemToEdit.id}).then(value => {
        this.newName = '';
        this.toastr.success('New Sleeve updated Successfully', 'Update Successfully');
        this.itemToEdit = null;
      }, reason => {
        this.toastr.error('Error while updating New Sleeve, Please try again', 'Error while updating Sleeve');
      })
    }
  }

}
