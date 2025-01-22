import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  // URL base de la API
  API_URL = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {}

  // Métodos para obtener datos del dashboard
  getVideojuegosVentas() {
    return this.http.get(`${this.API_URL}dashboard/videojuegos/ventas`);
  }

  getVideojuegosRecaudacion() {
    return this.http.get(`${this.API_URL}dashboard/videojuegos/recaudacion`);
  }

  getGenerosVentas() {
    return this.http.get(`${this.API_URL}dashboard/generos/ventas`);
  }

  getGenerosRecaudacion() {
    return this.http.get(`${this.API_URL}dashboard/generos/recaudacion`);
  }

  getPlataformasVentas() {
    return this.http.get(`${this.API_URL}dashboard/plataformas/ventas`);
  }

  getPlataformasRecaudacion() {
    return this.http.get(`${this.API_URL}dashboard/plataformas/recaudacion`);
  }

  getCantidadProveedor() {
    return this.http.get(`${this.API_URL}dashboard/proveedores/cantidad`);
  }

  getRecaudacionProveedor() {
    return this.http.get(`${this.API_URL}dashboard/proveedores/recaudacion`);
  }

  getCantidadVentasFormato() {
    return this.http.get(`${this.API_URL}dashboard/formato/cantidad`);
  }

  getRecaudacionFormato() {
    return this.http.get(`${this.API_URL}dashboard/formato/recaudacion`);
  }
}