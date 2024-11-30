import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlataformaService {
//atributos
plataformas=[
{
  ID_PLATAFORMA:1,
  NOMBRE:'Nintendo Switch',
},

{
  ID_PLATAFORMA:2,
  NOMBRE:'PlayStation 5',
},
{
  ID_PLATAFORMA:3,
  NOMBRE:'Xbox Series X',
}
];
  
//#region Métodos
constructor(private http:HttpClient) {
}

getPlataformasVideojuego(){
  return this.plataformas;
}

}