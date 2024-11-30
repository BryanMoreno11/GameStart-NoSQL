import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../models/empleado';
import { ApiEmpleado } from '../models/empleado';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<ApiEmpleado[]>(`${this.apiUrl}/empleados`).pipe(
      map((apiEmpleados: ApiEmpleado[]) => apiEmpleados.map((apiEmpleado: ApiEmpleado) => this.transformEmpleado(apiEmpleado)))
    );
  }

  addEmpleado(empleado: Empleado): Observable<any> {
    return this.http.post(`${this.apiUrl}/empleados`, empleado);
  }

  updateEmpleado(id: number, empleado: Empleado): Observable<any> {
    return this.http.put(`${this.apiUrl}/empleados/${id}`, empleado);
  }

  deleteEmpleado(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/empleados/${id}`);
  }

  getSucursales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sucursales`);
  }

  getCiudades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ciudades`);
  }

  getPuestos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/puestos`);
  }

  private transformEmpleado(apiEmpleado: ApiEmpleado): Empleado {
    return {
      id_empleado: apiEmpleado.ID_EMPLEADO,
      id_sucursal: apiEmpleado.ID_SUCURSAL,
      id_ciudad: apiEmpleado.ID_CIUDAD,
      id_puesto: apiEmpleado.ID_PUESTO,
      cedula: apiEmpleado.CEDULA,
      nombre: apiEmpleado.NOMBRE,
      fecha_nacimiento: new Date(apiEmpleado.FECHA_NACIMIENTO),
      direccion: apiEmpleado.DIRECCION,
      telefono: apiEmpleado.TELEFONO,
      correo: apiEmpleado.CORREO,
      estado: apiEmpleado.ESTADO,
      fecha_creacion: new Date(apiEmpleado.FECHA_CREACION)
    };
  }
}