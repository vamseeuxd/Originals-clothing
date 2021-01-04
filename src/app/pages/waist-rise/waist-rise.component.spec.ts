import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaistRiseComponent } from './waist-rise.component';

describe('WaistRiseComponent', () => {
  let component: WaistRiseComponent;
  let fixture: ComponentFixture<WaistRiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaistRiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaistRiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
