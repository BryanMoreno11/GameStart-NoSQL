import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  
  //atributos
  API_URL='http://localhost:3000/api/';
  
  constructor(private http:HttpClient) { }
  
  getCliente(id:number){
    return this.http.get(`${this.API_URL}cliente/${id}`);
  }
  
  
  getClienteLogin(correo:string, contrasenia:string):Observable<any>{
    return this.http.post(`${this.API_URL}cliente/login`, {correo, contrasenia});
  }
  
  insertarCliente(cliente:Cliente):Observable<any>{
    return this.http.post<Cliente>(`${this.API_URL}cliente`, cliente);
  }
}

export interface Cliente{
  id_ciudad: string;
  cedula: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  telefono: string;
  correo: string;
  contrasenia: string;
}
