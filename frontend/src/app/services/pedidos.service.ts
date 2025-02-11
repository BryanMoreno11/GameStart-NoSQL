import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido';
import { ApiPedido } from '../models/pedido';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:3000/api';
  private accessToken = localStorage.getItem('authToken');
  
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });
  }

  getPedidos(): Observable<ApiPedido[]> {
    return this.http.get<ApiPedido[]>(`${this.apiUrl}/pedidos`, { headers: this.getHeaders() });
  }

  addPedido(pedido: ApiPedido): Observable<any> {
    return this.http.post(`${this.apiUrl}/pedidos`, pedido, { headers: this.getHeaders() });
  }

  updatePedido(id: string, pedido: ApiPedido): Observable<any> {
    return this.http.put(`${this.apiUrl}/pedidos/${id}`, pedido, { headers: this.getHeaders() });
  }

  deletePedido(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pedidos/${id}`, { headers: this.getHeaders() });
  }

  getProveedores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/proveedores`, { headers: this.getHeaders() });
  }

  getVideojuegosPlataformas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/plataformas`, { headers: this.getHeaders() }).pipe(
      map(videojuegosPlataformas => {
        console.log('Datos de Videojuegos Plataformas:', videojuegosPlataformas);
        return videojuegosPlataformas;
      })
    );
  }

  getSucursales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sucursales`, { headers: this.getHeaders() });
  }

  private transformPedido(apiPedido: ApiPedido): Pedido {
    return {
      id_pedido: apiPedido._id,
      proveedor: {
        id: apiPedido.proveedor._id,
        nombre: apiPedido.proveedor.nombre
      },
      producto: {
        id: apiPedido.producto._id,
        nombre: apiPedido.producto.nombre,
        plataforma: apiPedido.producto.plataforma.nombre
      },
      precio_unitario: apiPedido.precio_unitario,
      cantidad: apiPedido.cantidad,
      descuento: apiPedido.descuento,
      total: apiPedido.total,
      fecha_pedido: new Date(apiPedido.fecha_pedido)
    };
  }
}
