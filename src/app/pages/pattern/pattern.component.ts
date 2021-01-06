import {Component, OnInit} from '@angular/core';
import {PatternService, IPattern} from './service/pattern.service';
import {ToastrService} from 'ngx-toastr';
@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.scss']
})
export class PatternComponent  {

  moduleName = 'Pattern';
  newName = '';
  itemToEdit: IPattern = null;

  constructor(
    public service: PatternService,
    private toastr: ToastrService,
  ) {
  }

  addPattern() {
    if (this.newName.trim().length >= 3) {
      this.service.addPattern({name: this.newName}).then(value => {
        this.newName = '';
        this.toastr.success(`New ${this.moduleName} Added Successfully`, 'Added Successfully');
      }, reason => {
        this.toastr.error(`Error while adding New ${this.moduleName}, Please try again`, `Error while adding Pattern ${this.moduleName}`);
      })
    }
  }

  deletePattern(pattern: IPattern) {
    const isConfirmed = confirm('Are you sure do you want to delete Pattern?');
    if (isConfirmed) {
      this.service.deletePattern(pattern).then(value => {
        this.newName = '';
        this.toastr.success('New Pattern deleted Successfully', 'Delete Successfully');
      }, reason => {
        this.toastr.error('Error while deleting New Pattern, Please try again', 'Error while deleting Pattern');
      })
    }
  }

  updatePattern(patternToUpdateInput: HTMLInputElement) {
    const isConfirmed = confirm('Are you sure do you want to save Changes?');
    if (isConfirmed) {
      this.service.updatePattern({name: patternToUpdateInput.value, id: this.itemToEdit.id}).then(value => {
        this.newName = '';
        this.toastr.success('New Pattern updated Successfully', 'Update Successfully');
        this.itemToEdit = null;
      }, reason => {
        this.toastr.error('Error while updating New Pattern, Please try again', 'Error while updating Pattern');
      })
    }
  }

}
