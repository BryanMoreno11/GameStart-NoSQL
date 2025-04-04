import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';


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
        const correo = params['correo'];
        console.log('El correo es:', correo);
        this.getSecret(correo);
    });
}

getSecret(correo: string) {
    this.http.get<any>(`${environment.apiUrl}usuariocorreo/${correo}`).subscribe(
        res => {
          this.secret = res.secret;
        },
        err => {
            console.log(err);
        }
    );
}
  

  verify(): void {
    console.log('Verificando token...' + this.authToken);
    this.authService.verifyToken(this.authToken, this.secret).subscribe(
      response => {
        this.verificationResult = response.verified;
        Swal.fire({
          title: 'Verificacion exitosa',
          text: 'Has iniciado sesion',
          icon: 'success'
        }).then(() => {
          localStorage.setItem('loginUsuario', 'true');
          localStorage.setItem('loginAdmin', 'true');
          this.router.navigate(['/admin/dashboard']).then(()=>{
            window.location.reload();
          });
        });
       

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
