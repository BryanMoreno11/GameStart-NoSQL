import { Component, OnInit } from '@angular/core';
import { VideojuegosService } from '../../services/videojuegos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Plataforma, PlataformaService } from '../../services/plataforma.service';
import { CarritoService, IProducto } from '../../services/carrito.service';
import { RouterLink } from '@angular/router';
import {  Producto, ProductosService } from '../../services/productos.service';
@Component({
  selector: 'app-videojuegos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './videojuegos.component.html',
  styleUrl: './videojuegos.component.css'
})
export class VideojuegosComponent implements OnInit {
  //#region Variables
  productos:IProducto[]=[];
  productos_auxiliar:IProducto[]=[];
  plataformas:Plataforma[]=[];
  metodoOrdenamientoSeleccionado:string="defecto";
  plataforma:string="";
  formato:string="";



  //#region Métodos
  ngOnInit(){
    this.obtenerVideojuegos();
    this.obtenerPlataformas();
    
  }

  constructor( private plataforma_service:PlataformaService,
    private carrito_service:CarritoService, private _productoService:ProductosService) {
    
  }

  agregarProducto(producto:IProducto){
    if(this.carrito_service.validarStockProductoInsertar(producto,1)){
      this.carrito_service.insertarProducto(producto,1);


    }

  }

  obtenerVideojuegos(){
  this._productoService.getProductos().subscribe(
      (res:any)=>{
        this.productos=res;
        this.productos_auxiliar=res;
        console.log("Los productos son ",this.productos);
      }
    );
  }

  obtenerPlataformas(){
    this.plataforma_service.getPlataformas().subscribe(
      (res:any)=>{
        this.plataformas=res;
        console.log("Las plataformas son ",this.plataformas);
      }
    );
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
  this.productos=this.productos.sort((a:Producto,b:Producto)=>a.precio-b.precio);
}

ordenarMayormenor(){
  this.productos=this.productos.sort((a:Producto,b:Producto)=>b.precio-a.precio);
}

ordenarDefecto(){
  this.productos=this.productos.sort((a:Producto,b:Producto)=>a.nombre.toLowerCase() < b.nombre.toLowerCase() ? -1 : 1);

}

//Métodos de clasificación

clasificarporCategoria(plataforma?:string, formato?:string){
   Object.assign(this.productos,this.productos_auxiliar);
  this.ordenarMetodos(this.metodoOrdenamientoSeleccionado);
  if(plataforma!=""){
    this.productos=this.productos.filter((videojuego:Producto)=> videojuego.plataforma.nombre==plataforma);
  }
  if(formato!=""){
    console.log("El formato del videojuego es ", this.productos[0]);
    this.productos=this.productos.filter((videojuego:Producto)=> videojuego.tipo.nombre==formato);
  }
}


}
