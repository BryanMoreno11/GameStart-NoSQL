import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacionTokenComponent } from './verificacion-token.component';

describe('VerificacionTokenComponent', () => {
  let component: VerificacionTokenComponent;
  let fixture: ComponentFixture<VerificacionTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificacionTokenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificacionTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
