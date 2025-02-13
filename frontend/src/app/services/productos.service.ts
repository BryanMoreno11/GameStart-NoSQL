import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  // URL base del API
  private urlBase = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  // Obtiene todos los productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlBase}productos`);
  }

  // Obtiene un producto por ID
  getProducto(id: number | string): Observable<Producto> {
    return this.http.get<Producto>(`${this.urlBase}productos/${id}`);
  }

  // Crea un nuevo producto
  createProducto(producto: Producto): Observable<any> {
    return this.http.post(`${this.urlBase}productos`, producto);
  }

  // Actualiza un producto (general)
  updateProducto(id: number | string, producto: Producto): Observable<any> {
    return this.http.put(`${this.urlBase}productos/${id}`, producto);
  }

  // Actualiza el stock y ajusta las claves digitales (ruta: /productos/:id/stock)
  updateStockProducto(id: number | string, newStock: number): Observable<any> {
    return this.http.put(`${this.urlBase}productos/${id}/stock`, { newStock });
  }

  // Elimina un producto
  deleteProducto(id: number | string): Observable<any> {
    return this.http.delete(`${this.urlBase}productos/${id}`);
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
  // Para productos digitales, en el backend se almacenan como objetos con { codigo, usada }.
  // Puedes ajustar el tipo según corresponda.
  claves_digitales?: any[] | null; 
}
