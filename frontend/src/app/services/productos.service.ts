import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  //region atributos
  private urlBase='http://localhost:3000/api/';

  //region métodos
  constructor(private _httpClient: HttpClient) { 

  }

  getProductos(){
    return this._httpClient.get(this.urlBase+'productos');
  }

  getProducto(id:number | string){
    return this._httpClient.get(this.urlBase+`productos/${id}`);
  }


}
