import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  //region atributos
  private urlBase='http://localhost:3000/api/';

  //region métodos
  constructor(private _httpClient: HttpClient) { 

  }

  getProductos():Observable<Producto[]>{
    return this._httpClient.get<Producto[]>(this.urlBase+'productos');
  }

  getProducto(id:number | string):Observable<Producto>{
    return this._httpClient.get<Producto>(this.urlBase+`productos/${id}`);
  }


}

export interface Plataforma {
  nombre: string;
  descripcion: string;
  fecha_creacion: string | Date; 
}

export interface Genero {
  nombre: string;
  descripcion: string;
  fecha_creacion: string | Date; 
}

export interface Tipo {
  nombre: string;
  descripcion: string;
  fecha_creacion: string | Date; 
}

export interface Producto {
  _id: string;
  nombre: string;
  desarrolladora: string;
  plataforma: Plataforma;
  genero: Genero;
  tipo: Tipo;
  precio: number;
  stock: number;
  imagenes: string[]; 
  fecha_creacion: string | Date; 
  descripcion: string;
  claves_digitales: string[] | null; 
}



