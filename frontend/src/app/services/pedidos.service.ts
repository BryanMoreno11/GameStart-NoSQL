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

  getPedidos(): Observable<ApiPedido[]> {
    return this.http.get<ApiPedido[]>(`${this.apiUrl}/pedidos`);
  }

  addPedido(pedido: ApiPedido): Observable<any> {
    return this.http.post(`${this.apiUrl}/pedidos`, pedido);
  }


  updatePedido(id: string, pedido: ApiPedido): Observable<any> {
    return this.http.put(`${this.apiUrl}/pedidos/${id}`, pedido);
  }

  deletePedido(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pedidos/${id}`);
  }

  getProveedores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/proveedores`);
  }

  getVideojuegosPlataformas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/plataformas`).pipe(
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
      id_pedido: apiPedido._id,  // Asegúrate de mapear el id correctamente
      proveedor: {
        id: apiPedido.proveedor._id,
        nombre: apiPedido.proveedor.nombre
      },
      producto: {
        id: apiPedido.producto._id,
        nombre: apiPedido.producto.nombre,
        plataforma: apiPedido.producto.plataforma.nombre  // Suponiendo que solo quieres el nombre de la plataforma
      },
      precio_unitario: apiPedido.precio_unitario,
      cantidad: apiPedido.cantidad,
      descuento: apiPedido.descuento,
      total: apiPedido.total,
      fecha_pedido: new Date(apiPedido.fecha_pedido)  // Transformar la fecha correctamente
    };
  }
}
