import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricFamilyComponent } from './fabric-family.component';

describe('FabricFamilyComponent', () => {
  let component: FabricFamilyComponent;
  let fixture: ComponentFixture<FabricFamilyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FabricFamilyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
