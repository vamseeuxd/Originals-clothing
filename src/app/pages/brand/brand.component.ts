import {Component, OnInit} from '@angular/core';
import {BrandService, IBrand} from './service/brand.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent {
  moduleName = 'Brand';
  newName = '';
  logoUrl = '';
  itemToEdit: IBrand = null;

  constructor(
    public service: BrandService,
    private toastr: ToastrService,
  ) {
  }

  isDuplicateBrandName(brands: IBrand[], brandName): boolean {
    return brands.map(d => d.name.toLowerCase().trim()).includes(brandName.toLowerCase().trim());
  }

  addBrand() {
    if (this.newName.trim().length >= 3) {
      this.service.addBrand({name: this.newName, logoUrl: this.logoUrl}).then(value => {
        this.newName = '';
        this.logoUrl = '';
        this.toastr.success(`New ${this.moduleName} Added Successfully`, 'Added Successfully');
      }, reason => {
        this.toastr.error(`Error while adding New ${this.moduleName}, Please try again`, `Error while adding Brand ${this.moduleName}`);
      })
    }
  }

  deleteBrand(brand: IBrand) {
    const isConfirmed = confirm('Are you sure do you want to delete Brand?');
    if (isConfirmed) {
      this.service.deleteBrand(brand).then(value => {
        this.newName = '';
        this.toastr.success('New Brand deleted Successfully', 'Delete Successfully');
      }, reason => {
        this.toastr.error('Error while deleting New Brand, Please try again', 'Error while deleting Brand');
      })
    }
  }

  updateBrand(brandToUpdateInput: HTMLInputElement, brandLogoUrlToUpdateInput: HTMLInputElement) {
    const isConfirmed = confirm('Are you sure do you want to save Changes?');
    if (isConfirmed) {
      this.service.updateBrand({
        name: brandToUpdateInput.value,
        logoUrl: brandLogoUrlToUpdateInput.value,
        id: this.itemToEdit.id
      }).then(value => {
        this.newName = '';
        this.toastr.success('New Brand updated Successfully', 'Update Successfully');
        this.itemToEdit = null;
      }, reason => {
        this.toastr.error('Error while updating New Brand, Please try again', 'Error while updating Brand');
      })
    }
  }
}
