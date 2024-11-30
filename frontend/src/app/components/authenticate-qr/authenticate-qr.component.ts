import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authenticate-qr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './authenticate-qr.component.html',
  styleUrl: './authenticate-qr.component.css'
})
export class AuthenticateQrComponent implements OnInit {
  qrCodeUrl: string |  null = null;
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router:Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const nombre = params['nombre'];
      this.generateQRCode(nombre);
    });
  }

  generateQRCode(nombre: string) {
    this.http.get<any>(`http://localhost:3000/api/generate-qr`, { params: { nombre } }).subscribe(
      res => {
        if (res.qrCode) {
          this.qrCodeUrl = res.qrCode;
        } else {
          this.errorMessage = 'No se pudo generar el código QR.';
        }
      },
      err => {
        console.error('Error:', err);
        this.errorMessage = 'Ocurrió un error al generar el código QR.';
      }
    );
  }

  toLogin(){
    this.router.navigate(['/login']);
  }
}
