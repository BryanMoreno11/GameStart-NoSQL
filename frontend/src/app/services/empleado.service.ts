import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../models/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  // API URL that corresponds to your controller endpoints
  private apiUrl = 'http://localhost:3000/api';

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
