import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-verificacion-token',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './verificacion-token.component.html',
  styleUrl: './verificacion-token.component.css'
})
export class VerificacionTokenComponent {
  authToken: string = '';
  secret: string = '';
  verificationResult: boolean | null = null;

  constructor(private authService: AuthService, private route: ActivatedRoute, private http: HttpClient, private router:Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        const nombre = params['nombre'];
        console.log('El nombre es:', nombre);
        this.getSecret(nombre);
    });
}

getSecret(nombre: string) {
    this.http.get<any>(`http://localhost:3000/api/usuarionombre/${nombre}`).subscribe(
        res => {
          this.secret = res[0].SECRET;
        },
        err => {
            console.log(err);
        }
    );
}
  

  verify(): void {
    this.authService.verifyToken(this.authToken, this.secret).subscribe(
      response => {
        this.verificationResult = response.verified;
        Swal.fire({
          title: 'Verificacion exitosa',
          text: 'Has iniciado sesion',
          icon: 'success'
        })
        localStorage.setItem('loginAdmin', 'true');
        this.router.navigate(['/admin/dashboard']);
      },
      error => {
        console.error('Error en la verificación del token:', error);
        this.verificationResult = false;
        Swal.fire({
          title: 'Codigo de verificación incorrecto',
          text: 'No se ha iniciado sesion',
          icon: 'error'
        })
      }
    );
  }
}
