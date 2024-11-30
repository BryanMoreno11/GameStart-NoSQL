import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido';
import { ApiPedido } from '../models/pedido';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getPedidos(): Observable<Pedido[]> {
    return this.http.get<ApiPedido[]>(`${this.apiUrl}/pedidos`).pipe(
      map((apiPedidos: ApiPedido[]) => apiPedidos.map((apiPedido: ApiPedido) => this.transformPedido(apiPedido)))
    );
  }

  addPedido(pedido: Pedido): Observable<any> {
    return this.http.post(`${this.apiUrl}/pedidos`, pedido);
  }

  updatePedido(id: number, pedido: Pedido): Observable<any> {
    return this.http.put(`${this.apiUrl}/pedidos/${id}`, pedido);
  }

  deletePedido(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pedidos/${id}`);
  }

  getProveedores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/proveedores`);
  }

  getVideojuegosPlataformas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/videojuego-plataformas`).pipe(
      map(videojuegosPlataformas => {
        console.log('Datos de Videojuegos Plataformas:', videojuegosPlataformas); // Añadido para depuración
        return videojuegosPlataformas;
      })
    );
  }
  

  getSucursales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sucursales`);
  }

  private transformPedido(apiPedido: ApiPedido): Pedido {
    return {
      id_pedido: apiPedido.ID_PEDIDO,
      id_proveedor: apiPedido.ID_PROVEEDOR,
      id_videojuego_plataforma: apiPedido.ID_VIDEOJUEGO_PLATAFORMA,
      id_sucursal: apiPedido.ID_SUCURSAL,
      fecha_pedido: new Date(apiPedido.FECHA_PEDIDO),
      precio_unitario: apiPedido.PRECIO_UNITARIO,
      cantidad: apiPedido.CANTIDAD,
      descuento: apiPedido.DESCUENTO,
      total: apiPedido.TOTAL,
      estado: apiPedido.ESTADO
    };
  }
}
