import {Component, OnInit} from '@angular/core';
import {CollarService, ICollar} from './service/collar.service';
import {ToastrService} from 'ngx-toastr';
@Component({
  selector: 'app-collar',
  templateUrl: './collar.component.html',
  styleUrls: ['./collar.component.scss']
})
export class CollarComponent {


 moduleName = 'Collar';
  newName = '';
  itemToEdit: ICollar = null;

  constructor(
    public service: CollarService,
    private toastr: ToastrService,
  ) {
  }

  addCollar() {
    if (this.newName.trim().length >= 3) {
      this.service.addCollar({name: this.newName}).then(value => {
        this.newName = '';
        this.toastr.success(`New ${this.moduleName} Added Successfully`, 'Added Successfully');
      }, reason => {
        this.toastr.error(`Error while adding New ${this.moduleName}, Please try again`, `Error while adding Collar ${this.moduleName}`);
      })
    }
  }

  deleteCollar(collar: ICollar) {
    const isConfirmed = confirm('Are you sure do you want to delete Collar?');
    if (isConfirmed) {
      this.service.deleteCollar(collar).then(value => {
        this.newName = '';
        this.toastr.success('New Collar deleted Successfully', 'Delete Successfully');
      }, reason => {
        this.toastr.error('Error while deleting New Collar, Please try again', 'Error while deleting Collar');
      })
    }
  }

  updateCollar(collarToUpdateInput: HTMLInputElement) {
    const isConfirmed = confirm('Are you sure do you want to save Changes?');
    if (isConfirmed) {
      this.service.updateCollar({name: collarToUpdateInput.value, id: this.itemToEdit.id}).then(value => {
        this.newName = '';
        this.toastr.success('New Collar updated Successfully', 'Update Successfully');
        this.itemToEdit = null;
      }, reason => {
        this.toastr.error('Error while updating New Collar, Please try again', 'Error while updating Collar');
      })
    }
  }

}
