import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { EmpleadoService } from '../../services/empleado.service';
import { Empleado } from '../../models/empleado';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-empleados',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './admin-empleados.component.html',
  styleUrl: './admin-empleados.component.css'
})
export default class AdminEmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
  sucursales: any[] = [];
  ciudades: any[] = [];
  puestos: any[] = [];
  selectedEmpleado: Empleado = this.initializeEmpleado();
  isFormVisible: boolean = false;
  isEditing: boolean = false;

  constructor(private empleadoService: EmpleadoService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getEmpleados();
    this.getSucursales();
    this.getCiudades();
    this.getPuestos();
  }

  getEmpleados(): void {
    this.empleadoService.getEmpleados().subscribe(empleados => {
      this.empleados = empleados;
      this.empleados.map(empleado=>{
        let ob = Object.assign(empleado)
        let fecha = new Date(empleado.fecha_nacimiento);
        fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
        ob.fecha_nacimiento = fecha
        return ob;
      })
      console.log("Los  empleados que se obtienen son", empleados)
    });
  }

  getSucursales(): void {
    this.empleadoService.getSucursales().subscribe(sucursales => {
      this.sucursales = sucursales;
      this.cdr.detectChanges();
    });
  }

  getCiudades(): void {
    this.empleadoService.getCiudades().subscribe(ciudades => {
      this.ciudades = ciudades;
      this.cdr.detectChanges();
    });
  }

  getPuestos(): void {
    this.empleadoService.getPuestos().subscribe(puestos => {
      this.puestos = puestos;
      this.cdr.detectChanges();
    });
  }

  saveEmpleado(): void {
    if (this.isEditing && this.selectedEmpleado.id_empleado) {
      this.empleadoService.updateEmpleado(this.selectedEmpleado.id_empleado, this.selectedEmpleado).subscribe(() => {
        this.getEmpleados();
        this.isFormVisible = false;
        this.selectedEmpleado = this.initializeEmpleado();
      });
    } else {
      this.empleadoService.addEmpleado(this.selectedEmpleado).subscribe(() => {
        this.getEmpleados();
        this.isFormVisible = false;
        this.selectedEmpleado = this.initializeEmpleado();
      });
    }
  }

  editEmpleado(empleado: Empleado): void {
    this.selectedEmpleado = { ...empleado };
    this.isFormVisible = true;
    this.isEditing = true;
    this.selectedEmpleado.fecha_nacimiento = this.formatearFecha(this.selectedEmpleado.fecha_nacimiento);
  }
  
  formatearFecha(fecha:any):string{
    let yyyy = fecha.getFullYear();
    let mm = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    let dd = String(fecha.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`
  
  }

  showInsertForm(): void {
    this.selectedEmpleado = this.initializeEmpleado();
    this.isFormVisible = true;
    this.isEditing = false;
  }

  deleteEmpleado(id: number): void {
    this.empleadoService.deleteEmpleado(id).subscribe(() => this.getEmpleados());
  }

  initializeEmpleado(): Empleado {
    return {
      id_empleado: null,
      id_sucursal: null,
      id_ciudad: null,
      id_puesto: null,
      cedula: '',
      nombre: '',
      fecha_nacimiento: null,
      direccion: '',
      telefono: '',
      correo: '',
      estado: ''
    };
  }

  closeModal(): void {
    this.isFormVisible = false;
    this.selectedEmpleado = this.initializeEmpleado();
  }
}