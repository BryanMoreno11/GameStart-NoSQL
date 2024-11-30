import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticateQrComponent } from './authenticate-qr.component';

describe('AuthenticateQrComponent', () => {
  let component: AuthenticateQrComponent;
  let fixture: ComponentFixture<AuthenticateQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticateQrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthenticateQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
