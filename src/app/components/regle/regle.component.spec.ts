import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegleComponent } from './regle.component';

describe('RegleComponent', () => {
  let component: RegleComponent;
  let fixture: ComponentFixture<RegleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
