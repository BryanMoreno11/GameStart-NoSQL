import { Component } from '@angular/core';
import { Usuario, UsuariosService } from '../../services/usuarios.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.css'
})
export class LoginUserComponent {

  correo: string = '';
  contrasenia: string = '';
  
  constructor(private http:HttpClient, private usuariosService:UsuariosService, private router:Router) {}

  getUsuario(){
    this.usuariosService.getUsuarioLogin(this.correo, this.contrasenia).subscribe(
      res => {
        if(res.succes){
          Swal.fire({
            title: 'Login exitoso',
            text: 'Has iniciado sesion',
            icon: 'success'
          })
        }
        localStorage.setItem('authToken', res.accessToken);
        this.router.navigate(['/token-verify'], { queryParams: { correo: this.correo } });
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
}
