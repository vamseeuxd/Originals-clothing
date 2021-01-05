import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {ColorService, IColor} from './service/color.service';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})
export class ColorsComponent {

  moduleName = 'Color';
  newName = '';
  itemToEdit: IColor = null;

  constructor(
    public service: ColorService,
    private toastr: ToastrService,
  ) {
  }

  addColor() {
    if (this.newName.trim().length >= 3) {
      this.service.addColor({name: this.newName}).then(value => {
        this.newName = '';
        this.toastr.success(`New ${this.moduleName} Added Successfully`, 'Added Successfully');
      }, reason => {
        this.toastr.error(`Error while adding New ${this.moduleName}, Please try again`, `Error while adding Color ${this.moduleName}`);
      })
    }
  }

  deleteColor(color: IColor) {
    const isConfirmed = confirm('Are you sure do you want to delete Color?');
    if (isConfirmed) {
      this.service.deleteColor(color).then(value => {
        this.newName = '';
        this.toastr.success('New Color deleted Successfully', 'Delete Successfully');
      }, reason => {
        this.toastr.error('Error while deleting New Color, Please try again', 'Error while deleting Color');
      })
    }
  }

  updateColor(colorToUpdateInput: HTMLInputElement) {
    const isConfirmed = confirm('Are you sure do you want to save Changes?');
    if (isConfirmed) {
      this.service.updateColor({name: colorToUpdateInput.value, id: this.itemToEdit.id}).then(value => {
        this.newName = '';
        this.toastr.success('New Color updated Successfully', 'Update Successfully');
        this.itemToEdit = null;
      }, reason => {
        this.toastr.error('Error while updating New Color, Please try again', 'Error while updating Color');
      })
    }
  }

}
