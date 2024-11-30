import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario, UsuariosService } from '../../services/usuarios.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {

  usuario: Usuario  = {
    nombre: '',
    contrasenia: '',
    apellido: '',
    correo: '',
    telefono: '',
    rol: '',
    estado: ''
  };

  constructor(private http:HttpClient, private usuariosService:UsuariosService, private router:Router) {}

  insertarUsuario() {
    this.usuariosService.insertarUsuario(this.usuario).subscribe(res => {
      console.log(res);
      if (res.secret) {
        Swal.fire({
          title: 'Registro exitoso',
          text: 'El usuario ha sido registrado correctamente',
          icon: 'success'
        })
        // Redirigir al componente del QR con el secret
        this.router.navigate(['/qr-verify'], { queryParams: { nombre: res.nombre } });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'El usuario no se ha sido registrado correctamente',
          icon: 'error'
        })
      }
    });
  }
}
