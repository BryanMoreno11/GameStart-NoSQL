import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
//region Atributos
carrito:Carrito={
  subtotal_venta:0,
  total_venta:0,
  iva:0,
  cantidad_total:0
}
productos:Producto[]=[];
msgAlert=(icon:any, text:string, timer:number, confirm:boolean)=>{Swal.fire({
  icon: icon,
  text: text,
  toast: true,
  position: 'top-start',
  showConfirmButton: confirm,
  timer: timer,
  customClass: {
    popup: 'custom-toast' // Agrega la clase de estilo personalizado
  }
 
});} 

ngOnInit(): void {
  
}

constructor() { 
  this.cargarProductos();
}

//#region Métodos
insertarProducto(videojuego:any,cantidad:number){
  //Primero creamos el objeto producto
  let producto:Producto={
    videojuego: videojuego,
    cantidad:cantidad,
    precio_total:videojuego.PRECIO,
  }
  producto.precio_total=producto.cantidad*producto.videojuego.PRECIO;
  /*Buscamos en nuestro arreglo de productos un elemento que tenga el videojuego que se pasa como parámetro, en caso que no
  este simplemente se lo agrega*/
  let ob_producto=this.productos[this.obtenerPosicionProducto(producto)];
  if(this.obtenerPosicionProducto(producto)==-1 ) {
    this.productos.push(producto);
    this.msgAlert("success","Producto agregado con éxito",1000,false);
  }
  /*En caso de que el videojuego ya se haya agregado, se verifica que la cantidad que tenía anteriormente sumada a la actual
  sea menor o igual al stock del producto*/
  else if(ob_producto.cantidad+cantidad<=videojuego.STOCK){
    console.log("Producto agregado anteriormente");
    ob_producto.cantidad+=cantidad;
    ob_producto.precio_total= videojuego.PRECIO*ob_producto.cantidad;
    this.msgAlert("success","Producto agregado con éxito",1000,false);

  }else{
    this.msgAlert("error",`No puedes añadir esa cantidad al carrito — tenemos ${videojuego.STOCK} existencias y ya haz añadido ${ob_producto.cantidad}`,3000,true);
  }
  localStorage.setItem("productos",JSON.stringify(this.productos));
  this.efectuarCalculos();
  console.log(this.carrito);
}

eliminarProducto(producto:Producto){
  this.productos=this.productos.filter((item:Producto)=>item.videojuego.ID_VIDEOJUEGO_PLATAFORMA!=producto.videojuego.ID_VIDEOJUEGO_PLATAFORMA);
  localStorage.setItem("productos",JSON.stringify(this.productos));
  this.efectuarCalculos();
}

cargarProductos(){
  let objeto=localStorage.getItem("productos");
  let objeto_carrito=localStorage.getItem("carro");
  if(objeto && objeto_carrito){
    this.productos= JSON.parse(objeto);
    this.carrito= JSON.parse(objeto_carrito);
  }
}

setCantidad(producto:Producto,cantidad:number){
  let articulo= this.productos[this.productos.indexOf(producto)];
  if(cantidad<=producto.videojuego.STOCK){
    articulo.cantidad=cantidad;
    articulo.precio_total= producto.videojuego.PRECIO*cantidad;
    localStorage.setItem("productos",JSON.stringify(this.productos));
  }
  else{
    this.msgAlert("error",`No puedes añadir esa cantidad al carrito — tenemos ${producto.videojuego.STOCK} existencias`,3000,true);
  }
  this.efectuarCalculos();
}

obtenerPosicionProducto(producto:any):number{
    let item:any;
    if(this.productos.length>0){
      item= this.productos.find((ob:any)=>{
         return ob.videojuego.ID_VIDEOJUEGO_PLATAFORMA==producto.videojuego.ID_VIDEOJUEGO_PLATAFORMA;
        });
    }

    if(item){
      return this.productos.indexOf(item);
    }
    else{
      return -1;
    }
  
}

efectuarCalculos(){
  this.calcularSubtotal();
  this.calcularIva();
  this.calcularTotal();
  this.calcularCantidad();
  localStorage.setItem("carro",JSON.stringify(this.carrito));
}

calcularSubtotal(){
   let subtotal= this.productos.reduce((accumulator:number,producto:any)=>accumulator+producto.precio_total,0);
   this.carrito.subtotal_venta= Math.round(subtotal*100)/100;
}

calcularIva(){
  let iva= this.productos.reduce((accumulator:number,producto:any)=>accumulator+(producto.precio_total*0.15),0);
  this.carrito.iva= Math.round(iva*100)/100;
}

calcularTotal(){
 let total=this.carrito.subtotal_venta+this.carrito.iva;
 this.carrito.total_venta=Math.round(total*100)/100;
}

calcularCantidad(){
  this.carrito.cantidad_total=this.productos.reduce((accumulator:number, producto:any)=>accumulator+producto.cantidad,0);
}

efectuarCompra(){
  this.productos=[];
  this.carrito={} as Carrito;
  localStorage.setItem("productos",JSON.stringify(this.productos));
  localStorage.setItem("carro",JSON.stringify(this.carrito));

}

mensajeAlertaStock(producto:Producto){
  this.msgAlert("error",`No puedes añadir esa cantidad al carrito — tenemos ${producto.videojuego.STOCK} existencias`,10000,true);

}

mensajeAlertaStockVideojuego(videojuego:any){
  this.msgAlert("error",`No puedes añadir esa cantidad al carrito — tenemos ${videojuego.STOCK} existencias`,10000,true);

}

mensajeAlertaStockNegativo(){
  this.msgAlert("error",`Debe ingresar valores positivos`,10000,true);

}

}

//#region Interfaces
export interface Producto{
  videojuego:any,
  cantidad: number,
  precio_total:number
}

export interface Carrito{
  subtotal_venta:number,
  total_venta:number,
  iva:number,
  cantidad_total:number
}

