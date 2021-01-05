import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {HeaderComponent} from './components/header/header.component';
import {WebRtcModule} from './web-rtc/web-rtc.module';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireFunctionsModule} from '@angular/fire/functions';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireMessagingModule} from '@angular/fire/messaging';
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
import {FormsModule} from '@angular/forms';
import {UsersComponent} from './pages/users/users.component';
import {ToastrModule} from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BrandComponent,
    CategoryComponent,
    CollarComponent,
    ColorsComponent,
    FabricFamilyComponent,
    FitComponent,
    PatternComponent,
    SizeComponent,
    SleeveComponent,
    TypeComponent,
    WaistRiseComponent,
    GenderComponent,
    UsersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    WebRtcModule.forRoot(),
    FormsModule,
    ToastrModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
