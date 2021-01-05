import {Component, OnInit} from '@angular/core';
import {CategoryService, ICategory} from './service/category.service';
import {ToastrService} from 'ngx-toastr';

export interface CategoryInterface {
  name: string,
  deleted: boolean;
  createdOn: {
    "seconds": number,
    "nanoseconds": number
  }
}
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  moduleName = 'Category';
  newName = '';
  itemToEdit: ICategory = null;

  constructor(
    public service: CategoryService,
    private toastr: ToastrService,
  ) {
  }

  addCategory() {
    if (this.newName.trim().length >= 3) {
      this.service.addCategory({name: this.newName}).then(value => {
        this.newName = '';
        this.toastr.success(`New ${this.moduleName} Added Successfully`, 'Added Successfully');
      }, reason => {
        this.toastr.error(`Error while adding New ${this.moduleName}, Please try again`, `Error while adding Category ${this.moduleName}`);
      })
    }
  }

  deleteCategory(category: ICategory) {
    const isConfirmed = confirm('Are you sure do you want to delete Category?');
    if (isConfirmed) {
      this.service.deleteCategory(category).then(value => {
        this.newName = '';
        this.toastr.success('New Category deleted Successfully', 'Delete Successfully');
      }, reason => {
        this.toastr.error('Error while deleting New Category, Please try again', 'Error while deleting Category');
      })
    }
  }

  updateCategory(categoryToUpdateInput: HTMLInputElement) {
    const isConfirmed = confirm('Are you sure do you want to save Changes?');
    if (isConfirmed) {
      this.service.updateCategory({name: categoryToUpdateInput.value, id: this.itemToEdit.id}).then(value => {
        this.newName = '';
        this.toastr.success('New Category updated Successfully', 'Update Successfully');
        this.itemToEdit = null;
      }, reason => {
        this.toastr.error('Error while updating New Category, Please try again', 'Error while updating Category');
      })
    }
  }

}
