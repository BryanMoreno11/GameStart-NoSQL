import { Component } from '@angular/core';
import { Cliente, ClientesService } from '../../services/clientes.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-client',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-client.component.html',
  styleUrl: './login-client.component.css'
})
export class LoginClientComponent {
  nombre: string = '';
  contrasenia: string = '';
  
  constructor(private http:HttpClient, private clientesusuarios:ClientesService, private router:Router) {}

  getUsuario(){
    this.clientesusuarios.getClienteLogin(this.nombre, this.contrasenia).subscribe(
      res => {
        localStorage.setItem('nombre_cliente', res.nombre);
        localStorage.setItem('id_cliente', res.id_cliente);
        localStorage.setItem('loginUsuario', 'true');
        console.log(localStorage.getItem('nombre_cliente'));
        if(res.succes){
          Swal.fire({
            title: 'Login exitoso',
            text: 'Has iniciado sesion',
            icon: 'success'
          }).then(() => {
            this.router.navigate(['/inicio']).then(() => {
              window.location.reload();
            });
          });
        }
      },
      err => {
        Swal.fire({
          title: 'Error',
          text: 'Nombre de usuario o contrasenia incorrecto',
          icon: 'error'
        })
      }
    )
  }

  goToRegister(){
    this.router.navigate(['/register-client']);
  }
}
