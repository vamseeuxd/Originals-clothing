import {Component} from '@angular/core';
import {BusyIndicatorService} from './components/busy-indicator/busy-indicator.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'originals-clothing';
  constructor(
    public router: Router,
    public busyIndicator: BusyIndicatorService
  ) {
  }
}


/*

ng g c pages/brand
ng g c pages/category
ng g c pages/collar
ng g c pages/colors
ng g c pages/fabricFamily
ng g c pages/fit
ng g c pages/pattern
ng g c pages/size
ng g c pages/sleeve
ng g c pages/type
ng g c pages/waistRise
ng g c pages/gender




*/
