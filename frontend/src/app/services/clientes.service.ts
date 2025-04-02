import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  
  //atributos
  API_URL = environment.apiUrl;
  
  constructor(private http:HttpClient) { }
  
  getCliente(id:number){
    return this.http.get(`${this.API_URL}cliente/${id}`);
  }
  
  
  getClienteLogin(correo:string, contrasenia:string):Observable<any>{
    return this.http.post(`${this.API_URL}cliente/login`, {correo, contrasenia});
  }
  
  insertarCliente(cliente:Cliente):Observable<any>{
    return this.http.post<Cliente>(`${this.API_URL}clientes`, cliente);
  }
  
  getClienteLoginToken(header: string): Observable<any> {
    return this.http.get(`${this.API_URL}clientes/token`, { headers: { Authorization: header } });
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
