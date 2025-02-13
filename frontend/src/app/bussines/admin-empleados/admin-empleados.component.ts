import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EmpleadoService } from '../../services/empleado.service';
import { Empleado, Puesto } from '../../models/empleado';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-empleados',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-empleados.component.html',
  styleUrls: ['./admin-empleados.component.css']
})
export default class AdminEmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
  filteredEmpleados: Empleado[] = [];
  
  // Filtro por búsqueda (por nombre, apellido o cédula)
  searchTerm: string = '';

  // Para formulario (crear/editar)
  selectedEmpleado: Empleado = this.initializeEmpleado();
  isFormVisible: boolean = false;
  isEditing: boolean = false;

  constructor(
    private empleadoService: EmpleadoService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getEmpleados();
  }

  getEmpleados(): void {
    this.empleadoService.getEmpleados().subscribe(emps => {
      this.empleados = emps;
      this.filteredEmpleados = emps;
      this.cdr.detectChanges();
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredEmpleados = this.empleados.filter(emp => 
      emp.nombre.toLowerCase().includes(term) ||
      emp.apellido.toLowerCase().includes(term) ||
      emp.cedula.toLowerCase().includes(term)
    );
  }

  showInsertForm(): void {
    this.selectedEmpleado = this.initializeEmpleado();
    this.isFormVisible = true;
    this.isEditing = false;
  }

  editEmpleado(empleado: Empleado): void {
    // Se crea una copia del empleado para evitar modificar el listado directamente
    this.selectedEmpleado = { ...empleado };
    this.isFormVisible = true;
    this.isEditing = true;
  }

  saveEmpleado(): void {
    if (this.isEditing && this.selectedEmpleado._id) {
      Swal.fire({
        title: 'Confirmar actualización',
        text: '¿Desea actualizar el empleado?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed && this.selectedEmpleado._id) {
          this.empleadoService.updateEmpleado(this.selectedEmpleado._id, this.selectedEmpleado)
            .subscribe(() => {
              Swal.fire('Actualizado', 'Empleado actualizado exitosamente', 'success');
              this.getEmpleados();
              this.closeModal();
            }, error => {
              Swal.fire('Error', 'No se pudo actualizar el empleado', 'error');
            });
        }
      });    } else {
      Swal.fire({
        title: 'Confirmar inserción',
        text: '¿Desea agregar el nuevo empleado?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.empleadoService.addEmpleado(this.selectedEmpleado)
            .subscribe(() => {
              Swal.fire('Agregado', 'Empleado agregado exitosamente', 'success');
              this.getEmpleados();
              this.closeModal();
            }, error => {
              Swal.fire('Error', 'No se pudo agregar el empleado', 'error');
            });
        }
      });
    }
  }

  deleteEmpleado(id: string): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.empleadoService.deleteEmpleado(id).subscribe(() => {
          Swal.fire('Eliminado', 'El empleado ha sido eliminado.', 'success');
          this.getEmpleados();
        }, error => {
          Swal.fire('Error', 'No se pudo eliminar el empleado', 'error');
        });
      }
    });
  }

  closeModal(): void {
    this.isFormVisible = false;
    this.selectedEmpleado = this.initializeEmpleado();
  }

  onModalClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  initializeEmpleado(): Empleado {
    return {
      _id: '',
      cedula: '',
      nombre: '',
      apellido: '',
      fecha_nacimiento: '',
      direccion: '',
      telefono: '',
      correo: '',
      puesto: { nombre: 'Empleado', descripcion: '' },
      sueldo: 0,
      fecha_creacion: new Date().toISOString().split('T')[0],
      estado: 'activo'
    };
  }
  
}
