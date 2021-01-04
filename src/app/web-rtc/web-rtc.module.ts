import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WebRtcComponent} from './component/web-rtc/web-rtc.component';
import {WebRtcService} from './service/web-rtc.service';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [WebRtcComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    WebRtcComponent
  ],
  entryComponents: [
    WebRtcComponent
  ]
})
export class WebRtcModule {
  static forRoot(): ModuleWithProviders<WebRtcModule> {
    return {
      ngModule: WebRtcModule,
      providers: [
        WebRtcService
      ]
    };
  }
}
