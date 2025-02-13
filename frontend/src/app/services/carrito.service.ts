import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';





@Injectable({
  providedIn: 'root'
})
export class CarritoService {
//region Atributos
carrito:ICarrito={
 
  productos:[],
  subtotal:0,
  iva:0,
  total:0,
  cantidad:0
};
 iva = 0.15;

urlBase='http://localhost:3000/api/';

//#region Métodos
ngOnInit(): void {
  
}

constructor(private _httpClient: HttpClient) { 
  this.cargarProductos();
}

saveVenta(carrito:ICarrito): Observable<VentaResponse> {
  return this._httpClient.post<VentaResponse>(`${this.urlBase}ventas`, carrito);
}

getVenta(id:string): Observable<Venta> {
  return this._httpClient.get<Venta>(`${this.urlBase}ventas/${id}`);
}

cargarProductos(){
  let carrito=localStorage.getItem("carrito");
  if(carrito){
    
    this.carrito= JSON.parse(carrito);
  }
}


mostrarMensaje(titulo:string, mensaje:string, icono:any) {
  Swal.fire({
      title: titulo,
      text: mensaje,
      icon: icono
    });
}

msgAlert(icon:any, text:string, timer:number, confirm:boolean){
  Swal.fire({
    icon: icon,
    text: text,
    toast: true,
    position: 'top-start',
    showConfirmButton: confirm,
    timer: timer,
    customClass: {
      popup: 'custom-toast' // Agrega la clase de estilo personalizado
    }
  });

}

 obtenerProductoCarrito(id_producto:number | string):IProducto | undefined {
  return this.carrito.productos.find(
    (producto:IProducto) => producto._id == id_producto
  );
}

 validarStockProductoInsertar(producto:IProducto, cantidadActual:number) {
  let cantidadTotal = 0;
  let productoCarrito = this.obtenerProductoCarrito(producto._id);
  if (productoCarrito && productoCarrito.cantidad) {
    cantidadTotal = productoCarrito.cantidad + cantidadActual;
  } else {
    cantidadTotal = cantidadActual;
  }
  if (producto.stock >= cantidadTotal) {
    return true;
  } else {
    let mensaje=`El producto cuenta con ${producto.stock} existencias`;
    if(productoCarrito ){
        mensaje+=` y actualmente tienes ${productoCarrito.cantidad} en el carrito`;
    }
    this.mostrarMensaje("Error", mensaje, "error");
    return false;
  }
}

validarStockProductoModificar(producto:IProducto, cantidad:number) { 
  if(producto.stock >= cantidad) {
    return true;
  } else {
    let mensaje=`El producto cuenta con ${producto.stock} existencias`;
    this.mostrarMensaje("Error", mensaje, "error");
    return false;
  }
}

insertarProducto(producto:IProducto, cantidad:number){
    let importe=Math.round(producto.precio * cantidad*100)/100;
    let objProducto:IProducto={
      ...producto,
      cantidad:cantidad,
      importe:importe
    }
    let productoCarrito = this.obtenerProductoCarrito(producto._id);
    if (productoCarrito && productoCarrito.cantidad && productoCarrito.importe) {
      productoCarrito.cantidad += cantidad;
      productoCarrito.importe += importe;
    } else {
      this.carrito.productos.push(objProducto);
    }
    this.calculosCarrito();
    localStorage.setItem("carrito",JSON.stringify(this.carrito));
    this.msgAlert("success", "Producto agregado al carrito", 1500, true);
  
}


modificarProducto(producto:IProducto, cantidad:number) {
  let productoCarrito = this.obtenerProductoCarrito(producto._id  );
  if (productoCarrito) {
    productoCarrito.cantidad = cantidad;
    productoCarrito.importe = Math.round(productoCarrito.precio * productoCarrito.cantidad*100)/100;
  }
  console.log("Ahora el producto es ", productoCarrito);
  this.calculosCarrito();
  localStorage.setItem("carrito",JSON.stringify(this.carrito));
}

eliminarProductoCarrito(id: number | string) {
  let producto = this.obtenerProductoCarrito(id);
  if (producto) {
    let posicion = this.carrito.productos.indexOf(producto);
    this.carrito.productos.splice(posicion, 1);
    this.calculosCarrito();
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.mostrarMensaje("success","Producto eliminado del carrito","success");
  }
}

efectuarCompra(){
  this.carrito={
    productos:[],
    subtotal:0,
    iva:0,
    total:0,
    cantidad:0
  };
  localStorage.setItem("carrito",JSON.stringify(this.carrito));

}

 calculosCarrito() {
  this.calcularSubtotal();
  this.calcularIva();
  this.calcularTotal();
  this.calcularCantidad();
}

 calcularSubtotal() {
  let subtotal = this.carrito.productos.reduce(
    (accumulator, producto) => accumulator + (producto.importe ?? 0),    0
  );
  this.carrito.subtotal = Math.round(subtotal * 100) / 100;
}

 calcularIva() {
  let valorIva = this.carrito.productos.reduce(
    (accumulator, producto) => accumulator + (producto.importe ?? 0) * this.iva,
    0
  );
  this.carrito.iva = Math.round(valorIva * 100) / 100;
}

 calcularTotal() {
  let total = this.carrito.subtotal + this.carrito.iva;
  this.carrito.total = Math.round(total * 100) / 100;
}

 calcularCantidad() {
  
  this.carrito.cantidad = this.carrito.productos.reduce(
    (accumulator, producto) => accumulator + (producto.cantidad??0),
    0
  );
}

}
//#region Interfaces
export interface IProducto {
  _id: string;
  nombre: string;
  desarrolladora: string;
  plataforma: {
    nombre: string;
    descripcion: string;
    fecha_creacion: string;
  };
  genero: {
    nombre: string;
    descripcion: string;
    fecha_creacion: string;
  };
  tipo: {
    nombre: string;
    descripcion: string;
    fecha_creacion: string;
  };
  precio: number;
  stock: number;
  claves_digitales: string[] | null;
  imagenes: string[];
  fecha_creacion: string;
  descripcion: string;
  cantidad: number;
  importe?: number;
}


export interface ICarrito {
  _id?: string;
  cliente?: Cliente;
  productos: IProducto[];
  subtotal: number;
  iva: number;
  total: number;
  cantidad: number;
  fecha_venta?: string;
}

export interface VentaResponse {
  message: string;
  ventaId: string;
}

export interface Cliente {
  _id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  contrasenia: string;
  secret: string;
  fecha_nacimiento: Date;
  fecha_registro: Date;
}

export interface Venta{
  _id: string;
  cliente: Cliente;
  fecha_venta: Date;
  productos: IProducto[];
  subtotal: number;
  iva: number;
  total: number;
  clavesUsuario: any[];
}

