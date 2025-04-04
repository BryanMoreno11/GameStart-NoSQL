import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

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
      const correo = params['correo'];
      console.log(correo);  
      this.generateQRCode(correo);
    });
  }

  generateQRCode(correo: string) {
    this.http.get<any>(`${environment.apiUrl}generate-qr`, { params: { correo } }).subscribe(
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
