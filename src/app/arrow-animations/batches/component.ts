import {Component, OnInit} from '@angular/core';
import {Service} from './service/service';
import {Service as TechnologiesService} from '../technologies/service/service';
import {Service as StudentsService} from '../students/service/service';
import {ToastrService} from 'ngx-toastr';
import {NgForm} from '@angular/forms';
import {IBatch, ModuleConfig, NewEmptyItem} from './ModuleConfig';
import {ITechnology} from '../technologies/ModuleConfig';
import {IStudent} from '../students/ModuleConfig';

@Component({
  selector: `app-${ModuleConfig.name_lowercase_plural}`,
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BatchComponent {
  moduleName = ModuleConfig.name_capitalize;
  moduleNamePlural = ModuleConfig.name_capitalize_plural;
  newItem: IBatch = NewEmptyItem;
  itemToEdit: IBatch = null;
  itemToOpen: string;
  selectedTechnologiesNameToAdd = '';
  selectedTechnologiesIdToAdd;
  selectedStudentNameToAdd = '';
  selectedStudentIdToAdd;
  isBackEndCallInProgress = false;
  searchText = '';

  constructor(
    public service: Service,
    public technologiesService: TechnologiesService,
    public studentsService: StudentsService,
    private toastr: ToastrService,
  ) {
  }

  isDuplicateName(items: IBatch[], itemName, ignoreValue = ''): boolean {
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

  deleteItem(item: IBatch) {
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

  getTechnologiesWithOutSelected(availableTechnologies: ITechnology[], selectedTechnologies: ITechnology[]) {
    return availableTechnologies.filter(
      data => {
        return !selectedTechnologies.map(d => d.id).includes(data.id);
      }
    )
  }

  getStudentsWithOutSelected(availableTechnologies: IStudent[], selectedTechnologies: IStudent[]) {
    return availableTechnologies.filter(
      data => {
        return !selectedTechnologies.map(d => d.id).includes(data.id);
      }
    )
  }

  addTechnologyToBatch(batchId, selectedTechnologiesIdToAdd: any) {
    this.service.addTechnologyToBatch(batchId, selectedTechnologiesIdToAdd).then(value => {
      this.selectedTechnologiesNameToAdd = '';
      this.selectedTechnologiesIdToAdd = '';
      this.toastr.success(`Technology added Successfully into Batch`, 'Added Successfully');
    }, reason => {
      console.log(reason);
      this.toastr.error(`Error while adding New Technology into Batch, Please try again`, `Error while adding Technology into Batch`);
    })
  }

  deleteTechnologyFromBatch(technology: ITechnology) {
    const isConfirmed = confirm(`Are you sure do you want to delete Technology from Batch`);
    if (isConfirmed) {
      this.service.deleteTechnologyFromBatch(technology).then(value => {
        this.toastr.success(`Technology deleted successfully from Batch`, 'Delete Successfully');
      }, reason => {
        this.toastr.error(`Error while deleting Technology from Batch, Please try again`, 'Error while Deleting');
      })
    }
  }

  addStudentToBatch(batchId, selectedStudentIdToAdd: any) {
    this.service.addStudentToBatch(batchId, selectedStudentIdToAdd).then(value => {
      this.selectedStudentNameToAdd = '';
      this.selectedStudentIdToAdd = '';
      this.toastr.success(`Student added Successfully into Batch`, 'Added Successfully');
    }, reason => {
      console.log(reason);
      this.toastr.error(`Error while adding New Student into Batch, Please try again`, `Error while adding Student into Batch`);
    })
  }

  deleteStudentFromBatch(student: IStudent) {
    const isConfirmed = confirm(`Are you sure do you want to delete Student from Batch`);
    if (isConfirmed) {
      this.service.deleteStudentFromBatch(student).then(value => {
        this.toastr.success(`Student deleted successfully from Batch`, 'Delete Successfully');
      }, reason => {
        this.toastr.error(`Error while deleting Student from Batch, Please try again`, 'Error while Deleting');
      })
    }
  }
}
