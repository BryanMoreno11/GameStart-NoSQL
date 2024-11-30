import { Component, OnInit } from '@angular/core';
import { VideojuegosService } from '../../services/videojuegos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlataformaService } from '../../services/plataforma.service';
import { CarritoService } from '../../services/carrito.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-videojuegos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './videojuegos.component.html',
  styleUrl: './videojuegos.component.css'
})
export class VideojuegosComponent implements OnInit {
  //#region Variables
  videojuegos:any;
  videojuegos_auxiliar:any;
  plataformas:any;
  metodoOrdenamientoSeleccionado:string="defecto";
  plataforma:string="";



  //#region Métodos
  ngOnInit(){
    this.obtenerVideojuegos();
    this.obtenerPlataformas();
    
  }

  constructor(private videojuegos_service:VideojuegosService, private plataforma_service:PlataformaService,
    private carrito_service:CarritoService){
    
  }

  agregarVideojuego(videojuego:any){
    this.carrito_service.insertarProducto(videojuego,1);
  }

  obtenerVideojuegos(){
    this.videojuegos= this.videojuegos_service.getVideojuegos();
    this.videojuegos_auxiliar=this.videojuegos;
  }

  obtenerPlataformas(){
    this.plataformas=this.plataforma_service.getPlataformasVideojuego();
  }

  //Métodos de ordenamiento
  ordenarMetodos( forma:string){
    switch(forma){
      case "defecto":
      this.ordenarDefecto();
        break;
      case "menorMayor":
        this.ordenarMenorMayor();
        break;
      case "mayorMenor":
        this.ordenarMayormenor();
        
    }
  }

ordenarMenorMayor(){
  this.videojuegos=this.videojuegos.sort((a:any,b:any)=>a.PRECIO-b.PRECIO);
}

ordenarMayormenor(){
  this.videojuegos=this.videojuegos.sort((a:any,b:any)=>b.PRECIO-a.PRECIO);
}

ordenarDefecto(){
  this.videojuegos=this.videojuegos.sort((a:any,b:any)=>a.TITULO.toLowerCase() < b.TITULO.toLowerCase() ? -1 : 1);

}

//Métodos de clasificación

clasificarporCategoria(plataforma:string){
   Object.assign(this.videojuegos,this.videojuegos_auxiliar);
  this.ordenarMetodos(this.metodoOrdenamientoSeleccionado);
  if(plataforma!=""){
    this.videojuegos=this.videojuegos.filter((videojuego:any)=> videojuego.NOMBRE_PLATAFORMA==plataforma);
  }
}


}
