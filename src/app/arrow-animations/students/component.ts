import {Component, OnInit} from '@angular/core';
import {Service} from './service/service';
import {ToastrService} from 'ngx-toastr';
import {NgForm} from '@angular/forms';
import {IStudent, ModuleConfig, NewEmptyItem} from './ModuleConfig';

@Component({
  selector: 'app-students',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class StudentsComponent {
  moduleName = ModuleConfig.name_capitalize;
  moduleNamePlural = ModuleConfig.name_capitalize_plural;
  newItem: IStudent = NewEmptyItem;
  itemToEdit: IStudent = null;
  itemToOpen: IStudent = null;

  constructor(
    public service: Service,
    private toastr: ToastrService,
  ) {
  }

  isDuplicateName(items: IStudent[], itemName, ignoreValue = ''): boolean {
    return items.map(d => d.name.toLowerCase().trim())
      .filter(d => d.toLowerCase().trim() != ignoreValue.toLowerCase().trim())
      .includes(itemName.toLowerCase().trim());
  }

  addItem(newItemForm: NgForm, staticModal) {
    this.service.addData(newItemForm.value).then(value => {
      this.newItem = NewEmptyItem;
      newItemForm.resetForm({});
      staticModal.hide();
      this.itemToEdit = null;
      this.toastr.success(`New ${this.moduleName} Added Successfully`, 'Added Successfully');
    }, reason => {
      this.toastr.error(`Error while adding New ${this.moduleName}, Please try again`, `Error while adding ${this.moduleName}`);
    })
  }

  deleteItem(item: IStudent) {
    const isConfirmed = confirm(`Are you sure do you want to delete ${this.moduleName}?`);
    if (isConfirmed) {
      this.service.deleteData(item).then(value => {
        this.newItem = NewEmptyItem;
        this.toastr.success(`New ${this.moduleName} deleted Successfully`, 'Delete Successfully');
      }, reason => {
        this.toastr.error(`Error while deleting New ${this.moduleName}, Please try again`, 'Error while Deleting');
      })
    }
  }

  updateItem(updateItemsForm: NgForm, staticModal) {
    const isConfirmed = confirm('Are you sure do you want to save Changes?');
    if (isConfirmed) {
      this.service.updateData({id: this.itemToEdit.id, ...updateItemsForm.value}).then(value => {
        this.newItem = NewEmptyItem;
        updateItemsForm.resetForm({});
        staticModal.hide();
        this.itemToEdit = null;
        this.toastr.success(`New ${this.moduleName} updated Successfully`, 'Update Successfully');
      }, reason => {
        console.log(reason);
        this.toastr.error(`Error while updating New ${this.moduleName}, Please try again`, `Error while updating ${this.moduleName}`);
      })
    }
  }

  resetModal() {
    this.itemToEdit = null;
    this.newItem = NewEmptyItem;
  }
}