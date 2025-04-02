import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../models/empleado';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get all empleados
  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.apiUrl}/empleados`);
  }

  // Get an empleado by id
  getEmpleadoById(id: string): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/empleados/${id}`);
  }

  // Create an empleado
  addEmpleado(empleado: Empleado): Observable<any> {
    return this.http.post(`${this.apiUrl}/empleados`, empleado);
  }

  // Update an empleado by id
  updateEmpleado(id: string, empleado: Empleado): Observable<any> {
    return this.http.put(`${this.apiUrl}/empleados/${id}`, empleado);
  }

  // Delete an empleado by id
  deleteEmpleado(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/empleados/${id}`);
  }
}
