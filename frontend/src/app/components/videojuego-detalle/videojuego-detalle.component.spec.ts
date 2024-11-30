import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideojuegoDetalleComponent } from './videojuego-detalle.component';

describe('VideojuegoDetalleComponent', () => {
  let component: VideojuegoDetalleComponent;
  let fixture: ComponentFixture<VideojuegoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideojuegoDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideojuegoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
