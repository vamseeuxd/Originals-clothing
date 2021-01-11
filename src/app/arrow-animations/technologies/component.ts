import {Component, OnInit} from '@angular/core';
import {Service} from './service/service';
import {ToastrService} from 'ngx-toastr';
import {NgForm} from '@angular/forms';
import {ITechnology, ModuleConfig, NewEmptyItem} from './ModuleConfig';

@Component({
  selector: `app-${ModuleConfig.name_lowercase_plural}`,
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class TechnologyComponent {
  moduleName = ModuleConfig.name_capitalize;
  moduleNamePlural = ModuleConfig.name_capitalize_plural;
  newItem: ITechnology = NewEmptyItem;
  itemToEdit: ITechnology = null;
  isBackEndCallInProgress = false;

  constructor(
    public service: Service,
    private toastr: ToastrService,
  ) {
  }

  isDuplicateName(items: ITechnology[], itemName, ignoreValue = ''): boolean {
    return items.map(d => d.name.toLowerCase().trim())
      .filter(d => d.toLowerCase().trim() != ignoreValue.toLowerCase().trim())
      .includes(itemName.toLowerCase().trim());
  }

  addItem(newItemForm: NgForm, staticModal) {
    this.isBackEndCallInProgress = true;
    this.service.addData(newItemForm.value).then(value => {
      this.newItem = NewEmptyItem;
      this.isBackEndCallInProgress = false;
      newItemForm.resetForm({});
      staticModal.hide();
      this.itemToEdit = null;
      this.toastr.success(`New ${this.moduleName} Added Successfully`, 'Added Successfully');
    }, reason => {
      this.toastr.error(`Error while adding New ${this.moduleName}, Please try again`, `Error while adding ${this.moduleName}`);
    })
  }

  deleteItem(item: ITechnology) {
    this.isBackEndCallInProgress = true;
    const isConfirmed = confirm(`Are you sure do you want to delete ${this.moduleName}?`);
    if (isConfirmed) {
      this.service.deleteData(item).then(value => {
        this.newItem = NewEmptyItem;
        this.isBackEndCallInProgress = false;
        this.toastr.success(`New ${this.moduleName} deleted Successfully`, 'Delete Successfully');
      }, reason => {
        this.toastr.error(`Error while deleting New ${this.moduleName}, Please try again`, 'Error while Deleting');
      })
    }
  }

  updateItem(updateItemsForm: NgForm, staticModal) {
    this.isBackEndCallInProgress = true;
    const isConfirmed = confirm('Are you sure do you want to save Changes?');
    if (isConfirmed) {
      this.service.updateData({id: this.itemToEdit.id, ...updateItemsForm.value}).then(value => {
        this.newItem = NewEmptyItem;
        this.isBackEndCallInProgress = false;
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

  openItem(itemId: string) {
    this.service.setSelectedItem(itemId);
  }
}
