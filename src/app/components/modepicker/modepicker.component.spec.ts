import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModepickerComponent } from './modepicker.component';

describe('ModepickerComponent', () => {
  let component: ModepickerComponent;
  let fixture: ComponentFixture<ModepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModepickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
