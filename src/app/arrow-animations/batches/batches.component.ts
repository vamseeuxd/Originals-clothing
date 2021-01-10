import {Component, OnInit} from '@angular/core';
import {BatchesService, IBatch} from './service/batches.service';
import {ToastrService} from 'ngx-toastr';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-batch',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.scss']
})
export class BatchesComponent {
  moduleName = 'Batch';
  newBatch: IBatch = {
    "id": "",
    "name": "",
    "endDate": "",
    "timings": "",
    "updatedBy": "",
    "demoDate": "",
    "durationInHours": null,
    "startDate": "",
  };
  itemToEdit: IBatch = null;

  constructor(
    public service: BatchesService,
    private toastr: ToastrService,
  ) {
  }

  isDuplicateBatchName(brands: IBatch[], batchName, ignoreValue = ''): boolean {
    return brands.map(d => d.name.toLowerCase().trim())
      .filter(d => d.toLowerCase().trim() != ignoreValue.toLowerCase().trim())
      .includes(batchName.toLowerCase().trim());
  }

  addBatch(newBatchForm: NgForm, staticModal) {
    this.service.addBatch(newBatchForm.value).then(value => {
      this.newBatch = {
        "id": "",
        "name": "",
        "endDate": "",
        "timings": "",
        "updatedBy": "",
        "demoDate": "",
        "durationInHours": null,
        "startDate": "",
      };
      newBatchForm.resetForm({});
      staticModal.hide();
      this.itemToEdit = null;
      this.toastr.success(`New ${this.moduleName} Added Successfully`, 'Added Successfully');
    }, reason => {
      this.toastr.error(`Error while adding New ${this.moduleName}, Please try again`, `Error while adding Batch ${this.moduleName}`);
    })
  }

  deleteBatch(batch: IBatch) {
    const isConfirmed = confirm('Are you sure do you want to delete Batch?');
    if (isConfirmed) {
      this.service.deleteBatch(batch).then(value => {
        this.newBatch = {
          "id": "",
          "name": "",
          "endDate": "",
          "timings": "",
          "updatedBy": "",
          "demoDate": "",
          "durationInHours": null,
          "startDate": "",
        };
        this.toastr.success('New Batch deleted Successfully', 'Delete Successfully');
      }, reason => {
        this.toastr.error('Error while deleting New Batch, Please try again', 'Error while deleting Batch');
      })
    }
  }

  updateBatch(updateBatchForm: NgForm, staticModal) {
    const isConfirmed = confirm('Are you sure do you want to save Changes?');
    if (isConfirmed) {
      this.service.updateBatch({id: this.itemToEdit.id, ...updateBatchForm.value}).then(value => {
        this.newBatch = {
          "id": "",
          "name": "",
          "endDate": "",
          "timings": "",
          "updatedBy": "",
          "demoDate": "",
          "durationInHours": null,
          "startDate": "",
        };
        updateBatchForm.resetForm({});
        staticModal.hide();
        this.itemToEdit = null;
        this.toastr.success('New Batch updated Successfully', 'Update Successfully');
      }, reason => {
        console.log(reason);
        this.toastr.error('Error while updating New Batch, Please try again', 'Error while updating Batch');
      })
    }
  }

  resetModal() {
    this.itemToEdit = null;
    this.newBatch = {
      "id": "",
      "name": "",
      "endDate": "",
      "timings": "",
      "updatedBy": "",
      "demoDate": "",
      "durationInHours": null,
      "startDate": "",
    };
  }
}
