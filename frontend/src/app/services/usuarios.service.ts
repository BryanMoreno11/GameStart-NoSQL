import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

//atributos
API_URL='http://localhost:3000/api/';

  constructor(private http:HttpClient) { }
 
  getUsuario(id:number){
    return this.http.get(`${this.API_URL}usuario/${id}`);
  }

  
  getUsuarioLogin(correo:string, contrasenia:string):Observable<any>{
    return this.http.post(`${this.API_URL}usuario/login`, {correo, contrasenia});
  }

  insertarUsuario(usuario:Usuario):Observable<any>{
    return this.http.post<Usuario>(`${this.API_URL}usuario`, usuario);
  }
}

export interface Usuario{
  nombre: string;
  contrasenia: string;
  apellido: string;
  correo: string;
  telefono: string;
  rol: string;
  estado: string;
}
