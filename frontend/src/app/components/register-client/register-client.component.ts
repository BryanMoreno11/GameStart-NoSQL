import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente, ClientesService } from '../../services/clientes.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-client',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register-client.component.html',
  styleUrl: './register-client.component.css'
})
export class RegisterClientComponent {

   cliente: Cliente = {
    id_ciudad: '1',
    cedula: '',
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    telefono: '',
    correo: '',
    contrasenia: '',
  }

  ciudades: any = [];


  constructor(private http:HttpClient, private clientesServices:ClientesService, private router:Router) {}

  //ngOnInit(  ): void {
  //  this.http.get<any>(`http://localhost:3000/api/ciudades`).subscribe(
  //   res => {
  //      this.ciudades = res;
  //      console.log(this.ciudades);
  //   }
  //  );
  //}


  insertarCliente() {
    console.log(this.cliente);
    this.clientesServices.insertarCliente(this.cliente).subscribe(res => {
      console.log(res);
      if (res.message) {
        Swal.fire({
          title: 'Registro exitoso',
          text: 'El usuario ha sido registrado correctamente',
          icon: 'success'
        })
        this.router.navigate(['/login-client'],);
      } else {
        Swal.fire({
          title: 'Error',
          text: 'El usuario no se ha sido registrado correctamente',
          icon: 'error'
        })
      }
    },
    err=>{
      console.log("Error al crear ")
      Swal.fire({
        title: 'Error',
        text: err.error.message,
        icon: 'error'
      })
    }
  );
  }
}
