import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BrandComponent} from './pages/brand/brand.component';
import {CategoryComponent} from './pages/category/category.component';
import {CollarComponent} from './pages/collar/collar.component';
import {ColorsComponent} from './pages/colors/colors.component';
import {FabricFamilyComponent} from './pages/fabric-family/fabric-family.component';
import {FitComponent} from './pages/fit/fit.component';
import {PatternComponent} from './pages/pattern/pattern.component';
import {SizeComponent} from './pages/size/size.component';
import {SleeveComponent} from './pages/sleeve/sleeve.component';
import {TypeComponent} from './pages/type/type.component';
import {WaistRiseComponent} from './pages/waist-rise/waist-rise.component';
import {GenderComponent} from './pages/gender/gender.component';
import {UsersComponent} from './pages/users/users.component';

const routes: Routes = [
  {path: '', redirectTo: 'brand', pathMatch: 'full'},
  {path: 'brand', component: BrandComponent},
  {path: 'category', component: CategoryComponent},
  {path: 'collar', component: CollarComponent},
  {path: 'colors', component: ColorsComponent},
  {path: 'fabric-family', component: FabricFamilyComponent},
  {path: 'fit', component: FitComponent},
  {path: 'pattern', component: PatternComponent},
  {path: 'size', component: SizeComponent},
  {path: 'sleeve', component: SleeveComponent},
  {path: 'type', component: TypeComponent},
  {path: 'waist-rise', component: WaistRiseComponent},
  {path: 'gender', component: GenderComponent},
  {path: 'users', component: UsersComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
