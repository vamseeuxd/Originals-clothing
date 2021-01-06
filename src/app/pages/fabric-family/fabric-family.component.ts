import {Component, OnInit} from '@angular/core';
import {FabricFamilyService, IFabricFamily} from './service/fabric-family.service';
import {ToastrService} from 'ngx-toastr';
@Component({
  selector: 'app-fabric-family',
  templateUrl: './fabric-family.component.html',
  styleUrls: ['./fabric-family.component.scss']
})
export class FabricFamilyComponent  {
  moduleName = 'FabricFamily';
  newName = '';
  itemToEdit: IFabricFamily = null;

  constructor(
    public service: FabricFamilyService,
    private toastr: ToastrService,
  ) {
  }

  addFabricFamily() {
    if (this.newName.trim().length >= 3) {
      this.service.addFabricFamily({name: this.newName}).then(value => {
        this.newName = '';
        this.toastr.success(`New ${this.moduleName} Added Successfully`, 'Added Successfully');
      }, reason => {
        this.toastr.error(`Error while adding New ${this.moduleName}, Please try again`, `Error while adding FabricFamily ${this.moduleName}`);
      })
    }
  }

  deleteFabricFamily(fabricFamily: IFabricFamily) {
    const isConfirmed = confirm('Are you sure do you want to delete FabricFamily?');
    if (isConfirmed) {
      this.service.deleteFabricFamily(fabricFamily).then(value => {
        this.newName = '';
        this.toastr.success('New FabricFamily deleted Successfully', 'Delete Successfully');
      }, reason => {
        this.toastr.error('Error while deleting New FabricFamily, Please try again', 'Error while deleting FabricFamily');
      })
    }
  }

  updateFabricFamily(fabricFamilyToUpdateInput: HTMLInputElement) {
    const isConfirmed = confirm('Are you sure do you want to save Changes?');
    if (isConfirmed) {
      this.service.updateFabricFamily({name: fabricFamilyToUpdateInput.value, id: this.itemToEdit.id}).then(value => {
        this.newName = '';
        this.toastr.success('New FabricFamily updated Successfully', 'Update Successfully');
        this.itemToEdit = null;
      }, reason => {
        this.toastr.error('Error while updating New FabricFamily, Please try again', 'Error while updating FabricFamily');
      })
    }
  }



}
