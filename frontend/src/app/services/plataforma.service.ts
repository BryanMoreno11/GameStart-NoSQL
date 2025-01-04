import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlataformaService {

  private urlBase='http://localhost:3000/api/';

  //region métodos
  constructor(private _httpClient: HttpClient) { 

  }

  getPlataformas():Observable<Plataforma[]>{
    return this._httpClient.get<Plataforma[]>(this.urlBase+'plataformas');
  }

  getProducto(id:number | string):Observable<Plataforma>{
    return this._httpClient.get<Plataforma>(this.urlBase+`plataforma/${id}`);
  }



}

export interface  Plataforma {
  _id: string;            
  nombre: string;        
  descripcion: string;    
  fecha_creacion: string | Date;  
}
