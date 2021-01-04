import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SleeveComponent } from './sleeve.component';

describe('SleeveComponent', () => {
  let component: SleeveComponent;
  let fixture: ComponentFixture<SleeveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SleeveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SleeveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
