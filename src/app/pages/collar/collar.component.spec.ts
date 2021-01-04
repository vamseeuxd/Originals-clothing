import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollarComponent } from './collar.component';

describe('CollarComponent', () => {
  let component: CollarComponent;
  let fixture: ComponentFixture<CollarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
