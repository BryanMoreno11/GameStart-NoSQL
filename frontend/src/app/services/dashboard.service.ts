import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  //atributos
  API_URL='http://localhost:3000/api/';
  //#region Métodos
  constructor(private http:HttpClient) {

   }

   getVideojuegosVentas(){
    return this.http.get(`${this.API_URL}dashboard/videojuegosventas`);
  }

  getVideojuegosRecaudacion(){
    return this.http.get(`${this.API_URL}dashboard/videojuegosrecaudacion`);
  }

  getGenerosVentas(){
    return this.http.get(`${this.API_URL}dashboard/generosventas`);
  }

  getGenerosRecaudacion(){
    return this.http.get(`${this.API_URL}dashboard/generosrecaudacion`);

  }

  getPlataformasVentas(){
    return this.http.get(`${this.API_URL}dashboard/plataformasventas`);

  }

  getPlataformasRecaudacion(){
    return this.http.get(`${this.API_URL}dashboard/plataformasrecaudacion`);

  }

  getCantidadProveedor(){
    return this.http.get(`${this.API_URL}dashboard/cantidadproveedor`);

  }

  getRecaudacionProveedor(){
    return this.http.get(`${this.API_URL}dashboard/recaudacionproveedor`);

  }

  getTablas(tabla:Tabla){
    return this.http.post(`${this.API_URL}dashboard/tablas`,tabla);

  }

  getOperacionesTablas(auditoria:Auditoria){
    return this.http.post(`${this.API_URL}dashboard/operacionestabla`,auditoria);
  }
}

export interface Auditoria{
  tabla:string;
  fecha_input:string;

}

export interface Tabla{
  fecha_input:string;

}
