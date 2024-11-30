import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //atributos
  API_URL='http://localhost:3000/api/';
  constructor(private http: HttpClient) { }
  //metodo para verificar el token
  // Método para verificar el token
  verifyToken(authToken: string, secret: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}verify`, { auth_token: authToken, secret: secret });
  }
  generateQRCode():Observable<any>{
    return this.http.get<any>(`${this.API_URL}generate-qr`);
  }
}
