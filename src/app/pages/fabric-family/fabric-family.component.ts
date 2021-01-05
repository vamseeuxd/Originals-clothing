import {Component, OnInit} from '@angular/core';
import {FabricfamilyService, IFabricfamily} from './service/fabric-family.service';
import {ToastrService} from 'ngx-toastr';

export interface FabricfamilyInterface {
  name: string,
  deleted: boolean;
  createdOn: {
    "seconds": number,
    "nanoseconds": number
  }
}


@Component({
  selector: 'app-fabric-family',
  templateUrl: './fabric-family.component.html',
  styleUrls: ['./fabric-family.component.scss']
})
export class FabricFamilyComponent  {
  moduleName = 'Fabricfamily';
  newName = '';
  itemToEdit: IFabricfamily = null;

  constructor(
    public service: FabricfamilyService,
    private toastr: ToastrService,
  ) {
  }

  addFabricfamily() {
    if (this.newName.trim().length >= 3) {
      this.service.addFabricfamily({name: this.newName}).then(value => {
        this.newName = '';
        this.toastr.success(`New ${this.moduleName} Added Successfully`, 'Added Successfully');
      }, reason => {
        this.toastr.error(`Error while adding New ${this.moduleName}, Please try again`, `Error while adding Fabricfamily ${this.moduleName}`);
      })
    }
  }

  deleteFabricfamily(fabricfamily: IFabricfamily) {
    const isConfirmed = confirm('Are you sure do you want to delete Fabricfamily?');
    if (isConfirmed) {
      this.service.deleteFabricfamily(fabricfamily).then(value => {
        this.newName = '';
        this.toastr.success('New Fabricfamily deleted Successfully', 'Delete Successfully');
      }, reason => {
        this.toastr.error('Error while deleting New Fabricfamily, Please try again', 'Error while deleting Fabricfamily');
      })
    }
  }

  updateFabricfamily(fabricfamilyToUpdateInput: HTMLInputElement) {
    const isConfirmed = confirm('Are you sure do you want to save Changes?');
    if (isConfirmed) {
      this.service.updateFabricfamily({name: fabricfamilyToUpdateInput.value, id: this.itemToEdit.id}).then(value => {
        this.newName = '';
        this.toastr.success('New Fabricfamily updated Successfully', 'Update Successfully');
        this.itemToEdit = null;
      }, reason => {
        this.toastr.error('Error while updating New Fabricfamily, Please try again', 'Error while updating Fabricfamily');
      })
    }
  }

  

}
