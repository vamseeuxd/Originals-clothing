import {Component, OnInit} from '@angular/core';
import {GenderService, IGender} from '../gender/service/gender.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-gender',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.scss']
})
export class GenderComponent {

  moduleName = 'Gender';
  newName = '';
  itemToEdit: IGender = null;

  constructor(
    public service: GenderService,
    private toastr: ToastrService,
  ) {
  }

  addGender() {
    if (this.newName.trim().length >= 3) {
      this.service.addGender({name: this.newName}).then(value => {
        this.newName = '';
        this.toastr.success(`New ${this.moduleName} Added Successfully`, 'Added Successfully');
      }, reason => {
        this.toastr.error(`Error while adding New ${this.moduleName}, Please try again`, `Error while adding Gender ${this.moduleName}`);
      })
    }
  }

  deleteGender(gender: IGender) {
    const isConfirmed = confirm('Are you sure do you want to delete Gender?');
    if (isConfirmed) {
      this.service.deleteGender(gender).then(value => {
        this.newName = '';
        this.toastr.success('New Gender deleted Successfully', 'Delete Successfully');
      }, reason => {
        this.toastr.error('Error while deleting New Gender, Please try again', 'Error while deleting Gender');
      })
    }
  }

  updateGender(genderToUpdateInput: HTMLInputElement) {
    const isConfirmed = confirm('Are you sure do you want to save Changes?');
    if (isConfirmed) {
      this.service.updateGender({name: genderToUpdateInput.value, id: this.itemToEdit.id}).then(value => {
        this.newName = '';
        this.toastr.success('New Gender updated Successfully', 'Update Successfully');
        this.itemToEdit = null;
      }, reason => {
        this.toastr.error('Error while updating New Gender, Please try again', 'Error while updating Gender');
      })
    }
  }

}
